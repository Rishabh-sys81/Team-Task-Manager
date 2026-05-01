# TaskFlow — Team Task Manager

## Overview

A full-stack team task manager with authentication, role-based access, project management, task tracking, and a real-time dashboard. Built with React + Vite frontend, Express backend, PostgreSQL database, and Clerk authentication.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/task-manager)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Clerk (managed)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **UI**: Tailwind CSS v4, shadcn/ui components

## Key Features

- Signup/Login via Clerk auth
- Projects: create, update, delete, manage members
- Tasks: create, assign, track status (todo/in_progress/done), set priority and due dates
- Dashboard: summary stats, my tasks, overdue tasks, recent activity feed
- Role-based access: Admin (can manage members/project) vs Member
- Kanban board view per project

## Project Structure

```
artifacts/
  api-server/        — Express REST API server
    src/
      routes/        — API route handlers (users, projects, tasks, members, dashboard)
      middlewares/   — Auth (requireAuth, clerkProxyMiddleware)
  task-manager/      — React + Vite frontend

lib/
  api-spec/          — OpenAPI spec + Orval codegen config
  api-client-react/  — Generated React Query hooks
  api-zod/           — Generated Zod validation schemas
  db/                — Drizzle ORM schema + database connection
    src/schema/      — users, projects, project_members, tasks, activity_log
```

## Database Schema

- `users` — Clerk user ID + profile (name, email, systemRole: admin/member)
- `projects` — Project with name, description, color, ownerId
- `project_members` — Join table with role (admin/member)
- `tasks` — Title, description, status, priority, assignee, dueDate
- `activity_log` — Audit trail of actions

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## API Endpoints

- `GET /api/healthz` — health check
- `GET/PUT /api/users/me` — current user
- `GET /api/users` — list all users
- `GET/POST /api/projects` — list/create projects
- `GET/PUT/DELETE /api/projects/:id` — project CRUD
- `GET/POST /api/projects/:id/members` — manage members
- `PUT/DELETE /api/projects/:id/members/:userId` — update/remove member
- `GET/POST /api/tasks` — list/create tasks (filterable)
- `GET/PUT/DELETE /api/tasks/:id` — task CRUD
- `GET /api/dashboard/summary` — stats
- `GET /api/dashboard/my-tasks` — tasks assigned to me
- `GET /api/dashboard/overdue` — overdue tasks
- `GET /api/dashboard/activity` — recent activity feed

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
