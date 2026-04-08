# Database Setup Guide

## Overview

FlowSpace uses PostgreSQL 15 as its database with Prisma as the ORM. For local development, a Docker container is provided via `docker-compose.yml`.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ and npm

## Setup Instructions

### 1. Start PostgreSQL Database

From the project root:

```bash
docker-compose up -d
```

This will:
- Download and start a PostgreSQL 15 Alpine container named `flowspace-db`
- Create the `flowspace` database
- Expose PostgreSQL on `localhost:5432`
- Create a persistent volume for data (`postgres_data`)

Verify the database is running:
```bash
docker-compose ps
```

You should see `flowspace-db` with status `Up` and `healthy`.

### 2. Generate Prisma Client

From the `backend/` directory:

```bash
npx prisma generate
```

This generates the type-safe Prisma client based on the schema.

### 3. Apply Database Schema

Push the Prisma schema to the database:

```bash
npx prisma db push
```

This will:
- Create all 4 tables: `tenants`, `users`, `projects`, `tasks`
- Create all indexes for performance
- Initialize the schema

### 4. Seed Development Data (Optional)

Add sample data for testing:

```bash
npm run db:seed
```

This creates:
- 2 sample tenants (Acme Corp, Beta Corp)
- 3 sample users with different roles
- 1 sample project with 3 sample tasks

**Test Credentials:**
- **Acme Corp Admin**: `alice@acme.com` / `Admin123!`
- **Acme Corp Member**: `bob@acme.com` / `Admin123!`
- **Beta Corp Admin**: `charlie@beta.com` / `Admin123!`

### 5. View Database with Prisma Studio (Optional)

Open an interactive browser UI to explore and edit database:

```bash
npm run db:studio
```

This opens `http://localhost:5555` where you can:
- View all tables and records
- Create, update, delete records
- Run raw SQL queries
- Inspect relationships

## Database Schema

### Tenants Table
Stores organization accounts.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (CUID) | Primary key |
| name | String | Organization name |
| slug | String | Unique URL-safe identifier (e.g., "acme-corp") |
| plan | Enum | Subscription tier (free, pro, enterprise) |
| createdAt | DateTime | Auto-set on creation |
| updatedAt | DateTime | Auto-updated on change |

### Users Table
Stores user accounts. **Each user belongs to exactly ONE tenant.**

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (CUID) | Primary key |
| tenantId | UUID (FK) | References tenants.id |
| name | String | User's display name |
| email | String | Login email |
| passwordHash | String | bcrypt hashed password |
| role | Enum | admin or member |
| isActive | Boolean | Soft-delete flag (false = deactivated) |
| createdAt | DateTime | Auto-set on creation |
| updatedAt | DateTime | Auto-updated on change |

**Unique Constraint**: `(tenantId, email)` — emails are unique per tenant, not globally. Two tenants can have the same email.

### Projects Table
Stores projects within a tenant.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (CUID) | Primary key |
| tenantId | UUID (FK) | References tenants.id |
| createdById | UUID (FK) | References users.id (creator) |
| name | String | Project name |
| description | String | Optional description |
| status | Enum | active, archived, or completed |
| dueDate | DateTime | Optional deadline |
| createdAt | DateTime | Auto-set on creation |
| updatedAt | DateTime | Auto-updated on change |

### Tasks Table
Stores tasks within projects.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID (CUID) | Primary key |
| tenantId | UUID (FK) | References tenants.id (for fast filtering) |
| projectId | UUID (FK) | References projects.id |
| createdById | UUID (FK) | References users.id (creator) |
| assignedToId | UUID (FK) | References users.id (optional, nullable) |
| title | String | Task title |
| description | String | Optional description |
| status | Enum | todo, in_progress, in_review, done |
| priority | Enum | low, medium, high, urgent |
| dueDate | DateTime | Optional deadline |
| createdAt | DateTime | Auto-set on creation |
| updatedAt | DateTime | Auto-updated on change |

## Key Design Decisions

### Multi-Tenancy
- **Strategy**: Shared Database, Shared Schema
- **Isolation**: Every table has a `tenantId` column
- **Enforcement**: The application layer (not database) ensures all queries include `tenantId` in WHERE clauses
- **Why**: Cost-efficient, scalable, and sufficient for this SaaS model

### Email Uniqueness
- Constraint: `@@unique([tenantId, email])`
- Means: Same email can exist in different tenants, but not within the same tenant
- Why: Multi-tenant systems allow users from different orgs to have matching emails

### Soft Deletes
- Users: `isActive` boolean flag (set to false to deactivate, don't hard-delete)
- Why: Preserves data history and prevents cascade issues with task ownership

### Indexes
All indexes start with `tenantId`:
- `@@index([tenantId])`
- `@@index([tenantId, isActive])`
- `@@index([tenantId, status])`
- `@@index([tenantId, projectId])`
- `@@index([tenantId, assignedToId])`

Why: PostgreSQL composite indexes use the leftmost column for filtering. Since every query filters by tenantId first, this ensures index hits on all tenant-scoped queries.

## Useful Commands

### View database in browser
```bash
npm run db:studio
```

### Reseed database (clears and repopulates)
```bash
npx prisma migrate reset
```

### View database URL
```bash
echo $DATABASE_URL
```

### Connect to database via psql
```bash
docker exec flowspace-db psql -U postgres -d flowspace
```

### View table structure
```bash
docker exec flowspace-db psql -U postgres -d flowspace -c "\d tenants"
```

### Check table row counts
```bash
docker exec flowspace-db psql -U postgres -d flowspace -c \
  "SELECT 'tenants' as table_name, count(*) FROM tenants UNION ALL \
   SELECT 'users', count(*) FROM users UNION ALL \
   SELECT 'projects', count(*) FROM projects UNION ALL \
   SELECT 'tasks', count(*) FROM tasks;"
```

## Troubleshooting

### "Can't reach database server"
- Ensure Docker is running: `docker ps`
- Ensure container is up: `docker-compose ps`
- Wait 5-10 seconds after starting (container needs time to initialize)

### "database 'flowspace' does not exist"
- The database is created by docker-compose automatically
- If it doesn't exist, check container logs: `docker-compose logs postgres`

### "permission denied"
- Verify `.env` has correct DATABASE_URL
- Default: `postgresql://postgres:postgres@localhost:5432/flowspace`

### Want to reset everything?
```bash
docker-compose down -v           # Stop and remove volume
docker-compose up -d             # Start fresh
npm run db:push
npm run db:seed
```

## Next Steps

Once the database is set up:
1. Start the backend: `npm run dev` (in `backend/` directory)
2. Proceed to Phase 3: Authentication implementation
