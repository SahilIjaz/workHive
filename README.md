# FlowSpace - Multi-Tenant SaaS Task Management

A cloud-based SaaS application for managing projects and tasks across multiple organizations with complete data isolation.

## Tech Stack

- **Backend**: Node.js + Express.js + Prisma + PostgreSQL
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Auth**: JWT with role-based access control (Admin, Member)
- **Multi-tenancy**: Shared database, shared schema with tenantId isolation

## Project Structure

```
Multi_Tenant/
├── backend/              # Express API server
│   ├── src/
│   │   ├── app.js       # Express entry point
│   │   ├── config/      # Database & environment config
│   │   ├── middlewares/ # Auth, tenant, role, error handlers
│   │   ├── modules/     # Feature modules (auth, users, projects, tasks, tenants)
│   │   └── routes/      # API route definitions
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   ├── .env             # Environment variables
│   └── package.json
│
└── frontend/            # Next.js web application
    ├── app/            # App Router pages
    ├── components/     # React components
    ├── lib/            # Utilities (auth, API client)
    ├── .env.local      # Frontend environment config
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Quick Start

1. **Navigate to project**
   ```bash
   cd /Users/sahilijaz/Desktop/projects-Ai-related/Multi_Tenant
   ```

2. **Start PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

3. **Backend setup**
   ```bash
   cd backend
   npm install
   npx prisma db push            # Sync schema to database
   npm run db:seed               # Add sample data
   npm run dev                   # Start on http://localhost:3001
   ```

4. **Frontend setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev                   # Start on http://localhost:3000
   ```

**Test the app:**
- Open http://localhost:3000
- Login with: `alice@acme.com` / `Admin123!`
- Or register a new organization

### Detailed Database Setup

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for:
- Database schema documentation
- Prisma Studio (visual database editor)
- Troubleshooting steps
- Sample credentials

## Development Phases

- **Phase 1** ✓ Project scaffolding (directories, packages, config)
- **Phase 2** ✓ Database schema & migrations (Prisma setup, seed data)
- **Phase 3** Authentication (JWT, middleware, register/login)
- **Phase 4** Core API (Users, Projects, Tasks with tenantId scoping)
- **Phase 5** Frontend (Auth pages, dashboard, Kanban board)
- **Phase 6** Polish (validation, error handling, rate limiting)

## Key Features (Planned)

- Multi-tenant workspace management
- User authentication with JWT
- Role-based access control (Admin, Member)
- Project creation and management
- Task tracking with status lifecycle
- Task assignment and priority levels
- Tenant statistics and dashboards
- Responsive UI with Tailwind CSS

## Security

- Passwords hashed with bcryptjs (12 rounds)
- JWT tokens with 7-day expiry
- Helmet.js for security headers
- CORS configured for frontend origin
- **Critical**: All database queries scoped by tenantId to prevent cross-tenant data access

## Contributing

Development follows the phase-by-phase implementation plan documented in the plan file.

## License

MIT
