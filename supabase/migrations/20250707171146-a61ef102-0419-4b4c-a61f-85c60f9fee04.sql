
-- Create profiles table for basic user info
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  profile_picture_url TEXT,
  date_of_birth DATE,
  gender TEXT,
  title TEXT,
  bio TEXT,
  setup_step INTEGER DEFAULT 1,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create languages table
CREATE TABLE public.profile_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  language_name TEXT NOT NULL,
  proficiency TEXT NOT NULL CHECK (proficiency IN ('Native', 'Fluent', 'Intermediate', 'Beginner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create experience table
CREATE TABLE public.profile_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credentials table
CREATE TABLE public.profile_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('Certification', 'License', 'Patent')),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  credential_id TEXT,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  does_not_expire BOOLEAN DEFAULT FALSE,
  description TEXT,
  proof_image_url TEXT,
  credential_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create education table
CREATE TABLE public.profile_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  school TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE public.profile_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  subdomain TEXT,
  skill_names TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create social links table
CREATE TABLE public.profile_social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  linkedin TEXT,
  github TEXT,
  twitter TEXT,
  website TEXT,
  other_links TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment methods table
CREATE TABLE public.profile_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  method_type TEXT NOT NULL CHECK (method_type IN ('PayPal', 'Stripe', 'UPI', 'Card')),
  paypal_email TEXT,
  stripe_email TEXT,
  upi_id TEXT,
  card_number TEXT,
  card_expiry TEXT,
  card_cvv TEXT,
  cardholder_name TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for profile pictures and credential proofs
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-assets', 'profile-assets', true);

-- Create trigger to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_payment_methods ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own languages" ON public.profile_languages FOR ALL USING (
  profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can manage own experience" ON public.profile_experience FOR ALL USING (
  profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can manage own credentials" ON public.profile_credentials FOR ALL USING (
  profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can manage own education" ON public.profile_education FOR ALL USING (
  profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can manage own skills" ON public.profile_skills FOR ALL USING (
  profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can manage own social links" ON public.profile_social_links FOR ALL USING (
  profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can manage own payment methods" ON public.profile_payment_methods FOR ALL USING (
  profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Storage policies
CREATE POLICY "Users can upload profile assets" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'profile-assets' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view profile assets" ON storage.objects FOR SELECT USING (
  bucket_id = 'profile-assets'
);

CREATE POLICY "Users can update own profile assets" ON storage.objects FOR UPDATE USING (
  bucket_id = 'profile-assets' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own profile assets" ON storage.objects FOR DELETE USING (
  bucket_id = 'profile-assets' AND auth.uid()::text = (storage.foldername(name))[1]
);
