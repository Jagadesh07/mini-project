# Smart Task & Project Management System

Production-ready starter built from the prompt using Next.js App Router, TypeScript, Tailwind CSS, MongoDB, Mongoose, JWT cookie auth, RBAC, Zod validation and Socket.io.

## What is included

- JWT auth with access and refresh cookies
- Register, login, logout, refresh token rotation, forgot-password simulation
- Role-aware permissions for Admin, Manager and Member
- Project CRUD with soft delete
- Task creation, assignment, status updates, priority and deadline tracking
- MongoDB notification model with realtime Socket.io delivery
- Dashboard analytics cards plus Recharts visualization
- Axios client setup and auth context for frontend integration
- Middleware-based rate limiting and route protection

## Folder structure

- `app/`
- `components/`
- `context/`
- `hooks/`
- `lib/`
- `middleware/`
- `models/`
- `utils/`
- `validations/`

## Setup

1. Copy `.env.example` to `.env.local`.
2. Start MongoDB locally or point `MONGODB_URI` to your cluster.
3. Install dependencies with `npm install`.
4. Run the custom Next.js + Socket.io server with `npm run dev`.
5. Open `http://localhost:3000`.

## Key routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `POST /api/auth/forgot-password`
- `GET /api/auth/me`
- `GET/POST /api/projects`
- `PATCH/DELETE /api/projects/:id`
- `GET/POST /api/tasks`
- `PATCH /api/tasks/:id`
- `GET /api/notifications`
- `PATCH /api/notifications/:id`
- `GET /api/dashboard`

## Notes

- Socket.io runs from `server.js` at `/api/socket/io`.
- Cookies are HTTP-only and secure in production.
- The current rate limiter is in-memory and should be replaced with Redis for multi-instance deployment.
- Forgot-password is intentionally simulated per the prompt.
