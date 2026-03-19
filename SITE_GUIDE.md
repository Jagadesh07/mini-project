# Project Xeno Site Guide

## Overview
Project Xeno is a full-stack project management web application built with Next.js App Router. It supports authentication, role-based access, project and task management, realtime notifications, profile management, dashboard analytics, dark mode, and responsive layouts.

The site is designed around three user roles:
- `Admin`
- `Manager`
- `Member`

The main user journey is:
1. Land on the homepage
2. Log in or register
3. Enter the dashboard
4. Create/manage projects and tasks based on role
5. Receive and act on realtime notifications
6. Update profile data, which propagates across the site

## Core Site Working
### 1. Authentication flow
- Users authenticate with JWT-based access and refresh cookies.
- Auth routes live under `app/api/auth/*`.
- The frontend keeps the signed-in user in `AuthProvider` (`context/auth-context.tsx`).
- The Axios client automatically attempts token refresh on eligible `401` responses.
- Protected dashboard and API areas are guarded by `middleware.ts` and `middleware/auth.ts`.

### 2. Role-based behavior
- `Admin` and `Manager` can create projects and tasks.
- `Member` can work on tasks assigned to them.
- Members can update only their own assigned tasks.
- Managers can receive notifications when members change task status.

### 3. Dashboard data flow
- The dashboard loads aggregated data through `getDashboardPageData()` in `lib/dashboard-page-data.ts`.
- Metrics are produced by `lib/controllers/dashboard-controller.ts`.
- Current dashboard charting includes task count by project.
- Notifications are loaded from MongoDB and also delivered in realtime via Socket.io.

### 4. Notification flow
- Notifications are persisted in the `Notification` collection.
- Realtime emission happens through `lib/socket/notifications.ts`.
- The notification panel subscribes to user-specific socket rooms through `hooks/use-socket.ts`.
- Example notification triggers:
  - task assigned
  - task status updated
  - member status changes sent to managers
  - deadline reminder for incomplete tasks within 24 hours

### 5. Profile update flow
- Profile updates are sent to `PATCH /api/auth/me`.
- Updated user data is saved in MongoDB.
- Fresh auth cookies are reissued after profile update so the identity shown across the site stays current.
- The shared auth context is refreshed, then the route is refreshed.

### 6. Theme and UI flow
- A global header appears at the top of the site.
- The header includes:
  - site logo
  - theme toggle
  - current user avatar/name when logged in
- Theme state is managed by `ThemeProvider` in `context/theme-context.tsx`.
- Dark mode is persisted in `localStorage`.

## Tech Stack
### Frontend
- `Next.js 14` with App Router
- `React 18`
- `TypeScript`
- `Tailwind CSS`
- `Recharts` for analytics visualizations
- `react-hot-toast` for user feedback
- `clsx` for class composition

### Backend / API
- `Next.js route handlers`
- `Node.js` custom server via `server.js`
- `Socket.io` for realtime notification delivery
- `Axios` for frontend API access

### Database / Models
- `MongoDB`
- `Mongoose`

Main models:
- `User`
- `Project`
- `Task`
- `Notification`

### Auth / Security
- `jsonwebtoken`
- `bcryptjs`
- HTTP-only cookie auth
- in-memory rate limiting in `utils/rate-limit.ts`
- middleware route protection

### Validation / Utilities
- `Zod` for request validation
- structured helpers in `utils/` and `lib/api/`

## Site Map
```text
/
|- Homepage
|  |- Product intro
|  |- Workflow/illustration preview
|  '- Login CTA
|
|- /login
|  '- Sign-in form
|
|- /register
|  |- Registration form
|  '- Product preview panel
|
'- /dashboard
   |- Overview
   |  |- Summary cards
   |  |- Delivery signal visual
   |  '- Tasks-by-project chart
   |
   |- /dashboard/tasks
   |  |- Search/filter controls
   |  '- Task board with status update actions
   |
   |- /dashboard/projects
   |  |- Create Project form
   |  |- Create Task form
   |  '- Project portfolio list
   |
   |- /dashboard/notifications
   |  '- Full notification feed
   |
   '- /dashboard/profile
      '- User profile editor
```

## API Map
### Auth APIs
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `POST /api/auth/forgot-password`
- `GET /api/auth/me`
- `PATCH /api/auth/me`

### Domain APIs
- `GET /api/dashboard`
- `GET /api/projects`
- `POST /api/projects`
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `GET /api/notifications`
- `PATCH /api/notifications/:id`
- `GET /api/socket`

## Visual Elements Used Across the Site
### Global visual language
- glassmorphism cards via `.glass-panel`
- mesh-like layered card backgrounds via `.mesh-card`
- soft gradients and blurred orb accents
- serif display typography for major headings
- rounded cards and pill controls
- light and dark theme variants

### Reusable UI blocks
- `GlobalUserBar`
  - logo
  - theme switch
  - avatar/name badge
- `DashboardNav`
  - route links
  - active state indicator
  - logout button
- `DashboardPageHeader`
  - eyebrow label
  - large title
  - supporting description
- `Card`
  - standard analytics/content wrapper
- `SceneIllustration`
  - stylized visual hero/dashboard panel
- `StatsChart`
  - donut chart
  - project breakdown bar chart
  - supporting list/progress rows

## Visual Layout Summary
```text
Global Layout
+-------------------------------------------------------------+
| Header: Logo | Theme Toggle | User Avatar + Name           |
+-------------------------------------------------------------+
| Page Content                                                |
|  Dashboard pages: Sidebar + Main Content                    |
|  Auth pages: Centered card layouts                          |
|  Landing page: Hero + illustration                          |
+-------------------------------------------------------------+
```

## Folder Responsibilities
### `app/`
Contains routes, layouts, route groups, API handlers, and global styling.

### `components/`
Reusable UI building blocks such as forms, cards, nav, charts, and notification panels.

### `context/`
Global client-side providers for auth and theme state.

### `hooks/`
Custom hooks for auth access, theme access, and sockets.

### `lib/controllers/`
Business logic for auth, dashboard, tasks, projects, and notifications.

### `models/`
Mongoose schemas for core domain entities.

### `middleware/`
Helpers for auth enforcement and cross-cutting concerns.

### `utils/`
Shared low-level utilities such as API response helpers, cookies, errors, and rate limiting.

### `validations/`
Zod schemas for request payload validation.

## Important Runtime Behaviors
### Rate limiting
- Rate limiting is applied to API routes, not normal page navigation.
- Current implementation is in-memory and suitable only for single-instance or development usage.

### Realtime delivery
- Socket.io is started from `server.js`.
- Clients join user-specific channels.
- New notifications are both stored and emitted.

### Responsiveness
- The site has been adjusted for mobile, tablet, and desktop layouts.
- Shared layout and common forms/components are responsive.

### Dark mode
- Enabled through class-based theming.
- Global CSS variables drive most theme changes.

## Current Functional Highlights
- homepage with brand and workflow preview
- JWT login/register flow
- profile updates synced across the app
- manager/member/admin role model
- dashboard summary + project analytics
- task status updates with notifications
- manager notifications when members change task status
- sticky dashboard sidebar and notification area
- logo/header identity and theme toggle

## Suggested Future Improvements
- replace in-memory rate limit with Redis
- add project detail pages
- add richer task timeline/calendar views
- add upload-backed avatar storage instead of image URLs
- add server-side pagination for notifications/tasks/projects
- add tests for controllers and route handlers

## File Created For
This document is intended to act as a quick onboarding and architecture reference for anyone working on the Project Xeno codebase.
