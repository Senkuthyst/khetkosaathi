-- KHETKOSAATHI: Authentication, Farmer Profile & Multi-Plot Architecture Migration
-- Associates user profiles and farm fields directly with Supabase auth.users
-- Enables strict Row-Level Security (RLS) without permissive bypasses.

-- 1. Table: user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text NOT NULL CHECK (length(full_name) BETWEEN 1 AND 150),
    email text,
    phone_number text CHECK (phone_number IS NULL OR length(phone_number) <= 25),
    profile_photo text,
    country text NOT NULL DEFAULT 'Nepal',
    province text,
    district text,
    municipality text,
    ward_number text,
    current_location_name text,
    current_latitude double precision CHECK (current_latitude IS NULL OR (current_latitude >= -90 AND current_latitude <= 90)),
    current_longitude double precision CHECK (current_longitude IS NULL OR (current_longitude >= -180 AND current_longitude <= 180)),
    preferred_language text NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'ne')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.user_profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Profile RLS Policies: strictly bound to auth.uid()
CREATE POLICY "user_profiles_select_own"
    ON public.user_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "user_profiles_insert_own"
    ON public.user_profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "user_profiles_update_own"
    ON public.user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);


-- 2. Table: farm_fields (Multi-Plot Management)
CREATE TABLE IF NOT EXISTS public.farm_fields (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    field_name text NOT NULL CHECK (length(field_name) BETWEEN 1 AND 100),
    province text,
    district text,
    municipality text,
    ward_number text,
    latitude double precision NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude double precision NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
    boundary jsonb NOT NULL CHECK (
        boundary->>'type' = 'Feature' AND
        boundary->'geometry'->>'type' = 'Polygon'
    ),
    area_m2 double precision NOT NULL CHECK (area_m2 > 0),
    area_unit text NOT NULL DEFAULT 'm2' CHECK (area_unit IN ('m2', 'hectares', 'bigha', 'ropani', 'acres')),
    crop_type text NOT NULL CHECK (length(crop_type) BETWEEN 1 AND 50),
    crop_variety text,
    planting_date date NOT NULL,
    irrigation_type text NOT NULL DEFAULT 'rainfed' CHECK (irrigation_type IN ('rainfed', 'canal', 'borewell', 'drip', 'sprinkler', 'mixed')),
    soil_type text,
    elevation double precision,
    is_primary boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.farm_fields TO service_role;
GRANT ALL ON public.farm_fields TO authenticated;

ALTER TABLE public.farm_fields ENABLE ROW LEVEL SECURITY;

-- Farm Fields RLS Policies: strictly bound to auth.uid()
CREATE POLICY "farm_fields_select_own"
    ON public.farm_fields FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "farm_fields_insert_own"
    ON public.farm_fields FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "farm_fields_update_own"
    ON public.farm_fields FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "farm_fields_delete_own"
    ON public.farm_fields FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_farm_fields_user ON public.farm_fields(user_id, is_primary);

-- 3. Automatic Profile Creation Trigger on Supabase Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name, email, preferred_language)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.email,
        COALESCE(new.raw_user_meta_data->>'preferred_language', 'en')
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email;
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
