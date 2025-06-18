
-- إنشاء الـ Enums المطلوبة
CREATE TYPE user_type AS ENUM ('client', 'craftsman');
CREATE TYPE gender_type AS ENUM ('male', 'female');
CREATE TYPE order_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled');

-- جدول المدن
CREATE TABLE public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول الفئات والمهن
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول الملفات الشخصية للمستخدمين
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  user_type user_type NOT NULL DEFAULT 'client',
  gender gender_type,
  avatar_url TEXT,
  city_id UUID REFERENCES public.cities(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول الحرفيين (بيانات إضافية)
CREATE TABLE public.craftsmen (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  experience_years INTEGER NOT NULL DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  description TEXT,
  skills TEXT[],
  available_at_home BOOLEAN DEFAULT false,
  has_car BOOLEAN DEFAULT false,
  payment_methods TEXT[],
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- جدول أعمال الحرفيين
CREATE TABLE public.craftsman_works (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  craftsman_id UUID NOT NULL REFERENCES public.craftsmen(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول الطلبات
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(id),
  craftsman_id UUID NOT NULL REFERENCES public.craftsmen(id),
  category_id UUID NOT NULL REFERENCES public.categories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  estimated_price DECIMAL(10,2),
  status order_status NOT NULL DEFAULT 'pending',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول المراجعات والتقييمات
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id),
  craftsman_id UUID NOT NULL REFERENCES public.craftsmen(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(order_id)
);

-- جدول الرسائل
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل Row Level Security على جميع الجداول
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.craftsmen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.craftsman_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- سياسات المدن والفئات (قراءة عامة)
CREATE POLICY "Anyone can view cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

-- سياسات الملفات الشخصية
CREATE POLICY "Users can view their own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- سياسات الحرفيين
CREATE POLICY "Anyone can view craftsmen" ON public.craftsmen FOR SELECT USING (true);
CREATE POLICY "Craftsmen can update their own data" ON public.craftsmen 
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Craftsmen can insert their own data" ON public.craftsmen 
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- سياسات أعمال الحرفيين
CREATE POLICY "Anyone can view craftsman works" ON public.craftsman_works FOR SELECT USING (true);
CREATE POLICY "Craftsmen can manage their own works" ON public.craftsman_works 
  FOR ALL USING (craftsman_id IN (SELECT id FROM public.craftsmen WHERE user_id = auth.uid()));

-- سياسات الطلبات
CREATE POLICY "Users can view their related orders" ON public.orders 
  FOR SELECT USING (
    client_id = auth.uid() OR 
    craftsman_id IN (SELECT id FROM public.craftsmen WHERE user_id = auth.uid())
  );
CREATE POLICY "Clients can create orders" ON public.orders 
  FOR INSERT WITH CHECK (client_id = auth.uid());
CREATE POLICY "Users can update their related orders" ON public.orders 
  FOR UPDATE USING (
    client_id = auth.uid() OR 
    craftsman_id IN (SELECT id FROM public.craftsmen WHERE user_id = auth.uid())
  );

-- سياسات المراجعات
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Order participants can create reviews" ON public.reviews 
  FOR INSERT WITH CHECK (
    reviewer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND 
      (client_id = auth.uid() OR craftsman_id IN (SELECT id FROM public.craftsmen WHERE user_id = auth.uid()))
    )
  );

-- سياسات الرسائل
CREATE POLICY "Order participants can view messages" ON public.messages 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND 
      (client_id = auth.uid() OR craftsman_id IN (SELECT id FROM public.craftsmen WHERE user_id = auth.uid()))
    )
  );
CREATE POLICY "Order participants can send messages" ON public.messages 
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND 
      (client_id = auth.uid() OR craftsman_id IN (SELECT id FROM public.craftsmen WHERE user_id = auth.uid()))
    )
  );

-- إنشاء Storage Buckets للملفات
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('profile-images', 'profile-images', true),
  ('work-images', 'work-images', true),
  ('documents', 'documents', false);

-- سياسات Storage للصور الشخصية
CREATE POLICY "Users can upload their profile images" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view profile images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'profile-images');
CREATE POLICY "Users can update their profile images" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their profile images" ON storage.objects 
  FOR DELETE USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- سياسات Storage لصور الأعمال
CREATE POLICY "Craftsmen can upload work images" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'work-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Anyone can view work images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'work-images');
CREATE POLICY "Craftsmen can update their work images" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'work-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Craftsmen can delete their work images" ON storage.objects 
  FOR DELETE USING (bucket_id = 'work-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- تريجر لتحديث الملف الشخصي عند إنشاء مستخدم جديد
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'user_type')::user_type, 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- إدراج البيانات التجريبية
INSERT INTO public.cities (name) VALUES 
  ('طرابلس'), ('بنغازي'), ('مصراتة'), ('الزاوية'), ('سبها'), ('البيضاء'), ('زليتن'), ('اجدابيا'), ('غريان'), ('صبراتة');

INSERT INTO public.categories (name, description) VALUES 
  ('سباك', 'أعمال السباكة وإصلاح المياه'),
  ('كهربائي', 'أعمال الكهرباء والإنارة'),
  ('نجار', 'أعمال النجارة والأثاث'),
  ('دهان', 'أعمال الدهان والديكور'),
  ('بناء', 'أعمال البناء والتشييد'),
  ('تكييف', 'أعمال التكييف والتبريد'),
  ('محرك', 'إصلاح السيارات والمحركات'),
  ('تنظيف', 'خدمات التنظيف المنزلي');
