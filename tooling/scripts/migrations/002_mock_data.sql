-- Mock data for ThatOnePainter dashboard
-- Run this AFTER 001_initial_schema.sql
-- This creates a demo organization with realistic sample data

-- ============================================
-- IMPORTANT: Replace this UUID with your actual Supabase auth.users ID
-- You can find your user ID in Supabase Dashboard > Authentication > Users
-- ============================================
DO $$
DECLARE
  v_org_id UUID := 'a0000000-0000-0000-0000-000000000001';  -- Demo organization ID
  v_user_id UUID := '97199740-1424-4611-acce-21a8b79e8f79'; -- Your Supabase auth.users ID
  
  -- Employee IDs (using valid hex: 0-9, a-f only)
  v_mason_id UUID := 'ee000000-0000-0000-0000-000000000001';
  v_sarah_id UUID := 'ee000000-0000-0000-0000-000000000002';
  v_mike_id UUID := 'ee000000-0000-0000-0000-000000000003';
  v_alex_id UUID := 'ee000000-0000-0000-0000-000000000004';
  
  -- Customer IDs
  v_customer1_id UUID := 'cc000000-0000-0000-0000-000000000001';
  v_customer2_id UUID := 'cc000000-0000-0000-0000-000000000002';
  v_customer3_id UUID := 'cc000000-0000-0000-0000-000000000003';
  v_customer4_id UUID := 'cc000000-0000-0000-0000-000000000004';
  v_customer5_id UUID := 'cc000000-0000-0000-0000-000000000005';
  v_customer6_id UUID := 'cc000000-0000-0000-0000-000000000006';
  v_customer7_id UUID := 'cc000000-0000-0000-0000-000000000007';
  v_customer8_id UUID := 'cc000000-0000-0000-0000-000000000008';
  
  -- Job IDs
  v_job1_id UUID := 'bb000000-0000-0000-0000-000000000001';
  v_job2_id UUID := 'bb000000-0000-0000-0000-000000000002';
  v_job3_id UUID := 'bb000000-0000-0000-0000-000000000003';
  v_job4_id UUID := 'bb000000-0000-0000-0000-000000000004';
  v_job5_id UUID := 'bb000000-0000-0000-0000-000000000005';
  v_job6_id UUID := 'bb000000-0000-0000-0000-000000000006';

BEGIN

-- ============================================
-- 1. CREATE USER PROFILE (link to your auth.users)
-- ============================================
-- Note: You must have already signed up via Supabase Auth
-- This just creates the profile entry linking to organization

INSERT INTO public.users (id, email, full_name, username, organization_id)
VALUES (v_user_id, 'demo@thatonepainter.com', 'Demo User', 'demo', v_org_id)
ON CONFLICT (id) DO UPDATE SET organization_id = v_org_id;

-- ============================================
-- 2. CREATE EMPLOYEES
-- ============================================
INSERT INTO public.employees (id, organization_id, name, email, avatar_url, is_ai)
VALUES 
  (v_mason_id, v_org_id, 'Mason', 'mason@thatonepainter.ai', NULL, TRUE),
  (v_sarah_id, v_org_id, 'Sarah Johnson', 'sarah@thatonepainter.com', NULL, FALSE),
  (v_mike_id, v_org_id, 'Mike Chen', 'mike@thatonepainter.com', NULL, FALSE),
  (v_alex_id, v_org_id, 'Alex Rivera', 'alex@thatonepainter.com', NULL, FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. CREATE CUSTOMERS
-- ============================================
INSERT INTO public.customers (id, organization_id, name, email, phone, address)
VALUES 
  (v_customer1_id, v_org_id, 'John Smith', 'john.smith@email.com', '555-0101', '123 Main Street, Austin, TX 78701'),
  (v_customer2_id, v_org_id, 'Emily Davis', 'emily.davis@email.com', '555-0102', '456 Oak Avenue, Austin, TX 78702'),
  (v_customer3_id, v_org_id, 'Robert Wilson', 'robert.wilson@email.com', '555-0103', '789 Pine Road, Austin, TX 78703'),
  (v_customer4_id, v_org_id, 'Jennifer Brown', 'jennifer.brown@email.com', '555-0104', '321 Elm Street, Austin, TX 78704'),
  (v_customer5_id, v_org_id, 'Michael Johnson', 'michael.j@email.com', '555-0105', '654 Cedar Lane, Austin, TX 78705'),
  (v_customer6_id, v_org_id, 'Lisa Anderson', 'lisa.anderson@email.com', '555-0106', '987 Maple Drive, Austin, TX 78706'),
  (v_customer7_id, v_org_id, 'David Martinez', 'david.m@email.com', '555-0107', '147 Birch Court, Austin, TX 78707'),
  (v_customer8_id, v_org_id, 'Amanda Taylor', 'amanda.t@email.com', '555-0108', '258 Walnut Way, Austin, TX 78708')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. CREATE JOBS/APPOINTMENTS (last 30 days)
-- ============================================
INSERT INTO public.jobs (id, organization_id, customer_id, employee_id, title, description, status, scheduled_at, completed_at, revenue, cost)
VALUES 
  -- Completed jobs
  (v_job1_id, v_org_id, v_customer1_id, v_sarah_id, 'Interior Painting - Living Room', 'Full interior repaint including ceiling', 'completed', NOW() - INTERVAL '25 days', NOW() - INTERVAL '24 days', 2500.00, 850.00),
  (v_job2_id, v_org_id, v_customer2_id, v_mike_id, 'Exterior Painting - Full House', 'Complete exterior repaint with primer', 'completed', NOW() - INTERVAL '20 days', NOW() - INTERVAL '18 days', 8500.00, 2800.00),
  (v_job3_id, v_org_id, v_customer3_id, v_sarah_id, 'Kitchen Cabinet Refinishing', 'Sand and repaint all kitchen cabinets', 'completed', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days', 3200.00, 950.00),
  (v_job4_id, v_org_id, v_customer4_id, v_alex_id, 'Bedroom Painting - 3 Rooms', 'Paint 3 bedrooms with accent walls', 'completed', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days', 4200.00, 1400.00),
  
  -- In progress jobs
  (v_job5_id, v_org_id, v_customer5_id, v_mike_id, 'Office Building - Floor 2', 'Commercial painting for office space', 'in_progress', NOW() - INTERVAL '5 days', NULL, 12000.00, 4000.00),
  
  -- Upcoming jobs
  (v_job6_id, v_org_id, v_customer6_id, v_sarah_id, 'Bathroom Renovation Paint', 'Moisture-resistant paint for bathroom', 'pending', NOW() + INTERVAL '3 days', NULL, 1800.00, 600.00)
ON CONFLICT (id) DO NOTHING;

-- Generate more jobs for chart data (last 30 days)
INSERT INTO public.jobs (organization_id, customer_id, employee_id, title, status, scheduled_at, completed_at, revenue, cost)
SELECT 
  v_org_id,
  (ARRAY[v_customer1_id, v_customer2_id, v_customer3_id, v_customer4_id, v_customer5_id, v_customer6_id, v_customer7_id, v_customer8_id])[floor(random() * 8 + 1)],
  (ARRAY[v_mason_id, v_sarah_id, v_mike_id, v_alex_id])[floor(random() * 4 + 1)],
  (ARRAY['Interior Paint', 'Exterior Paint', 'Cabinet Refinish', 'Touch-up', 'Commercial Paint', 'Deck Staining'])[floor(random() * 6 + 1)],
  'completed',
  NOW() - (random() * 30 || ' days')::INTERVAL,
  NOW() - (random() * 30 || ' days')::INTERVAL,
  (random() * 5000 + 1000)::DECIMAL(10,2),
  (random() * 1500 + 300)::DECIMAL(10,2)
FROM generate_series(1, 50);

-- ============================================
-- 5. CREATE TASKS
-- ============================================
INSERT INTO public.tasks (organization_id, task_id, employee_id, job_id, description, status, priority, progress_current, progress_total)
VALUES 
  (v_org_id, 'T-001', v_sarah_id, v_job5_id, 'Follow up with customer about paint color selection', 'in_progress', 'medium', 1, 3),
  (v_org_id, 'T-002', v_mike_id, v_job5_id, 'Schedule final walkthrough for Main Street project', 'in_progress', 'high', 6, 8),
  (v_org_id, 'T-003', v_alex_id, v_job4_id, 'Send invoice for completed work', 'pending', 'medium', 0, 1),
  (v_org_id, 'T-004', v_sarah_id, v_job6_id, 'Order materials for upcoming job', 'in_progress', 'medium', 2, 4),
  (v_org_id, 'T-005', v_mason_id, NULL, 'Update customer portal with project photos', 'pending', 'low', 0, 2),
  (v_org_id, 'T-006', v_mike_id, NULL, 'Review and approve supply order', 'completed', 'high', 3, 3),
  (v_org_id, 'T-007', v_mason_id, NULL, 'Process insurance documentation', 'in_progress', 'medium', 4, 6),
  (v_org_id, 'T-008', v_alex_id, NULL, 'Schedule team meeting for next week', 'pending', 'low', 0, 1)
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. CREATE LEADS
-- ============================================
-- Google leads (37.4%)
INSERT INTO public.leads (organization_id, source, customer_id, converted, converted_at, created_at)
SELECT v_org_id, 'Google', 
  CASE WHEN random() > 0.5 THEN v_customer1_id ELSE NULL END,
  random() > 0.3,
  CASE WHEN random() > 0.3 THEN NOW() - (random() * 30 || ' days')::INTERVAL ELSE NULL END,
  NOW() - (random() * 60 || ' days')::INTERVAL
FROM generate_series(1, 37);

-- Facebook leads (21.6%)
INSERT INTO public.leads (organization_id, source, customer_id, converted, converted_at, created_at)
SELECT v_org_id, 'Facebook',
  CASE WHEN random() > 0.6 THEN v_customer2_id ELSE NULL END,
  random() > 0.4,
  CASE WHEN random() > 0.4 THEN NOW() - (random() * 30 || ' days')::INTERVAL ELSE NULL END,
  NOW() - (random() * 60 || ' days')::INTERVAL
FROM generate_series(1, 22);

-- Angi Ads leads (18.9%)
INSERT INTO public.leads (organization_id, source, customer_id, converted, converted_at, created_at)
SELECT v_org_id, 'Angi Ads',
  CASE WHEN random() > 0.5 THEN v_customer3_id ELSE NULL END,
  random() > 0.35,
  CASE WHEN random() > 0.35 THEN NOW() - (random() * 30 || ' days')::INTERVAL ELSE NULL END,
  NOW() - (random() * 60 || ' days')::INTERVAL
FROM generate_series(1, 19);

-- Thumbtack leads (12.7%)
INSERT INTO public.leads (organization_id, source, customer_id, converted, converted_at, created_at)
SELECT v_org_id, 'Thumbtack',
  CASE WHEN random() > 0.5 THEN v_customer4_id ELSE NULL END,
  random() > 0.45,
  CASE WHEN random() > 0.45 THEN NOW() - (random() * 30 || ' days')::INTERVAL ELSE NULL END,
  NOW() - (random() * 60 || ' days')::INTERVAL
FROM generate_series(1, 13);

-- Phone Call leads (9.4%)
INSERT INTO public.leads (organization_id, source, customer_id, converted, converted_at, created_at)
SELECT v_org_id, 'Phone Call',
  CASE WHEN random() > 0.4 THEN v_customer5_id ELSE NULL END,
  random() > 0.25,
  CASE WHEN random() > 0.25 THEN NOW() - (random() * 30 || ' days')::INTERVAL ELSE NULL END,
  NOW() - (random() * 60 || ' days')::INTERVAL
FROM generate_series(1, 9);

-- ============================================
-- 7. CREATE KPI METRICS (time series data)
-- ============================================
-- Current month metrics
INSERT INTO public.kpi_metrics (organization_id, metric_name, value, recorded_at)
VALUES 
  -- DrillBit Balance
  (v_org_id, 'drillbit_balance', 1580000.00, NOW()),
  (v_org_id, 'drillbit_balance', 1550000.00, NOW() - INTERVAL '7 days'),
  (v_org_id, 'drillbit_balance', 1520000.00, NOW() - INTERVAL '14 days'),
  (v_org_id, 'drillbit_balance', 1500000.00, NOW() - INTERVAL '21 days'),
  
  -- Previous month (for delta calculation)
  (v_org_id, 'drillbit_balance', 1500000.00, NOW() - INTERVAL '35 days'),
  (v_org_id, 'drillbit_balance', 1480000.00, NOW() - INTERVAL '42 days'),
  
  -- ROI %
  (v_org_id, 'roi', 328.00, NOW()),
  (v_org_id, 'roi', 322.00, NOW() - INTERVAL '7 days'),
  (v_org_id, 'roi', 318.00, NOW() - INTERVAL '14 days'),
  (v_org_id, 'roi', 316.00, NOW() - INTERVAL '35 days'),
  (v_org_id, 'roi', 310.00, NOW() - INTERVAL '42 days'),
  
  -- Revenue
  (v_org_id, 'revenue', 484489.00, NOW()),
  (v_org_id, 'revenue', 465000.00, NOW() - INTERVAL '7 days'),
  (v_org_id, 'revenue', 450000.00, NOW() - INTERVAL '14 days'),
  (v_org_id, 'revenue', 439489.00, NOW() - INTERVAL '35 days'),
  (v_org_id, 'revenue', 420000.00, NOW() - INTERVAL '42 days'),
  
  -- Costs
  (v_org_id, 'costs', 52862.00, NOW()),
  (v_org_id, 'costs', 54000.00, NOW() - INTERVAL '7 days'),
  (v_org_id, 'costs', 55000.00, NOW() - INTERVAL '14 days'),
  (v_org_id, 'costs', 56062.00, NOW() - INTERVAL '35 days'),
  (v_org_id, 'costs', 57000.00, NOW() - INTERVAL '42 days')
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. CREATE CALLS (for employee performance)
-- ============================================
-- Mason (AI) - high volume
INSERT INTO public.calls (organization_id, employee_id, customer_id, duration_minutes, direction, status, created_at)
SELECT 
  v_org_id,
  v_mason_id,
  (ARRAY[v_customer1_id, v_customer2_id, v_customer3_id, v_customer4_id, v_customer5_id])[floor(random() * 5 + 1)],
  floor(random() * 15 + 2)::INTEGER,
  (ARRAY['inbound', 'outbound'])[floor(random() * 2 + 1)],
  'completed',
  NOW() - (random() * 30 || ' days')::INTERVAL
FROM generate_series(1, 120);

-- Sarah
INSERT INTO public.calls (organization_id, employee_id, customer_id, duration_minutes, direction, status, created_at)
SELECT 
  v_org_id,
  v_sarah_id,
  (ARRAY[v_customer1_id, v_customer2_id, v_customer3_id])[floor(random() * 3 + 1)],
  floor(random() * 20 + 5)::INTEGER,
  (ARRAY['inbound', 'outbound'])[floor(random() * 2 + 1)],
  'completed',
  NOW() - (random() * 30 || ' days')::INTERVAL
FROM generate_series(1, 60);

-- Mike
INSERT INTO public.calls (organization_id, employee_id, customer_id, duration_minutes, direction, status, created_at)
SELECT 
  v_org_id,
  v_mike_id,
  (ARRAY[v_customer4_id, v_customer5_id, v_customer6_id])[floor(random() * 3 + 1)],
  floor(random() * 18 + 3)::INTEGER,
  (ARRAY['inbound', 'outbound'])[floor(random() * 2 + 1)],
  'completed',
  NOW() - (random() * 30 || ' days')::INTERVAL
FROM generate_series(1, 70);

-- Alex
INSERT INTO public.calls (organization_id, employee_id, customer_id, duration_minutes, direction, status, created_at)
SELECT 
  v_org_id,
  v_alex_id,
  (ARRAY[v_customer6_id, v_customer7_id, v_customer8_id])[floor(random() * 3 + 1)],
  floor(random() * 12 + 4)::INTEGER,
  (ARRAY['inbound', 'outbound'])[floor(random() * 2 + 1)],
  'completed',
  NOW() - (random() * 30 || ' days')::INTERVAL
FROM generate_series(1, 45);

-- ============================================
-- 9. CREATE MESSAGES (for employee stats)
-- ============================================
-- Note: Messages link to users, not employees directly
-- In a real system, you'd have employee-user mapping
-- For mock data, we'll skip messages or you can add them if needed

RAISE NOTICE 'Mock data inserted successfully!';
RAISE NOTICE 'Organization ID: %', v_org_id;
RAISE NOTICE '';
RAISE NOTICE 'IMPORTANT: Update v_user_id at the top of this script with your actual Supabase auth.users ID';
RAISE NOTICE 'Find your user ID in Supabase Dashboard > Authentication > Users';

END $$;

-- ============================================
-- VERIFICATION QUERIES (run these to check data)
-- ============================================
-- SELECT COUNT(*) as employees FROM public.employees;
-- SELECT COUNT(*) as customers FROM public.customers;
-- SELECT COUNT(*) as jobs FROM public.jobs;
-- SELECT COUNT(*) as tasks FROM public.tasks;
-- SELECT COUNT(*) as leads FROM public.leads;
-- SELECT COUNT(*) as kpi_metrics FROM public.kpi_metrics;
-- SELECT COUNT(*) as calls FROM public.calls;
-- SELECT source, COUNT(*) FROM public.leads GROUP BY source ORDER BY COUNT(*) DESC;

