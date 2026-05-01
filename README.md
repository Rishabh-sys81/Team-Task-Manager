# TaskFlow — Team Task Manager

A full-stack team productivity app where teams create projects, assign tasks, and track progress with role-based access control.

**Live Demo:** _Deploy your own instance — see [Deployment](#deployment) below_

---

## Features

- **Authentication** — Secure sign-up / sign-in powered by Clerk
- **Projects** — Create and manage projects with color coding and member management
- **Tasks** — Create, assign, and track tasks with status (Todo / In Progress / Done), priority levels (Low / Medium / High), and due dates
- **Kanban Board** — Per-project drag-and-drop task board
- **Dashboard** — Summary stats, tasks assigned to you, overdue tasks, and a real-time activity feed
- **Role-Based Access** — Project Admins can manage members and settings; Members can manage tasks
- **Team Management** — Invite users to projects and assign them roles

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL, Drizzle ORM |
| Auth | Clerk |
| API Contract | OpenAPI 3.1, Orval (codegen) |
| Data Fetching | TanStack React Query |
| Validation | Zod |
| Monorepo | pnpm workspaces |
| Language | TypeScript (strict) |

---

## Project Structure

```
taskflow/
├── artifacts/
│   ├── api-server/          # Express REST API
│   │   └── src/
│   │       ├── routes/      # users, projects, tasks, members, dashboard
│   │       └── middlewares/ # Clerk auth, requireAuth guard
│   └── task-manager/        # React + Vite frontend
│       └── src/
│           ├── pages/       # Dashboard, Projects, Tasks, Settings
│           └── components/  # UI components
├── lib/
│   ├── api-spec/            # OpenAPI spec + Orval config
│   ├── api-client-react/    # Generated React Query hooks
│   ├── api-zod/             # Generated Zod validation schemas
│   └── db/                  # Drizzle ORM schema + migrations
├── .gitignore
├── package.json
└── pnpm-workspace.yaml
```

---

## Database Schema

| Table | Description |
|---|---|
| `users` | Clerk user ID, email, name, system role (admin/member) |
| `projects` | Name, description, color, owner |
| `project_members` | User ↔ Project join table with role (admin/member) |
| `tasks` | Title, status, priority, assignee, due date |
| `activity_log` | Audit trail of all actions |

---

## API Endpoints

```
GET    /api/healthz

GET    /api/users/me
PUT    /api/users/me
GET    /api/users

GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id

GET    /api/projects/:id/members
POST   /api/projects/:id/members
PUT    /api/projects/:id/members/:userId
DELETE /api/projects/:id/members/:userId

GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id

GET    /api/dashboard/summary
GET    /api/dashboard/my-tasks
GET    /api/dashboard/overdue
GET    /api/dashboard/activity
```

All endpoints (except `/api/healthz`) require a valid Clerk Bearer token in the `Authorization` header.

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL database
- Clerk account (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/taskflow

# Clerk Auth — get these from https://dashboard.clerk.com
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Session
SESSION_SECRET=your-random-secret-here
```

### 4. Push the database schema

```bash
pnpm --filter @workspace/db run push
```

### 5. Start development servers

API server (runs on port 8080):
```bash
pnpm --filter @workspace/api-server run dev
```

Frontend (runs on port 5173):
```bash
pnpm --filter @workspace/task-manager run dev
```

Then open [http://localhost:5173](http://localhost:5173)

---

## Regenerating API Code

The API client hooks and Zod schemas are generated from the OpenAPI spec. If you change `lib/api-spec/openapi.yaml`, regenerate with:

```bash
pnpm --filter @workspace/api-spec run codegen
```

---

## Deployment

### Railway (Recommended)

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) and create a new project
3. Add a PostgreSQL plugin to your Railway project
4. Deploy from your GitHub repo
5. Set the environment variables listed above in Railway's Variables tab
6. Railway auto-detects the start command — set it to:
   ```
   pnpm --filter @workspace/api-server run start
   ```
7. For the frontend, deploy separately (Vercel / Netlify recommended) pointing to `artifacts/task-manager` as the root directory with build command `pnpm run build`

### Environment Variables for Production

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `CLERK_SECRET_KEY` | Clerk secret key (from Clerk Dashboard) |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `VITE_CLERK_PUBLISHABLE_KEY` | Same as above (used by Vite build) |
| `SESSION_SECRET` | Random string for session signing |
| `PORT` | Port for the API server (Railway sets this automatically) |

---

## Role-Based Access Control

| Action | Admin | Member |
|---|---|---|
| View project | Yes | Yes |
| Create tasks | Yes | Yes |
| Update tasks | Yes | Yes |
| Delete tasks | Yes | No |
| Add members | Yes | No |
| Update member roles | Yes | No |
| Remove members | Yes | No |
| Update project settings | Yes | No |
| Delete project | Owner only | No |

---

## License

MIT
