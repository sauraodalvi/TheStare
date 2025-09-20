# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**The Stare** is a React-based web application for product management professionals, featuring case studies, resources, and premium subscription services. Built with React, TypeScript, Vite, and Supabase.

## Common Development Commands

### Development Server
```powershell
npm run dev
```
Starts the Vite development server on http://localhost:3000

### Building
```powershell
# Production build
npm run build

# Development build (with source maps)
npm run build:dev
```

### Linting
```powershell
npm run lint
```
Runs ESLint across the codebase

### Preview Production Build
```powershell
npm run preview
```
Serves the production build locally for testing

## Architecture Overview

### Core Technologies
- **Frontend**: React 18 + TypeScript + Vite
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **UI Components**: shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS with custom theme
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Authentication**: Supabase Auth

### Key Application Structure

#### `/src/pages/`
Main route components:
- `Index.tsx` - Homepage
- `CaseStudies.tsx` - Case study browser with filtering/pagination
- `Admin.tsx` - Admin dashboard (requires service_role key)
- Authentication pages (`SignIn.tsx`, `SignUp.tsx`)
- Resource pages (`Resources.tsx`, `Portfolio.tsx`, etc.)

#### `/src/components/`
- **UI Components**: Located in `/src/components/ui/` (shadcn/ui components)
- **Admin Components**: Located in `/src/components/admin/`
  - `UserManagementDashboard.tsx` - Main admin interface
  - `BulkActions.tsx` - Bulk user operations
  - `AnalyticsDashboard.tsx` - User metrics and analytics
- **Core Components**: `Navbar.tsx`, `Footer.tsx`, modal components

#### `/src/hooks/`
- `useAuth.tsx` - Authentication context and state management
- `useCountUp.ts` - Animated counters
- `useServerPagination.ts` - Server-side pagination logic

#### `/src/services/`
- `supabaseService.ts` - Main data fetching service for case studies
- `adminAuthService.ts` - Admin authentication (password-based)
- `adminProfileService.ts` - Admin user management operations

#### `/src/integrations/supabase/`
- `client.ts` - Public Supabase client (anon key)
- `types.ts` - Auto-generated TypeScript types from database schema

### Database Architecture (Supabase)

#### Core Tables:
- **`case_studies`**: Case study content with Google Drive integration
- **`profiles`**: Extended user profiles linked to Supabase auth users
  - Subscription management (free/paid)
  - Profile completion tracking
  - Admin flags (featured, blocked)

#### Key Database Patterns:
- **Row Level Security (RLS)**: Enabled on all tables
- **Google Drive Integration**: PDF and image URLs with conversion utilities
- **Subscription System**: Date-based paid subscriptions
- **Admin Override**: Service role bypasses RLS for admin operations

### Authentication Architecture

#### Public Authentication
- Email/password through Supabase Auth
- JWT tokens stored in localStorage
- Profile creation via database triggers

#### Admin Authentication  
- Separate password-based system (`VITE_ADMIN_PASSWORD`)
- Session-based with 8-hour expiration
- Requires service_role key for database operations

## Environment Configuration

### Required Environment Variables
Create a `.env` file in the project root:

```env
# Public Supabase Configuration (already in client.ts)
VITE_SUPABASE_URL="https://rnpxnaqfoqdivxrlozfr.supabase.co"
VITE_SUPABASE_ANON_KEY="[anon_key_from_supabase_dashboard]"

# Admin Configuration
VITE_ADMIN_PASSWORD="Pass@123"
VITE_SUPABASE_SERVICE_ROLE_KEY="[service_role_key_from_supabase_dashboard]"
```

### Admin Setup
1. **Get Service Role Key**: Navigate to Supabase Dashboard > Settings > API > service_role key
2. **Add to Environment**: Required for admin dashboard functionality
3. **Security Note**: Service role key bypasses RLS - use carefully
4. **Admin Access**: Visit `/admin` and use the configured password

## Development Patterns & Guidelines

### Data Fetching Pattern
- Use React Query for all async operations
- Supabase client for public data access
- Admin client (supabaseAdmin) for administrative operations
- Implement proper loading states and error handling

### Component Architecture
- Functional components with TypeScript
- Custom hooks for business logic
- shadcn/ui for consistent UI components
- Responsive design with Tailwind CSS

### State Management
- React Query for server state
- React Context for authentication
- Local useState for component state
- No global state management library

### File Organization
- Group by feature (admin components together)
- Separate concerns (services, hooks, components)
- Use TypeScript for type safety
- Import aliases (@/ for src/)

### Google Drive Integration
- PDFs: Use `SupabaseService.convertGoogleDrivePdfUrl()` for iframe embedding  
- Images: Use `SupabaseService.convertGoogleDriveImageUrl()` for direct display
- Fallback to Google Docs Viewer for problematic PDFs

### Admin Dashboard Patterns
- Server-side pagination for large datasets
- Bulk operations with confirmation dialogs
- Real-time analytics with auto-refresh
- User management with subscription controls

## Testing & Quality

### Current State
- No test suite currently implemented
- ESLint configured for code quality
- TypeScript for compile-time checking

### Code Quality
- Strict TypeScript configuration
- ESLint rules for React best practices
- Tailwind CSS for consistent styling
- Component prop validation

## Deployment Notes

### Build Process
- Vite handles bundling and optimization
- Environment variables are build-time injected
- Static assets served from `/public`
- Build outputs to `/dist`

### Supabase Configuration
- Database migrations in `/supabase` directory
- RLS policies for data security
- Real-time subscriptions for live updates
- Edge functions for serverless operations

## Key Business Logic

### Subscription System
- Free users: Access to free case studies only
- Paid users: Full access to all published content
- Admin-managed subscription extensions
- Date-based expiration system

### Content Management
- Case studies with publish/unpublish controls
- Google Drive integration for file storage
- SEO optimization fields
- Category and filtering system

### User Management
- Profile completion tracking
- Featured user system
- Blocking/unblocking capabilities
- Bulk administrative operations

## Security Considerations

- RLS policies protect user data
- Admin access requires service_role key
- JWT tokens for user authentication
- Input validation and sanitization
- CORS configuration for API access

---

*This project uses Lovable for rapid development and deployment. Changes can be made via the Lovable interface or traditional development workflow.*