
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
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "أهلاً بك في خدمني",
      });
      
      return { data, error: null };
    } catch (error: any) {
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone: userData.phone,
            user_type: userData.user_type,
            gender: userData.gender,
            city_id: userData.city_id
          },
          emailRedirectTo: `${window.location.origin}/new-home`
        },
      });
      
      if (error) throw error;
      
      // إذا تم إنشاء المستخدم بنجاح، قم بإنشاء/تحديث الملف الشخصي
      if (data.user) {
        // انتظار قليل للتأكد من إنشاء المستخدم في auth.users
        setTimeout(async () => {
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: email,
                phone: userData.phone,
                user_type: userData.user_type,
                gender: userData.gender,
                city_id: userData.city_id
              }, {
                onConflict: 'id'
              });

            if (profileError) {
              console.error('Profile creation error:', profileError);
            }

            // إذا كان المستخدم حرفي، أنشئ سجل في جدول الحرفيين
            if (userData.user_type === 'craftsman') {
              const { error: craftsmanError } = await supabase
                .from('craftsmen')
                .insert({
                  user_id: data.user.id,
                  category_id: userData.category_id || null,
                  experience_years: 0,
                  rating: 0.0,
                  total_reviews: 0,
                  is_verified: false
                });

              if (craftsmanError) {
                console.error('Craftsman creation error:', craftsmanError);
              }
            }
          } catch (err) {
            console.error('Error creating profile:', err);
          }
        }, 1000);
      }
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "تحقق من بريدك الإلكتروني لتأكيد الحساب",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "إلى اللقاء!",
      });
    } catch (error: any) {
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
