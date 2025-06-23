
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useCities } from '@/hooks/useCities';
import { useCategories } from '@/hooks/useCategories';
import { Eye, EyeOff, Mail } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  const { data: cities } = useCities();
  const { data: categories } = useCategories();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    userType: 'client' as 'client' | 'craftsman',
    gender: '',
    cityId: '',
    categoryId: ''
  });

  // إذا كان المستخدم مسجل دخول، وجهه للصفحة الرئيسية
  useEffect(() => {
    if (user && !loading) {
      console.log('User is logged in, redirecting to /new-home');
      navigate('/new-home');
    }
  }, [user, loading, navigate]);

  const validateSignupForm = () => {
    const errors = [];
    
    if (!formData.firstName.trim()) {
      errors.push('الاسم الأول مطلوب');
    }
    if (!formData.lastName.trim()) {
      errors.push('اسم العائلة مطلوب');
    }
    if (!formData.email.trim()) {
      errors.push('البريد الإلكتروني مطلوب');
    }
    if (!formData.password.trim()) {
      errors.push('كلمة المرور مطلوبة');
    }
    if (formData.password.length < 6) {
      errors.push('كلمة المرور يجب أن تكون على الأقل 6 أحرف');
    }
    if (!formData.userType) {
      errors.push('نوع الحساب مطلوب');
    }
    if (formData.userType === 'craftsman' && !formData.categoryId) {
      errors.push('التخصص مطلوب للحرفي');
    }
    
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    console.log('Form submitted:', { isLogin, formData });

    try {
      if (isLogin) {
        console.log('Attempting login...');
        if (!formData.email.trim() || !formData.password.trim()) {
          alert('يرجى إدخال البريد الإلكتروني وكلمة المرور');
          return;
        }
        
        const { data, error } = await signIn(formData.email, formData.password);
        if (data && !error) {
          console.log('Login successful, redirecting...');
          navigate('/new-home');
        }
      } else {
        console.log('Attempting signup...');
        
        if (!validateSignupForm()) {
          return;
        }

        const userData = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          userType: formData.userType,
          gender: formData.gender || null,
          cityId: formData.cityId || null,
          categoryId: formData.userType === 'craftsman' ? formData.categoryId : null
        };
        
        console.log('User data for signup:', userData);
        
        const { data, error } = await signUp(formData.email.trim(), formData.password, userData);
        if (data && !error) {
          console.log('Signup successful');
          // عرض رسالة نجاح والانتقال لصفحة تسجيل الدخول
          setIsLogin(true);
          setFormData(prev => ({ 
            ...prev, 
            password: '',
            firstName: '',
            lastName: '',
            phone: '',
            gender: '',
            cityId: '',
            categoryId: ''
          }));
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // Filter out items with empty or invalid IDs
  const validCities = cities?.filter(city => city.id && city.id.trim() !== '') || [];
  const validCategories = categories?.filter(category => category.id && category.id.trim() !== '') || [];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="text-2xl font-bold">
              <span className="text-orange-500">خ</span>
              <span className="text-blue-600">دمني</span>
            </div>
          </Link>
          <h1 className="text-xl font-bold text-gray-800 arabic-text">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-right block arabic-text">اللقب *:</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full text-right"
                    dir="rtl"
                    placeholder="أدخل اللقب"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-right block arabic-text">الاسم *:</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full text-right"
                    dir="rtl"
                    placeholder="أدخل الاسم"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-right block arabic-text">رقم الهاتف:</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full text-right"
                  dir="rtl"
                  placeholder="0123456789"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-right block arabic-text">الجنس:</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                    <SelectTrigger className="w-full text-right" dir="rtl">
                      <SelectValue placeholder="اختر جنسك" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">ذكر</SelectItem>
                      <SelectItem value="female">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-right block arabic-text">نوع الحساب *:</Label>
                  <Select value={formData.userType} onValueChange={(value: 'client' | 'craftsman') => setFormData({...formData, userType: value})}>
                    <SelectTrigger className="w-full text-right" dir="rtl">
                      <SelectValue placeholder="اختر نوع الحساب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">عميل</SelectItem>
                      <SelectItem value="craftsman">حرفي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-right block arabic-text">المدينة:</Label>
                <Select value={formData.cityId} onValueChange={(value) => setFormData({...formData, cityId: value})}>
                  <SelectTrigger className="w-full text-right" dir="rtl">
                    <SelectValue placeholder="اختر مدينتك" />
                  </SelectTrigger>
                  <SelectContent>
                    {validCities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.userType === 'craftsman' && (
                <div className="space-y-2">
                  <Label className="text-right block arabic-text">التخصص *:</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => setFormData({...formData, categoryId: value})}>
                    <SelectTrigger className="w-full text-right" dir="rtl">
                      <SelectValue placeholder="اختر تخصصك" />
                    </SelectTrigger>
                    <SelectContent>
                      {validCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-right block arabic-text">البريد الإلكتروني *:</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full text-right pr-10"
                dir="rtl"
                placeholder="أدخل بريدك الإلكتروني"
                required
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-right block arabic-text">كلمة المرور *:</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full text-right pr-10"
                dir="rtl"
                placeholder="أدخل كلمة المرور"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={formLoading || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium arabic-text"
          >
            {formLoading || loading ? 'جاري المعالجة...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء حساب')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline text-sm arabic-text"
          >
            {isLogin ? 'ليس لديك حساب؟ أنشئ حساباً جديداً' : 'لديك حساب؟ سجل دخولك'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
