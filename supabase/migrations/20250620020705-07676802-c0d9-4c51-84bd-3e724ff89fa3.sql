
-- إنشاء الـ Enums المطلوبة إذا لم تكن موجودة
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
        CREATE TYPE user_type AS ENUM ('client', 'craftsman');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_type') THEN
        CREATE TYPE gender_type AS ENUM ('male', 'female');
    END IF;
END $$;

-- تحديث الـ trigger function لمعالجة البيانات بشكل صحيح
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
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
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

-- التأكد من وجود الـ trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
