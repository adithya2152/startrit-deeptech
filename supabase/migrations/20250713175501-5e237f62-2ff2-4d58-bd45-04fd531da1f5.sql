-- Add public_user_id column to profiles table for Gmail prefix-based IDs
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS public_user_id TEXT UNIQUE;

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_profiles_public_user_id ON public.profiles(public_user_id);

-- Update RLS policies to include public_user_id searches
DROP POLICY IF EXISTS "Anyone can view basic profile info" ON public.profiles;
CREATE POLICY "Anyone can view basic profile info" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

-- Function to extract Gmail prefix from email
CREATE OR REPLACE FUNCTION extract_gmail_prefix(email_address TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Check if email ends with @gmail.com
  IF email_address ILIKE '%@gmail.com' THEN
    -- Extract the part before @gmail.com
    RETURN LOWER(SPLIT_PART(email_address, '@', 1));
  ELSE
    -- For non-Gmail addresses, return null to prevent duplicates
    RETURN NULL;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Update the handle_new_user function to set public_user_id as Gmail prefix
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  gmail_prefix TEXT;
BEGIN
  -- Extract Gmail prefix
  gmail_prefix := extract_gmail_prefix(NEW.email);
  
  -- Check for existing public_user_id if it's a Gmail address
  IF gmail_prefix IS NOT NULL THEN
    -- Check if this prefix already exists
    IF EXISTS (SELECT 1 FROM public.profiles WHERE public_user_id = gmail_prefix) THEN
      RAISE EXCEPTION 'A user with this Gmail prefix already exists. Please use a different email address.';
    END IF;
  END IF;
  
  INSERT INTO public.profiles (user_id, first_name, last_name, public_user_id)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'first_name', 
    NEW.raw_user_meta_data->>'last_name',
    gmail_prefix
  );
  
  RETURN NEW;
END;
$$;

-- Update existing profiles without public_user_id (for existing users)
UPDATE public.profiles 
SET public_user_id = extract_gmail_prefix((
  SELECT email FROM auth.users WHERE id = profiles.user_id
))
WHERE public_user_id IS NULL;