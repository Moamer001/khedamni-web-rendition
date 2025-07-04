
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting to sign in with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Sign in successful:', data);
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "أهلاً بك في خدمني",
      });
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      console.log('Attempting to sign up with:', { email, userData });
      
      // التأكد من صحة البيانات قبل الإرسال
      const cleanUserData = {
        first_name: userData.firstName?.toString().trim() || '',
        last_name: userData.lastName?.toString().trim() || '',
        phone: userData.phone?.toString().trim() || '',
        user_type: userData.userType || 'client',
        gender: userData.gender || null,
        city_id: userData.cityId || null,
        category_id: userData.userType === 'craftsman' ? (userData.categoryId || null) : null
      };

      // التأكد من وجود البيانات الأساسية
      if (!cleanUserData.first_name || !cleanUserData.last_name) {
        throw new Error('الاسم الأول واسم العائلة مطلوبان');
      }

      console.log('Clean user data for signup:', cleanUserData);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: cleanUserData,
          emailRedirectTo: `${window.location.origin}/new-home`
        },
      });
      
      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }
      
      console.log('Sign up successful:', data);

      // إنشاء سجل حرفي إذا كان نوع المستخدم حرفي
      if (data.user && cleanUserData.user_type === 'craftsman' && cleanUserData.category_id) {
        console.log('Creating craftsman record...');
        
        // انتظار قليل للتأكد من إنشاء الملف الشخصي أولاً
        setTimeout(async () => {
          try {
            const { error: craftsmanError } = await supabase
              .from('craftsmen')
              .insert({
                user_id: data.user!.id,
                category_id: cleanUserData.category_id,
                experience_years: 0,
                description: '',
                skills: [],
                payment_methods: [],
                hourly_rate: null,
                available_at_home: false,
                has_car: false,
                is_verified: false,
                rating: 0.0,
                total_reviews: 0
              });

            if (craftsmanError) {
              console.error('Error creating craftsman record:', craftsmanError);
            } else {
              console.log('Craftsman record created successfully');
            }
          } catch (err) {
            console.error('Error in craftsman creation:', err);
          }
        }, 2000);
      }
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "تحقق من بريدك الإلكتروني لتأكيد الحساب",
      });
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      let errorMessage = error.message;
      
      // تحسين رسائل الخطأ
      if (error.message.includes('already exists')) {
        errorMessage = 'هذا البريد الإلكتروني مستخدم مسبقاً';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'كلمة المرور يجب أن تكون على الأقل 6 أحرف';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'البريد الإلكتروني غير صحيح';
      } else if (error.message.includes('Database error')) {
        errorMessage = 'خطأ في قاعدة البيانات، يرجى المحاولة مرة أخرى';
      }
      
      toast({
        title: "خطأ في إنشاء الحساب",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting to sign out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Sign out successful');
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "إلى اللقاء!",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "خطأ في تسجيل الخروج",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
