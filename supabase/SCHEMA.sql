-- ============================================================================
-- NER-SafeSlope
-- Complete Supabase / PostgreSQL MVP Migration
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. ENUMS
-- ============================================================================

CREATE TYPE public.user_role AS ENUM (
    'AUTHORITY',
    'FIELD_OFFICER',
    'CITIZEN'
);

CREATE TYPE public.risk_level AS ENUM (
    'LOW',
    'MODERATE',
    'HIGH',
    'CRITICAL'
);

CREATE TYPE public.road_status AS ENUM (
    'OPEN',
    'RESTRICTED',
    'BLOCKED',
    'UNKNOWN'
);

CREATE TYPE public.report_type AS ENUM (
    'CRACK',
    'SLOPE_MOVEMENT',
    'ROAD_BLOCKAGE',
    'LANDSLIDE',
    'INFRASTRUCTURE_DAMAGE',
    'OTHER'
);

CREATE TYPE public.alert_status AS ENUM (
    'ACTIVE',
    'ACKNOWLEDGED',
    'RESOLVED'
);

CREATE TYPE public.verification_status AS ENUM (
    'PENDING',
    'VERIFIED',
    'REJECTED'
);

-- ============================================================================
-- 2. TABLES
-- ============================================================================

CREATE TABLE public.users (
    id UUID PRIMARY KEY
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    role public.user_role NOT NULL DEFAULT 'CITIZEN',

    full_name TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.risk_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    latitude DOUBLE PRECISION NOT NULL,

    longitude DOUBLE PRECISION NOT NULL,

    slope_angle DOUBLE PRECISION NOT NULL,

    soil_moisture DOUBLE PRECISION,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    risk_zone_id UUID NOT NULL
        REFERENCES public.risk_zones(id)
        ON DELETE CASCADE,

    risk_score INTEGER NOT NULL
        CHECK (risk_score >= 0 AND risk_score <= 100),

    risk_level public.risk_level NOT NULL,

    contributing_factors JSONB NOT NULL,

    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.weather_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    risk_zone_id UUID NOT NULL
        REFERENCES public.risk_zones(id)
        ON DELETE CASCADE,

    rainfall DOUBLE PRECISION NOT NULL,

    rainfall_accumulation DOUBLE PRECISION NOT NULL,

    temperature DOUBLE PRECISION,

    humidity DOUBLE PRECISION,

    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.roads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    risk_zone_id UUID
        REFERENCES public.risk_zones(id)
        ON DELETE SET NULL,

    name TEXT NOT NULL,

    status public.road_status NOT NULL DEFAULT 'UNKNOWN',

    importance_score INTEGER NOT NULL DEFAULT 0
        CHECK (importance_score >= 0),

    latitude DOUBLE PRECISION NOT NULL,

    longitude DOUBLE PRECISION NOT NULL
);

CREATE TABLE public.villages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    risk_zone_id UUID
        REFERENCES public.risk_zones(id)
        ON DELETE SET NULL,

    name TEXT NOT NULL,

    population_exposure INTEGER NOT NULL DEFAULT 0
        CHECK (population_exposure >= 0),

    latitude DOUBLE PRECISION NOT NULL,

    longitude DOUBLE PRECISION NOT NULL
);

CREATE TABLE public.infrastructure (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    risk_zone_id UUID
        REFERENCES public.risk_zones(id)
        ON DELETE SET NULL,

    name TEXT NOT NULL,

    type TEXT NOT NULL,

    importance_score INTEGER NOT NULL DEFAULT 0
        CHECK (importance_score >= 0),

    latitude DOUBLE PRECISION NOT NULL,

    longitude DOUBLE PRECISION NOT NULL
);

CREATE TABLE public.citizen_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    reporter_id UUID NOT NULL
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    report_type public.report_type NOT NULL,

    latitude DOUBLE PRECISION NOT NULL,

    longitude DOUBLE PRECISION NOT NULL,

    photo_url TEXT,

    video_url TEXT,

    description TEXT NOT NULL,

    verification_status public.verification_status NOT NULL DEFAULT 'PENDING',

    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    risk_zone_id UUID NOT NULL
        REFERENCES public.risk_zones(id)
        ON DELETE CASCADE,

    severity public.risk_level NOT NULL,

    status public.alert_status NOT NULL DEFAULT 'ACTIVE',

    reason TEXT NOT NULL,

    affected_road_id UUID
        REFERENCES public.roads(id)
        ON DELETE SET NULL,

    affected_village_id UUID
        REFERENCES public.villages(id)
        ON DELETE SET NULL,

    recommended_response TEXT NOT NULL,

    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.landslide_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    risk_zone_id UUID NOT NULL
        REFERENCES public.risk_zones(id)
        ON DELETE CASCADE,

    latitude DOUBLE PRECISION NOT NULL,

    longitude DOUBLE PRECISION NOT NULL,

    date TIMESTAMPTZ NOT NULL,

    description TEXT NOT NULL
);

-- ============================================================================
-- 3. HELPER FUNCTION FOR ROLE CHECKING
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS public.user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT role
    FROM public.users
    WHERE id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.get_auth_user_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_auth_user_role() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_auth_user_role() TO authenticated;

-- ============================================================================
-- 4. INDEXES
-- ============================================================================

CREATE INDEX idx_risk_assessments_risk_zone_id
    ON public.risk_assessments(risk_zone_id);

CREATE INDEX idx_weather_data_risk_zone_id
    ON public.weather_data(risk_zone_id);

CREATE INDEX idx_roads_risk_zone_id
    ON public.roads(risk_zone_id);

CREATE INDEX idx_villages_risk_zone_id
    ON public.villages(risk_zone_id);

CREATE INDEX idx_infrastructure_risk_zone_id
    ON public.infrastructure(risk_zone_id);

CREATE INDEX idx_citizen_reports_reporter_id
    ON public.citizen_reports(reporter_id);

CREATE INDEX idx_alerts_risk_zone_id
    ON public.alerts(risk_zone_id);

CREATE INDEX idx_alerts_affected_road_id
    ON public.alerts(affected_road_id);

CREATE INDEX idx_alerts_affected_village_id
    ON public.alerts(affected_village_id);

CREATE INDEX idx_landslide_events_risk_zone_id
    ON public.landslide_events(risk_zone_id);

CREATE INDEX idx_risk_assessments_timestamp
    ON public.risk_assessments(timestamp DESC);

CREATE INDEX idx_weather_data_timestamp
    ON public.weather_data(timestamp DESC);

CREATE INDEX idx_citizen_reports_timestamp
    ON public.citizen_reports(timestamp DESC);

CREATE INDEX idx_alerts_timestamp
    ON public.alerts(timestamp DESC);

CREATE INDEX idx_landslide_events_date
    ON public.landslide_events(date DESC);

CREATE INDEX idx_risk_zones_lat_lon
    ON public.risk_zones(latitude, longitude);

CREATE INDEX idx_roads_lat_lon
    ON public.roads(latitude, longitude);

CREATE INDEX idx_villages_lat_lon
    ON public.villages(latitude, longitude);

CREATE INDEX idx_infrastructure_lat_lon
    ON public.infrastructure(latitude, longitude);

CREATE INDEX idx_citizen_reports_lat_lon
    ON public.citizen_reports(latitude, longitude);

CREATE INDEX idx_landslide_events_lat_lon
    ON public.landslide_events(latitude, longitude);

-- ============================================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infrastructure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landslide_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. USERS POLICIES
-- ============================================================================

CREATE POLICY "Users can read own profile or authorities read all"
ON public.users
FOR SELECT
TO authenticated
USING (
    id = auth.uid()
    OR public.get_auth_user_role() = 'AUTHORITY'
);

CREATE POLICY "Users can insert their own profile"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = id
);

CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (
    auth.uid() = id
)
WITH CHECK (
    auth.uid() = id
);

-- ============================================================================
-- 7. SITUATIONAL AWARENESS READ POLICIES
-- ============================================================================

CREATE POLICY "Authenticated users can read risk zones"
ON public.risk_zones
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can read risk assessments"
ON public.risk_assessments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can read weather data"
ON public.weather_data
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can read roads"
ON public.roads
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can read villages"
ON public.villages
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can read infrastructure"
ON public.infrastructure
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can read landslide events"
ON public.landslide_events
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can read alerts"
ON public.alerts
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- 8. CITIZEN / FIELD REPORT POLICIES
-- ============================================================================

CREATE POLICY "Users read own reports or authorities read all"
ON public.citizen_reports
FOR SELECT
TO authenticated
USING (
    reporter_id = auth.uid()
    OR public.get_auth_user_role() = 'AUTHORITY'
);

CREATE POLICY "Users can insert their own field reports"
ON public.citizen_reports
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = reporter_id
);

CREATE POLICY "Users can update own reports or authorities can verify"
ON public.citizen_reports
FOR UPDATE
TO authenticated
USING (
    auth.uid() = reporter_id
    OR public.get_auth_user_role() = 'AUTHORITY'
)
WITH CHECK (
    auth.uid() = reporter_id
    OR public.get_auth_user_role() = 'AUTHORITY'
);

-- ============================================================================
-- 9. AUTHORITY POLICIES
-- ============================================================================

CREATE POLICY "Authorities can update alert statuses"
ON public.alerts
FOR UPDATE
TO authenticated
USING (
    public.get_auth_user_role() = 'AUTHORITY'
)
WITH CHECK (
    public.get_auth_user_role() = 'AUTHORITY'
);

CREATE POLICY "Authorities can update road statuses"
ON public.roads
FOR UPDATE
TO authenticated
USING (
    public.get_auth_user_role() = 'AUTHORITY'
)
WITH CHECK (
    public.get_auth_user_role() = 'AUTHORITY'
);

-- ============================================================================
-- 10. SUPABASE STORAGE
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES (
    'field_reports',
    'field_reports',
    false
)
ON CONFLICT (id)
DO UPDATE SET public = false;

CREATE POLICY "Users can upload field evidence to own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'field_reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Authenticated users can read field evidence"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'field_reports'
);

CREATE POLICY "Users can update own field evidence"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'field_reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'field_reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own field evidence"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'field_reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

COMMIT;

-- ============================================================================
-- END OF NER-SafeSlope MVP MIGRATION
-- ============================================================================