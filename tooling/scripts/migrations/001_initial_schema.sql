-- ============================================
-- Initial database schema for ThatOnePainter dashboard
-- Run this migration in Supabase SQL Editor FIRST
-- Then run 002_mock_data.sql
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES (in correct dependency order)
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  username TEXT,
  organization_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employees table (must be before jobs)
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  is_ai BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'offline', -- 'online', 'away', 'busy', 'offline'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs/Appointments table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  revenue DECIMAL(10, 2),
  cost DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  task_id TEXT NOT NULL,
  employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  progress_current INTEGER DEFAULT 0,
  progress_total INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  from_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  to_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  source TEXT NOT NULL, -- 'Google', 'Facebook', 'Angi Ads', 'Thumbtack', 'Phone Call', etc.
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  converted BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KPI Metrics table (time-series)
CREATE TABLE IF NOT EXISTS public.kpi_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  metric_name TEXT NOT NULL, -- 'drillbit_balance', 'roi', 'revenue', 'costs'
  value DECIMAL(15, 2) NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calls table (for voice integration)
CREATE TABLE IF NOT EXISTS public.calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  duration_minutes INTEGER,
  direction TEXT, -- 'inbound' or 'outbound'
  status TEXT, -- 'completed', 'missed', 'voicemail'
  recording_url TEXT,
  transcript TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue Transactions table
CREATE TABLE IF NOT EXISTS public.revenue_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type TEXT NOT NULL, -- 'revenue', 'cost', 'refund'
  description TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES (for query performance)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_organization ON public.users(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_organization ON public.employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_customers_organization ON public.customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_jobs_organization ON public.jobs(organization_id);
CREATE INDEX IF NOT EXISTS idx_jobs_customer ON public.jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_employee ON public.jobs(employee_id);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_at ON public.jobs(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_tasks_organization ON public.tasks(organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_employee ON public.tasks(employee_id);
CREATE INDEX IF NOT EXISTS idx_messages_organization ON public.messages(organization_id);
CREATE INDEX IF NOT EXISTS idx_leads_organization ON public.leads(organization_id);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
CREATE INDEX IF NOT EXISTS idx_kpi_metrics_organization ON public.kpi_metrics(organization_id);
CREATE INDEX IF NOT EXISTS idx_kpi_metrics_name_recorded ON public.kpi_metrics(metric_name, recorded_at);
CREATE INDEX IF NOT EXISTS idx_calls_organization ON public.calls(organization_id);
CREATE INDEX IF NOT EXISTS idx_calls_employee ON public.calls(employee_id);
CREATE INDEX IF NOT EXISTS idx_revenue_organization ON public.revenue_transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_revenue_recorded_at ON public.revenue_transactions(recorded_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_transactions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTION
-- ============================================
-- Get user's organization_id from the users table
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Users policies
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Employees policies
CREATE POLICY "Users can view employees in their organization"
  ON public.employees FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can manage employees in their organization"
  ON public.employees FOR ALL
  USING (organization_id = public.get_user_organization_id());

-- Customers policies
CREATE POLICY "Users can view customers in their organization"
  ON public.customers FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can manage customers in their organization"
  ON public.customers FOR ALL
  USING (organization_id = public.get_user_organization_id());

-- Jobs policies
CREATE POLICY "Users can view jobs in their organization"
  ON public.jobs FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can manage jobs in their organization"
  ON public.jobs FOR ALL
  USING (organization_id = public.get_user_organization_id());

-- Tasks policies
CREATE POLICY "Users can view tasks in their organization"
  ON public.tasks FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can manage tasks in their organization"
  ON public.tasks FOR ALL
  USING (organization_id = public.get_user_organization_id());

-- Messages policies
CREATE POLICY "Users can view messages in their organization"
  ON public.messages FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can send messages in their organization"
  ON public.messages FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

-- Leads policies
CREATE POLICY "Users can view leads in their organization"
  ON public.leads FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can manage leads in their organization"
  ON public.leads FOR ALL
  USING (organization_id = public.get_user_organization_id());

-- KPI Metrics policies
CREATE POLICY "Users can view KPI metrics in their organization"
  ON public.kpi_metrics FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can insert KPI metrics in their organization"
  ON public.kpi_metrics FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id());

-- Calls policies
CREATE POLICY "Users can view calls in their organization"
  ON public.calls FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can manage calls in their organization"
  ON public.calls FOR ALL
  USING (organization_id = public.get_user_organization_id());

-- Revenue Transactions policies
CREATE POLICY "Users can view revenue transactions in their organization"
  ON public.revenue_transactions FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can manage revenue transactions in their organization"
  ON public.revenue_transactions FOR ALL
  USING (organization_id = public.get_user_organization_id());

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Schema created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  - users';
  RAISE NOTICE '  - employees';
  RAISE NOTICE '  - customers';
  RAISE NOTICE '  - jobs';
  RAISE NOTICE '  - tasks';
  RAISE NOTICE '  - messages';
  RAISE NOTICE '  - leads';
  RAISE NOTICE '  - kpi_metrics';
  RAISE NOTICE '  - calls';
  RAISE NOTICE '  - revenue_transactions';
  RAISE NOTICE '';
  RAISE NOTICE 'Next step: Run 002_mock_data.sql to populate with sample data';
END $$;
