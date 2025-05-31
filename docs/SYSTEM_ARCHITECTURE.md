
# The Eye of Jasper - System Architecture Document

## Table of Contents
1. [System Overview](#system-overview)
2. [Current Architecture](#current-architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication & Authorization](#authentication--authorization)
7. [Frontend Architecture](#frontend-architecture)
8. [Security Model](#security-model)
9. [Performance Considerations](#performance-considerations)
10. [Migration Roadmap](#migration-roadmap)

## System Overview

**Application Name**: The Eye of Jasper  
**Type**: AI-Powered Progress Report Management System  
**Primary Function**: Submit, track, and analyze team progress reports with intelligent oversight and real-time insights  
**Target Users**: Contractors, Project Managers, Administrators  
**Current Environment**: Supabase + React/TypeScript  
**Planned Migration**: MongoDB/Azure + SSO Integration  

### Business Objectives
- Centralized progress report submission and management
- AI-powered analysis and validation of reports
- Real-time insights and analytics for project oversight
- Role-based access control for different user types
- Automated quality scoring and feedback generation

## Current Architecture

### High-Level Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   External      │
│   (React/TS)    │◄──►│   Backend       │◄──►│   APIs          │
│                 │    │                 │    │                 │
│ • Auth Context  │    │ • PostgreSQL    │    │ • Gemini AI     │
│ • Components    │    │ • Edge Functions│    │ • Email         │
│ • Services      │    │ • Auth System   │    │                 │
│ • Hooks         │    │ • RLS Policies  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Current Data Flow
1. **User Authentication**: Supabase Auth with email/password
2. **Report Submission**: Frontend → Supabase API → PostgreSQL
3. **AI Analysis**: Edge Function → Gemini API → Analysis Results
4. **Data Retrieval**: Frontend → Supabase API → PostgreSQL (with RLS)
5. **Real-time Updates**: Supabase Realtime subscriptions

## Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Routing**: React Router DOM 6.26.2
- **Styling**: Tailwind CSS with custom Alberta/Jasper theme
- **UI Components**: shadcn/ui + Radix UI primitives
- **State Management**: React Context + Tanstack Query 5.56.2
- **Icons**: Lucide React 0.462.0
- **Charts**: Recharts 2.12.7
- **Forms**: React Hook Form 7.53.0 + Zod validation

### Backend (Current - Supabase)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **API**: Supabase Auto-generated REST API
- **Authentication**: Supabase Auth
- **Edge Functions**: Deno runtime for serverless functions
- **Real-time**: Supabase Realtime for live updates
- **File Storage**: Supabase Storage (if needed)

### External Integrations
- **AI Analysis**: Google Gemini API for report analysis
- **Email**: Supabase built-in email capabilities
- **Monitoring**: Browser console logs + Supabase dashboard

## Database Schema

### Current PostgreSQL Tables

#### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### user_roles
```sql
CREATE TYPE user_role AS ENUM ('admin', 'contractor');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role user_role NOT NULL DEFAULT 'contractor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### reports
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project TEXT NOT NULL,
  week DATE NOT NULL,
  report TEXT NOT NULL,
  title TEXT,
  description TEXT,
  category TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### analysis_results
```sql
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL,
  score NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  flags INTEGER DEFAULT 0,
  summary TEXT,
  detailed_feedback JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  due_date DATE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### accounts
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  role TEXT DEFAULT 'contractor',
  created_by UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Relationships
- `user_roles.user_id` → `auth.users.id` (implicit)
- `reports.user_id` → `auth.users.id` (implicit)
- `analysis_results.report_id` → `reports.id`
- `notifications.user_id` → `auth.users.id` (implicit)

## API Endpoints

### Current Supabase Auto-generated Endpoints

#### Authentication
- `POST /auth/v1/signup` - User registration
- `POST /auth/v1/token` - User login
- `POST /auth/v1/logout` - User logout
- `GET /auth/v1/user` - Get current user

#### Reports Management
- `GET /rest/v1/reports` - List reports (with RLS filtering)
- `POST /rest/v1/reports` - Create new report
- `PATCH /rest/v1/reports` - Update report
- `DELETE /rest/v1/reports` - Delete report

#### Analysis Results
- `GET /rest/v1/analysis_results` - Get analysis results
- `POST /rest/v1/analysis_results` - Create analysis result
- `PATCH /rest/v1/analysis_results` - Update analysis status

#### User Management
- `GET /rest/v1/profiles` - Get user profiles
- `GET /rest/v1/user_roles` - Get user roles
- `POST /rest/v1/accounts` - Create new account (admin only)

### Edge Functions
- `POST /functions/v1/analyze-report` - Trigger AI analysis
- `POST /functions/v1/create-account` - Create user account

## Authentication & Authorization

### Current Authentication Flow
1. **User Registration**: Email/password via Supabase Auth
2. **Login Process**: Supabase Auth with JWT tokens
3. **Session Management**: Automatic token refresh
4. **Role Assignment**: Default 'contractor' role in user_roles table

### Authorization Model
- **Row Level Security (RLS)**: PostgreSQL policies control data access
- **Role-based Access**: Admin vs Contractor permissions
- **User Isolation**: Users only see their own data (except admins)

### Current RLS Policies
```sql
-- Example: Users can only view their own reports
CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all reports
CREATE POLICY "Admins can view all reports" ON reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

## Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── background/     # Visual effects and particles
│   ├── dashboard/      # Dashboard-specific components
│   ├── eye/           # Eye tracking components
│   ├── layout/        # Layout and navigation
│   ├── navigation/    # Navigation components
│   └── ui/           # Reusable UI components (shadcn)
├── contexts/
│   └── AuthContext.tsx  # Global authentication state
├── hooks/
│   ├── useMouseTracking.ts    # Mouse position tracking
│   ├── useWelcomeScreen.ts   # Welcome screen logic
│   └── useWorkflowAnimation.ts # Animation states
├── pages/
│   ├── Auth.tsx       # Authentication page
│   ├── Dashboard.tsx  # Main dashboard
│   ├── Index.tsx      # Landing page
│   ├── Submit.tsx     # Report submission
│   └── NotFound.tsx   # 404 page
├── services/
│   ├── supabaseService.ts   # Database operations
│   ├── magicLinkService.ts  # Magic link auth
│   └── aiAnalysis.ts        # AI integration
└── utils/
    └── eyeUtils.ts    # Eye animation utilities
```

### Key React Patterns Used
- **Context API**: Global authentication state
- **Custom Hooks**: Reusable stateful logic
- **Component Composition**: Modular, reusable components
- **TypeScript**: Full type safety throughout
- **Error Boundaries**: Graceful error handling

### State Management Strategy
- **Global State**: Authentication context for user data
- **Server State**: Tanstack Query for API data caching
- **Local State**: React useState for component-specific state
- **Form State**: React Hook Form for complex forms

## Security Model

### Current Security Measures
1. **Authentication**: Supabase Auth with secure JWT tokens
2. **Authorization**: Row Level Security policies
3. **Data Validation**: Zod schemas for form validation
4. **API Security**: Supabase handles rate limiting and security headers
5. **Environment Variables**: API keys stored securely in Supabase

### Security Considerations for Migration
- **SSO Integration**: Azure AD B2C for enterprise authentication
- **API Security**: Custom rate limiting and validation
- **Data Encryption**: At-rest and in-transit encryption
- **Audit Logging**: Comprehensive audit trails
- **Network Security**: VNet integration and private endpoints

## Performance Considerations

### Current Performance Optimizations
- **Code Splitting**: React lazy loading for routes
- **Image Optimization**: Optimized assets and lazy loading
- **Caching**: Tanstack Query for API response caching
- **Realtime Updates**: Efficient WebSocket connections
- **Database Indexing**: Supabase automatic indexing

### Performance Metrics
- **Page Load Time**: < 2 seconds initial load
- **API Response Time**: < 500ms for most operations
- **Database Queries**: Optimized with RLS policies
- **Bundle Size**: Minimized through tree shaking

## Migration Roadmap

### Phase 1: Documentation & Planning ✅ (Current)
- System architecture documentation
- Database schema mapping
- API endpoint documentation
- Security assessment

### Phase 2: Azure Infrastructure Setup
- Azure Cosmos DB (MongoDB API) provisioning
- Azure App Service configuration
- Azure Functions setup
- Azure AD B2C tenant configuration

### Phase 3: Database Migration
- MongoDB schema design
- Data migration scripts
- Index optimization
- Data validation procedures

### Phase 4: Backend Services Migration
- API layer development (Express.js)
- Azure Functions implementation
- Authentication middleware
- AI integration updates

### Phase 5: SSO Implementation
- Azure AD B2C integration
- Frontend authentication updates
- Role mapping and authorization
- User migration procedures

### Phase 6: Testing & Deployment
- Comprehensive testing suite
- Performance benchmarking
- Security testing
- Production deployment

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: Phase 2 Completion  
**Stakeholders**: Development Team, Project Management, Security Team
