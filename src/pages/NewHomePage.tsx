
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCraftsmen } from '@/hooks/useCraftsmen';
import { useCategories } from '@/hooks/useCategories';
import { useCities } from '@/hooks/useCities';
import { useAuth } from '@/hooks/useAuth';

const NewHomePage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: craftsmen, isLoading: craftsmenLoading } = useCraftsmen();
  const { data: categories } = useCategories();
  const { data: cities } = useCities();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const filteredCraftsmen = craftsmen?.filter(craftsman => {
    const matchesSearch = searchTerm === '' || 
      craftsman.profiles.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      craftsman.profiles.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      craftsman.categories.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || craftsman.category_id === selectedCategory;
    const matchesCity = selectedCity === '' || craftsman.profiles.cities?.name === selectedCity;
    
    return matchesSearch && matchesCategory && matchesCity;
  });

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-khedamni-blue">
              <span className="text-khedamni-orange">خ</span>دمني
            </Link>
            
            <nav className="hidden md:flex space-x-8 space-x-reverse">
              <Link to="/home" className="text-gray-700 hover:text-khedamni-blue">الرئيسية</Link>
              <Link to="/about" className="text-gray-700 hover:text-khedamni-blue">من نحن</Link>
              <Link to="/contact" className="text-gray-700 hover:text-khedamni-blue">اتصل بنا</Link>
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">مرحباً، {user.email}</span>
                  <Button
                    onClick={signOut}
                    variant="outline"
                    size="sm"
                    className="text-sm"
                  >
                    تسجيل خروج
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button className="bg-khedamni-blue hover:bg-blue-700 text-white">
                    تسجيل دخول
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ابحث عن الحرفي المناسب
            </h1>
            <p className="text-gray-600">
              اعثر على أفضل الحرفيين في مدينتك
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="ابحث عن حرفي أو مهنة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 text-right"
                  dir="rtl"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 text-right" dir="rtl">
                <SelectValue placeholder="اختر المهنة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع المهن</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full md:w-48 text-right" dir="rtl">
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع المدن</SelectItem>
                {cities?.map((city) => (
                  <SelectItem key={city.id} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {craftsmenLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-khedamni-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الحرفيين...</p>
          </div>
        ) : filteredCraftsmen && filteredCraftsmen.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCraftsmen.map((craftsman) => (
              <div key={craftsman.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden ml-4">
                    {craftsman.profiles.avatar_url ? (
                      <img 
                        src={craftsman.profiles.avatar_url} 
                        alt={`${craftsman.profiles.first_name} ${craftsman.profiles.last_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-khedamni-blue/20 flex items-center justify-center">
                        <span className="text-khedamni-blue font-bold text-lg">
                          {craftsman.profiles.first_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {craftsman.profiles.first_name} {craftsman.profiles.last_name}
                    </h3>
                    <p className="text-khedamni-blue text-sm">{craftsman.categories.name}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 mr-1">
                        {craftsman.rating.toFixed(1)} ({craftsman.total_reviews} مراجعة)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 ml-2" />
                    <span>{craftsman.profiles.cities?.name || 'غير محدد'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>خبرة {craftsman.experience_years} سنوات</span>
                  </div>
                  {craftsman.hourly_rate && (
                    <div className="text-sm text-gray-600">
                      <span>{craftsman.hourly_rate} د.ل/ساعة</span>
                    </div>
                  )}
                </div>

                {craftsman.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {craftsman.description}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/craftsman/${craftsman.id}`)}
                    className="flex-1 bg-khedamni-blue hover:bg-blue-700 text-white text-sm"
                  >
                    عرض التفاصيل
                  </Button>
                  {craftsman.profiles.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="p-2"
                      onClick={() => window.open(`tel:${craftsman.profiles.phone}`)}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">لا توجد نتائج</div>
            <p className="text-gray-400">جرب تغيير معايير البحث</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewHomePage;
