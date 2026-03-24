-- ============================================================
-- MIGRATION: Add email automation support to consultations
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Enable pg_net extension (needed for HTTP calls from triggers)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 2. Add email tracking columns to consultations
ALTER TABLE public.consultations
ADD COLUMN IF NOT EXISTS email_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (email_status IN ('pending', 'processing', 'sent', 'failed')),
ADD COLUMN IF NOT EXISTS email_error TEXT,
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS ai_analysis TEXT,
ADD COLUMN IF NOT EXISTS ai_raw_response JSONB;

-- 3. Index for monitoring email status
CREATE INDEX IF NOT EXISTS idx_consultations_email_status
ON public.consultations (email_status);

-- 4. Trigger function: calls the Edge Function via pg_net
CREATE OR REPLACE FUNCTION handle_new_consultation()
RETURNS TRIGGER AS $$
DECLARE
    edge_function_url TEXT;
    service_role_key TEXT;
BEGIN
    edge_function_url := (
        SELECT decrypted_secret
        FROM vault.decrypted_secrets
        WHERE name = 'edge_function_base_url'
        LIMIT 1
    );

    service_role_key := (
        SELECT decrypted_secret
        FROM vault.decrypted_secrets
        WHERE name = 'supabase_service_role_key'
        LIMIT 1
    );

    IF edge_function_url IS NULL OR service_role_key IS NULL THEN
        RAISE WARNING '[HMB] Missing vault secrets for email automation';
        RETURN NEW;
    END IF;

    PERFORM net.http_post(
        url := edge_function_url || '/send-consultation-email',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || service_role_key
        ),
        body := jsonb_build_object(
            'consultation_id', NEW.id,
            'lead_id', NEW.lead_id
        )
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create the trigger
DROP TRIGGER IF EXISTS on_consultation_created ON public.consultations;
CREATE TRIGGER on_consultation_created
    AFTER INSERT ON public.consultations
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_consultation();

-- 6. Store secrets in the Supabase Vault
-- Replace the placeholder values with your actual keys before running.
-- Edge function base URL (no trailing slash):
-- SELECT vault.create_secret('https://bctvzcjihsqcxbouumsf.supabase.co/functions/v1', 'edge_function_base_url');
-- Service role key:
-- SELECT vault.create_secret('YOUR_SERVICE_ROLE_KEY_HERE', 'supabase_service_role_key');
