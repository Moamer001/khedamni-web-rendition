
-- تحديث دالة handle_new_user لتتعامل مع الحالات التي لا توجد فيها بيانات إضافية
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    email, 
    phone,
    user_type,
    gender,
    city_id
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', 'غير محدد'),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', 'غير محدد'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NULL),
    COALESCE((NEW.raw_user_meta_data ->> 'user_type')::user_type, 'client'),
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'gender' = 'male' THEN 'male'::gender_type
      WHEN NEW.raw_user_meta_data ->> 'gender' = 'female' THEN 'female'::gender_type
      ELSE NULL
    END,
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'city_id' IS NOT NULL 
      THEN (NEW.raw_user_meta_data ->> 'city_id')::uuid
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
