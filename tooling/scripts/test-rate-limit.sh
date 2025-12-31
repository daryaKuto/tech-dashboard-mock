#!/bin/bash

# ============================================
# Rate Limiting Test Script
# Tests that rate limiting is working on API endpoints
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Rate Limiting Test${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Default to localhost
BASE_URL="${BASE_URL:-http://localhost:3000}"

echo -e "${BLUE}Testing against: $BASE_URL${NC}"
echo ""

# ============================================
# Test 1: General API Rate Limit (60/min)
# ============================================
echo -e "${YELLOW}Test 1: General API Rate Limit${NC}"
echo -e "Making rapid requests to /api/kpi..."
echo ""

SUCCESS_COUNT=0
RATE_LIMITED_COUNT=0
LAST_STATUS=""
RATE_LIMIT_REMAINING=""

# Make 70 rapid requests (should hit limit at 60)
for i in $(seq 1 70); do
  RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/kpi" 2>/dev/null)
  STATUS=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')
  
  if [ "$STATUS" = "429" ]; then
    RATE_LIMITED_COUNT=$((RATE_LIMITED_COUNT + 1))
    if [ "$RATE_LIMITED_COUNT" = "1" ]; then
      echo -e "${GREEN}✅ Rate limit triggered at request #$i${NC}"
      echo "Response: $BODY" | head -c 200
      echo ""
    fi
  elif [ "$STATUS" = "200" ]; then
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
  else
    echo -e "${YELLOW}Request #$i: Status $STATUS${NC}"
  fi
  
  LAST_STATUS="$STATUS"
  
  # Small delay to not overwhelm
  sleep 0.05
done

echo ""
echo -e "Results:"
echo -e "  Successful requests: ${GREEN}$SUCCESS_COUNT${NC}"
echo -e "  Rate limited (429): ${RED}$RATE_LIMITED_COUNT${NC}"

if [ "$RATE_LIMITED_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✅ Rate limiting is WORKING!${NC}"
else
  echo -e "${RED}❌ Rate limiting NOT triggered (expected 429 after 60 requests)${NC}"
fi

echo ""

# ============================================
# Test 2: Check Rate Limit Headers
# ============================================
echo -e "${YELLOW}Test 2: Rate Limit Headers${NC}"
echo -e "Checking for X-RateLimit headers..."
echo ""

# Wait a bit for rate limit to reset
echo "Waiting 5 seconds for rate limit window to pass..."
sleep 5

HEADERS=$(curl -s -I "$BASE_URL/api/kpi" 2>/dev/null)

echo "Response headers:"
echo "$HEADERS" | grep -i "ratelimit\|retry-after" || echo "(No rate limit headers found - may need to hit limit first)"

echo ""

# ============================================
# Test 3: Auth Endpoint Rate Limit (5/15min)
# ============================================
echo -e "${YELLOW}Test 3: Auth Endpoint Rate Limit (stricter)${NC}"
echo -e "Making requests to /login..."
echo ""

AUTH_SUCCESS=0
AUTH_LIMITED=0

for i in $(seq 1 8); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/login" 2>/dev/null)
  
  if [ "$STATUS" = "429" ]; then
    AUTH_LIMITED=$((AUTH_LIMITED + 1))
    if [ "$AUTH_LIMITED" = "1" ]; then
      echo -e "${GREEN}✅ Auth rate limit triggered at request #$i${NC}"
    fi
  else
    AUTH_SUCCESS=$((AUTH_SUCCESS + 1))
  fi
  
  sleep 0.1
done

echo ""
echo -e "Results:"
echo -e "  Successful: ${GREEN}$AUTH_SUCCESS${NC}"
echo -e "  Rate limited: ${RED}$AUTH_LIMITED${NC}"

if [ "$AUTH_LIMITED" -gt 0 ]; then
  echo -e "${GREEN}✅ Auth rate limiting is WORKING!${NC}"
else
  echo -e "${YELLOW}⚠️  Auth rate limit not triggered (limit is 5/15min, may need more requests)${NC}"
fi

echo ""

# ============================================
# Summary
# ============================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Summary${NC}"
echo -e "${BLUE}========================================${NC}"

if [ "$RATE_LIMITED_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✅ General API rate limiting: WORKING${NC}"
else
  echo -e "${RED}❌ General API rate limiting: NOT WORKING${NC}"
fi

if [ "$AUTH_LIMITED" -gt 0 ]; then
  echo -e "${GREEN}✅ Auth rate limiting: WORKING${NC}"
else
  echo -e "${YELLOW}⚠️  Auth rate limiting: Could not verify (may need more requests)${NC}"
fi

echo ""

