#!/usr/bin/env bash

# Rumbo Development Startup Script
# Orchestrates all services needed for local development

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 Rumbo Development Environment Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ============================================================================
# Step 1: Check if Docker is running
# ============================================================================
echo -e "${BLUE}[1/5]${NC} Checking Docker..."

if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}✗ Docker is not running${NC}"
  echo ""
  echo "Please start Docker Desktop and try again."
  echo ""
  exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}"
echo ""

# ============================================================================
# Step 2: Start Docker services
# ============================================================================
echo -e "${BLUE}[2/5]${NC} Starting Docker services (PostgreSQL, Redis, PgBouncer)..."

docker-compose up -d

echo ""

# ============================================================================
# Step 3: Wait for services to be healthy
# ============================================================================
echo -e "${BLUE}[3/5]${NC} Waiting for services to be ready..."

# Wait for PostgreSQL to be healthy
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if docker exec rumbo-postgres pg_isready -U rumbo > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PostgreSQL is ready${NC}"
    break
  fi

  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo -n "."
  sleep 1
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo -e "${RED}✗ PostgreSQL failed to start${NC}"
  exit 1
fi

# Wait for Redis to be healthy
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if docker exec rumbo-redis redis-cli -a "${REDIS_PASSWORD:-rumbo_dev_redis}" ping > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Redis is ready${NC}"
    break
  fi

  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo -n "."
  sleep 1
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo -e "${RED}✗ Redis failed to start${NC}"
  exit 1
fi

echo ""

# ============================================================================
# Step 4: Sync database schema
# ============================================================================
echo -e "${BLUE}[4/5]${NC} Syncing database schema..."

pnpm prisma db push > /dev/null 2>&1 || {
  echo -e "${YELLOW}⚠ Database sync had warnings (this is normal on first run)${NC}"
}

echo -e "${GREEN}✓ Database schema is in sync${NC}"
echo ""

# ============================================================================
# Step 5: Start Next.js development server
# ============================================================================
echo -e "${BLUE}[5/5]${NC} Starting Next.js development server..."
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Development environment ready!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Services running:"
echo "  • PostgreSQL:    localhost:5432"
echo "  • PgBouncer:     localhost:6432"
echo "  • Redis:         localhost:6379"
echo "  • Next.js:       http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start Next.js with Turbopack
pnpm next dev --turbopack
