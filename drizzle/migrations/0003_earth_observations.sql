-- KHETKOSAATHI: Earth Intelligence Foundation Migration
-- Additive tables for Earth Observations, Ingestion Runs, and Earth Analysis Results
-- Preserves all existing tables, RLS policies, and relationships.
-- Follows the device_hash capability RPC authorization model established in 0000 & 0002.

-- 1. Table: earth_ingestion_runs
CREATE TABLE IF NOT EXISTS public.earth_ingestion_runs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    device_hash text NOT NULL,
    field_id text NOT NULL CHECK (length(field_id) BETWEEN 1 AND 100),
    source_name text NOT NULL CHECK (source_name IN ('nasa_power', 'nasa_smap', 'nasa_gpm', 'nasa_modis', 'station_in_situ')),
    status text NOT NULL CHECK (status IN ('success', 'partial', 'failed')),
    records_ingested integer NOT NULL DEFAULT 0 CHECK (records_ingested >= 0),
    parameters text[] NOT NULL DEFAULT '{}',
    date_start date,
    date_end date,
    error_message text CHECK (error_message IS NULL OR length(error_message) <= 1000),
    retrieved_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.earth_ingestion_runs TO service_role;
ALTER TABLE public.earth_ingestion_runs ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_ingestion_device_field ON public.earth_ingestion_runs(device_hash, field_id);

-- 2. Table: earth_observations
-- Primary storage for granular Earth observation variables
CREATE TABLE IF NOT EXISTS public.earth_observations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    device_hash text NOT NULL,
    field_id text NOT NULL CHECK (length(field_id) BETWEEN 1 AND 100),
    source_name text NOT NULL CHECK (source_name IN ('nasa_power', 'nasa_smap', 'nasa_gpm', 'nasa_modis', 'station_in_situ')),
    product_id text NOT NULL CHECK (length(product_id) <= 100),
    product_version text NOT NULL DEFAULT 'v1' CHECK (length(product_version) <= 50),
    variable_name text NOT NULL CHECK (length(variable_name) BETWEEN 1 AND 60),
    value double precision,
    unit text NOT NULL CHECK (length(unit) <= 30),
    observation_start timestamptz NOT NULL,
    observation_end timestamptz NOT NULL,
    retrieval_timestamp timestamptz NOT NULL DEFAULT now(),
    spatial_resolution text NOT NULL CHECK (length(spatial_resolution) <= 60),
    temporal_resolution text NOT NULL DEFAULT 'daily' CHECK (temporal_resolution IN ('hourly', 'daily', 'pentad', '8-day', '16-day', 'monthly')),
    spatial_extraction_method text NOT NULL DEFAULT 'point_nearest_grid' CHECK (spatial_extraction_method IN ('point_nearest_grid', 'polygon_centroid', 'polygon_areal_mean', 'in_situ_station')),
    quality_status text NOT NULL CHECK (quality_status IN ('good', 'marginal', 'missing', 'pilotQuality')),
    quality_flags text[] NOT NULL DEFAULT '{}',
    valid_spatial_coverage text,
    processing_version text NOT NULL DEFAULT 'v1',
    provenance_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_earth_obs_entry UNIQUE (device_hash, field_id, source_name, variable_name, observation_start)
);

GRANT ALL ON public.earth_observations TO service_role;
ALTER TABLE public.earth_observations ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_earth_obs_field_date ON public.earth_observations(device_hash, field_id, variable_name, observation_start DESC);

-- 3. Table: earth_analysis_results
CREATE TABLE IF NOT EXISTS public.earth_analysis_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    device_hash text NOT NULL,
    field_id text NOT NULL CHECK (length(field_id) BETWEEN 1 AND 100),
    analysis_type text NOT NULL CHECK (analysis_type IN ('drought_anomaly', 'heat_stress', 'soil_water_depletion', 'vegetation_trend')),
    risk_level text NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high', 'critical', 'missing')),
    metric_values jsonb NOT NULL DEFAULT '{}'::jsonb,
    baseline_values jsonb NOT NULL DEFAULT '{}'::jsonb,
    period_start date NOT NULL,
    period_end date NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.earth_analysis_results TO service_role;
ALTER TABLE public.earth_analysis_results ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_earth_analysis_field ON public.earth_analysis_results(device_hash, field_id, created_at DESC);

-- 4. Secure Capability RPC Functions
-- Function to retrieve observations for a validated field and device
CREATE OR REPLACE FUNCTION public.get_earth_observations(
    device_token uuid,
    target_field text,
    target_source text DEFAULT NULL,
    start_date timestamptz DEFAULT NULL,
    end_date timestamptz DEFAULT NULL
)
RETURNS TABLE (
    id uuid,
    field_id text,
    source_name text,
    product_id text,
    variable_name text,
    value double precision,
    unit text,
    observation_start timestamptz,
    observation_end timestamptz,
    quality_status text,
    spatial_resolution text,
    provenance_metadata jsonb
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
    SELECT
        o.id,
        o.field_id,
        o.source_name,
        o.product_id,
        o.variable_name,
        o.value,
        o.unit,
        o.observation_start,
        o.observation_end,
        o.quality_status,
        o.spatial_resolution,
        o.provenance_metadata
    FROM public.earth_observations o
    WHERE o.device_hash = encode(sha256(device_token::text::bytea), 'hex')
      AND o.field_id = target_field
      AND (target_source IS NULL OR o.source_name = target_source)
      AND (start_date IS NULL OR o.observation_start >= start_date)
      AND (end_date IS NULL OR o.observation_start <= end_date)
    ORDER BY o.observation_start DESC
    LIMIT 500;
$$;

-- Function to save a batch of observations (idempotent ON CONFLICT UPDATE)
CREATE OR REPLACE FUNCTION public.save_earth_observations(
    device_token uuid,
    target_field text,
    obs_records jsonb
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    inserted_count integer := 0;
    computed_hash text;
    rec jsonb;
BEGIN
    IF device_token IS NULL THEN
        RAISE EXCEPTION 'Device token required';
    END IF;
    IF target_field IS NULL OR length(target_field) < 1 THEN
        RAISE EXCEPTION 'Field ID required';
    END IF;

    computed_hash := encode(sha256(device_token::text::bytea), 'hex');

    FOR rec IN SELECT * FROM jsonb_array_elements(obs_records)
    LOOP
        INSERT INTO public.earth_observations (
            device_hash,
            field_id,
            source_name,
            product_id,
            product_version,
            variable_name,
            value,
            unit,
            observation_start,
            observation_end,
            retrieval_timestamp,
            spatial_resolution,
            temporal_resolution,
            spatial_extraction_method,
            quality_status,
            quality_flags,
            valid_spatial_coverage,
            processing_version,
            provenance_metadata
        ) VALUES (
            computed_hash,
            target_field,
            rec->>'sourceName',
            COALESCE(rec->>'productId', 'POWER_DAILY_AG'),
            COALESCE(rec->>'productVersion', 'v1'),
            rec->>'variableName',
            (rec->>'value')::double precision,
            rec->>'unit',
            (rec->>'observationStart')::timestamptz,
            (rec->>'observationEnd')::timestamptz,
            COALESCE((rec->>'retrievalTimestamp')::timestamptz, now()),
            COALESCE(rec->>'spatialResolution', '0.5° × 0.625°'),
            COALESCE(rec->>'temporalResolution', 'daily'),
            COALESCE(rec->>'spatialExtractionMethod', 'point_nearest_grid'),
            COALESCE(rec->>'qualityStatus', 'good'),
            ARRAY(SELECT jsonb_array_elements_text(COALESCE(rec->'qualityFlags', '[]'::jsonb))),
            rec->>'validSpatialCoverage',
            COALESCE(rec->>'processingVersion', 'v1'),
            COALESCE(rec->'provenanceMetadata', '{}'::jsonb)
        )
        ON CONFLICT (device_hash, field_id, source_name, variable_name, observation_start)
        DO UPDATE SET
            value = EXCLUDED.value,
            unit = EXCLUDED.unit,
            retrieval_timestamp = EXCLUDED.retrieval_timestamp,
            quality_status = EXCLUDED.quality_status,
            quality_flags = EXCLUDED.quality_flags,
            provenance_metadata = EXCLUDED.provenance_metadata;

        inserted_count := inserted_count + 1;
    END LOOP;

    RETURN inserted_count;
END;
$$;

-- Revoke and Grant explicitly
REVOKE ALL ON FUNCTION public.get_earth_observations(uuid, text, text, timestamptz, timestamptz) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.save_earth_observations(uuid, text, jsonb) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_earth_observations(uuid, text, text, timestamptz, timestamptz) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_earth_observations(uuid, text, jsonb) TO anon, authenticated;
