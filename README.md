# ThatOnePainter Dashboard

A production-ready Next.js dashboard application built with TypeScript, Supabase, and OpenAI integration.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL with RLS)
- **AI**: OpenAI API
- **Charts**: Recharts
- **Architecture**: Monorepo structure with layered architecture

## Project Structure

```
apps/
  web/                    # Next.js application
    app/
      (dashboard)/        # Dashboard routes
        layout.tsx        # Dashboard layout with sidebar
        page.tsx          # Main dashboard page
    components/
      dashboard/          # Dashboard-specific components
      ui/                 # shadcn/ui components
    lib/
      supabase/           # Supabase clients (browser, server, service)
      openai/             # OpenAI client wrapper
      env.ts              # Environment variable validation

packages/
  api/                    # Shared API contracts and Zod schemas
    schemas/              # Data validation schemas
    types.ts              # API response types

tooling/
  scripts/
    migrations/           # Database migration files
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd apps/web
npm install
```

### 2. Environment Variables

Create a `.env.local` file in `apps/web/`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Node Environment
NODE_ENV=development
```

### 3. Database Setup

1. Create a new Supabase project at https://supabase.com
2. Run the migration file in the Supabase SQL Editor:
   - File: `tooling/scripts/migrations/001_initial_schema.sql`
   - This creates all tables, indexes, and RLS policies

### 4. Run Development Server

```bash
cd apps/web
npm run dev
```

Visit http://localhost:3000 to see the dashboard.

## Architecture

The application follows a layered architecture:

1. **UI Layer** (`components/`, `app/`)
   - React components and pages
   - No direct database queries
   - Minimal side effects

2. **Feature Layer** (`packages/core/`)
   - Business logic and orchestration
   - Permission checks
   - Domain models

3. **Data Layer** (`packages/data/`, `lib/supabase/`)
   - Supabase queries
   - External API calls (OpenAI)
   - Data access patterns

4. **Transport Layer** (`app/api/`)
   - Next.js route handlers
   - Server actions
   - API endpoints

## Features

- ✅ Dashboard layout with sidebar navigation
- ✅ KPI summary cards (Drillbit Balance, ROI, Revenue, Costs)
- ✅ Appointments chart (bar + line combo)
- ✅ Leads by source visualization
- ✅ Action needed task list
- ✅ Employees performance table
- ✅ Insight column with business metrics
- ✅ Responsive design matching design spec
- ✅ Type-safe with TypeScript and Zod validation
- ✅ RLS policies for data security

## Design Specifications

- **Colors**: Exact color palette from design spec
  - Background: `#FAFAF9`
  - Cards: `#FFFFFF`
  - Primary text: `#111827`
  - Secondary text: `#6B7280`
  - Green positive: `#16A34A`
  - Orange accent: `#FB923C`

- **Typography**: Inter font family
- **Layout**: Fixed width ~1440px, sidebar ~240px

## Next Steps

1. **Connect to Real Data**: Update components to fetch from API routes
2. **Implement API Routes**: Create route handlers in `app/api/`
3. **Add Data Layer**: Implement repositories and services
4. **Authentication**: Add Supabase Auth integration
5. **Real-time Updates**: Add Supabase Realtime subscriptions
6. **Voice Integration**: Integrate VAPI, Eleven Labs, Twilio
7. **Backend Integration**: Connect Porter and Temporal

## Development

### Code Style

- TypeScript strict mode enabled
- ESLint configured
- Prettier formatting

### Testing

```bash
npm run test
```

### Build

```bash
npm run build
```

## Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Environment variables validated with Zod
- ✅ Server-side authentication checks
- ✅ No service role keys in client bundles
- ✅ Input validation on all API routes

## License

MIT

