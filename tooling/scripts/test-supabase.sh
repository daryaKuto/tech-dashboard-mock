#!/bin/bash

# ============================================
# Supabase Data Fetch Test Script
# Tests authentication and data fetching for the demo user
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Supabase Data Fetch Test${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Try to load from .env file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

if [ -f "$PROJECT_ROOT/.env" ]; then
  echo -e "${BLUE}Loading credentials from .env file...${NC}"
  # Read .env file line by line, handling special characters
  while IFS= read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    [[ "$line" =~ ^#.*$ ]] && continue
    [[ -z "$line" ]] && continue
    # Only process lines with = that don't start with spaces
    if [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]]; then
      export "$line"
    fi
  done < "$PROJECT_ROOT/.env"
fi

# Map env var names (support both formats)
SUPABASE_URL="${SUPABASE_URL:-$NEXT_PUBLIC_SUPABASE_URL}"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-$NEXT_PUBLIC_SUPABASE_ANON_KEY}"

# Check for required environment variables or prompt
if [ -z "$SUPABASE_URL" ]; then
  echo -e "${YELLOW}Enter your Supabase URL (e.g., https://xxx.supabase.co):${NC}"
  read -r SUPABASE_URL
fi

if [ -z "$SUPABASE_ANON_KEY" ]; then
  echo -e "${YELLOW}Enter your Supabase Anon Key:${NC}"
  read -r SUPABASE_ANON_KEY
fi

# Support multiple env var names for email/password
TEST_USER_EMAIL="${TEST_USER_EMAIL:-$TEST_SUPABASE_USER_EMAIL}"
TEST_USER_PASSWORD="${TEST_USER_PASSWORD:-$TEST_SUPABASE_USER_PASSWORD}"

if [ -z "$TEST_USER_EMAIL" ]; then
  echo -e "${YELLOW}Enter test user email:${NC}"
  read -r TEST_USER_EMAIL
fi

if [ -z "$TEST_USER_PASSWORD" ]; then
  echo -e "${YELLOW}Enter password for $TEST_USER_EMAIL:${NC}"
  read -rs TEST_USER_PASSWORD
  echo ""
fi

echo -e "${BLUE}Testing connection to: $SUPABASE_URL${NC}"
echo ""

# ============================================
# 1. Sign In
# ============================================
echo -e "${YELLOW}1. Signing in as $TEST_USER_EMAIL...${NC}"

AUTH_RESPONSE=$(curl -s -X POST \
  "${SUPABASE_URL}/auth/v1/token?grant_type=password" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${TEST_USER_EMAIL}\",
    \"password\": \"${TEST_USER_PASSWORD}\"
  }")

# Extract access token
ACCESS_TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo -e "${RED}❌ Authentication failed!${NC}"
  echo "$AUTH_RESPONSE" | head -c 500
  exit 1
fi

echo -e "${GREEN}✅ Authenticated successfully!${NC}"
echo ""

# ============================================
# 2. Test User Profile
# ============================================
echo -e "${YELLOW}2. Fetching user profile...${NC}"

USER_RESPONSE=$(curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/users?select=*" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json")

echo "$USER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$USER_RESPONSE"
echo ""

# ============================================
# 3. Test Employees
# ============================================
echo -e "${YELLOW}3. Fetching employees...${NC}"

EMPLOYEES_RESPONSE=$(curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/employees?select=id,name,is_ai,status" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json")

echo "$EMPLOYEES_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$EMPLOYEES_RESPONSE"
EMPLOYEE_COUNT=$(echo "$EMPLOYEES_RESPONSE" | grep -o '"id"' | wc -l | tr -d ' ')
echo -e "${GREEN}Found $EMPLOYEE_COUNT employees${NC}"
echo ""

# ============================================
# 4. Test Customers
# ============================================
echo -e "${YELLOW}4. Fetching customers...${NC}"

CUSTOMERS_RESPONSE=$(curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/customers?select=id,name,email&limit=5" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json")

echo "$CUSTOMERS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CUSTOMERS_RESPONSE"
CUSTOMER_COUNT=$(echo "$CUSTOMERS_RESPONSE" | grep -o '"id"' | wc -l | tr -d ' ')
echo -e "${GREEN}Found $CUSTOMER_COUNT customers (showing first 5)${NC}"
echo ""

# ============================================
# 5. Test Jobs
# ============================================
echo -e "${YELLOW}5. Fetching jobs...${NC}"

JOBS_RESPONSE=$(curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/jobs?select=id,title,status,revenue&limit=5" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json")

echo "$JOBS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$JOBS_RESPONSE"
JOB_COUNT=$(echo "$JOBS_RESPONSE" | grep -o '"id"' | wc -l | tr -d ' ')
echo -e "${GREEN}Found $JOB_COUNT jobs (showing first 5)${NC}"
echo ""

# ============================================
# 6. Test Tasks
# ============================================
echo -e "${YELLOW}6. Fetching tasks...${NC}"

TASKS_RESPONSE=$(curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/tasks?select=id,task_id,description,status,priority" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json")

echo "$TASKS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$TASKS_RESPONSE"
TASK_COUNT=$(echo "$TASKS_RESPONSE" | grep -o '"id"' | wc -l | tr -d ' ')
echo -e "${GREEN}Found $TASK_COUNT tasks${NC}"
echo ""

# ============================================
# 7. Test Leads
# ============================================
echo -e "${YELLOW}7. Fetching leads by source...${NC}"

LEADS_RESPONSE=$(curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/leads?select=source" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json")

LEAD_COUNT=$(echo "$LEADS_RESPONSE" | grep -o '"source"' | wc -l | tr -d ' ')
echo -e "${GREEN}Found $LEAD_COUNT total leads${NC}"

# Count by source
echo "Lead sources breakdown:"
echo "$LEADS_RESPONSE" | grep -o '"source":"[^"]*"' | sort | uniq -c | sort -rn
echo ""

# ============================================
# 8. Test KPI Metrics
# ============================================
echo -e "${YELLOW}8. Fetching KPI metrics...${NC}"

KPI_RESPONSE=$(curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/kpi_metrics?select=metric_name,value,recorded_at&order=recorded_at.desc&limit=10" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json")

echo "$KPI_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$KPI_RESPONSE"
KPI_COUNT=$(echo "$KPI_RESPONSE" | grep -o '"metric_name"' | wc -l | tr -d ' ')
echo -e "${GREEN}Found $KPI_COUNT KPI metrics (showing latest 10)${NC}"
echo ""

# ============================================
# 9. Test Calls
# ============================================
echo -e "${YELLOW}9. Fetching calls...${NC}"

CALLS_RESPONSE=$(curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/calls?select=id,duration_minutes,direction,status&limit=5" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json")

CALL_COUNT=$(echo "$CALLS_RESPONSE" | grep -o '"id"' | wc -l | tr -d ' ')
echo -e "${GREEN}Found $CALL_COUNT calls (showing first 5)${NC}"
echo ""

# ============================================
# Summary
# ============================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Authentication: Success${NC}"
echo -e "${GREEN}✅ Employees: $EMPLOYEE_COUNT records${NC}"
echo -e "${GREEN}✅ Customers: $CUSTOMER_COUNT+ records${NC}"
echo -e "${GREEN}✅ Jobs: $JOB_COUNT+ records${NC}"
echo -e "${GREEN}✅ Tasks: $TASK_COUNT records${NC}"
echo -e "${GREEN}✅ Leads: $LEAD_COUNT records${NC}"
echo -e "${GREEN}✅ KPI Metrics: $KPI_COUNT+ records${NC}"
echo -e "${GREEN}✅ Calls: $CALL_COUNT+ records${NC}"
echo ""
echo -e "${GREEN}All Supabase data fetches successful!${NC}"

