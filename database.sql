-- HelpMeBussiness MVP Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: leads
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL
);

-- Policy (optional - enable RLS if needed, these examples keep it public for inserts)
-- ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public insert to leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Table: orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    intake_responses JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Policy (optional)
-- ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public insert to orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Note: Admin Notification can be handled by just querying `orders` where payment_status = 'success'. 
-- Alternatively, you can use Supabase Webhooks or Database Triggers to send an email on insert to `orders`.
