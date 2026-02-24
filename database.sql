-- HelpMeBussiness MVP Database Schema (Updated)
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: leads
-- Stores personal details from Step 1 of the Spark Quiz
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name   TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT NOT NULL
);

-- ============================================================
-- TABLE: orders
-- Stores the service purchase + all intake form responses
-- as both individual columns (for easy filtering) and JSONB
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    lead_id             UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,

    -- Service details
    service_name        TEXT NOT NULL,
    amount              NUMERIC NOT NULL,
    payment_status      TEXT NOT NULL DEFAULT 'pending',

    -- Step 2 Intake Fields (explicit columns for admin filtering)
    capital             TEXT,
    time_commitment     TEXT,
    risk_appetite       TEXT,
    location            TEXT,
    skills              TEXT,

    -- Full intake snapshot as JSON (backup / future-proof)
    intake_responses    JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- ============================================================
-- OPTIONAL: If you already ran the old schema,
-- use these ALTER statements instead of recreating:
-- ============================================================
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS capital TEXT;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS time_commitment TEXT;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS risk_appetite TEXT;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS location TEXT;
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS skills TEXT;
