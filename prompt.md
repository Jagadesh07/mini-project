You are a senior full-stack architect.

Build a production-ready Smart Task & Project Management System with the following stack and architecture.

=========================
TECH STACK
=========================

Frontend:
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Axios
- React Context or Zustand for state management

Backend:
- Next.js API Routes (Route Handlers)
- MongoDB
- Mongoose ODM

Authentication:
- JWT (access + refresh token strategy)
- HTTP-only secure cookies
- bcrypt password hashing
- Role-based access control (RBAC)

Real-time:
- Socket.io for real-time notifications

Validation:
- Zod for request validation

Security:
- Rate limiting
- Input sanitization
- CORS configuration
- Proper error handling middleware
- Environment variable usage

=========================
CORE FEATURES
=========================

1. Authentication System
   - Register
   - Login
   - Logout
   - Refresh token
   - Forgot password (email simulation acceptable)
   - Role-based access (Admin, Manager, Member)

2. User Roles
   - Admin:
       - Manage users
       - View all projects
   - Manager:
       - Create projects
       - Add members
       - Assign tasks
   - Member:
       - View assigned projects
       - Update task status

3. Project Management
   - Create project
   - Edit project
   - Delete project (soft delete)
   - Add members to project
   - View project analytics

4. Task Management
   - Create task
   - Assign to user
   - Update status (Todo, In Progress, Completed)
   - Set priority (Low, Medium, High)
   - Set deadline
   - Filter and search tasks

5. Notifications
   - Real-time notification when:
       - Task assigned
       - Task status updated
       - Deadline approaching (24 hours before)
   - Notification model in MongoDB
   - Mark notification as read

6. Dashboard
   - Task statistics
   - Completion percentage
   - Overdue tasks count
   - Charts (use a lightweight chart library)

=========================
DATABASE DESIGN
=========================

Design Mongoose schemas for:

User:
- name
- email (unique)
- password (hashed)
- role (Admin | Manager | Member)
- createdAt
- updatedAt

Project:
- title
- description
- createdBy (ref User)
- members (array of User refs)
- isDeleted (boolean)
- timestamps

Task:
- title
- description
- project (ref Project)
- assignedTo (ref User)
- status
- priority
- deadline
- timestamps

Notification:
- user (ref User)
- message
- read (boolean)
- relatedTask (optional ref)
- createdAt

Add indexes where necessary.

=========================
FOLDER STRUCTURE
=========================

Use a clean scalable architecture:

/app
   /(auth)
   /(dashboard)
   /api
/lib
/models
/middleware
/utils
/context
/components
/hooks

Follow separation of concerns:
- Controllers logic separate from route handlers
- Middleware reusable
- Validation schemas separate

=========================
AUTH FLOW
=========================

- Store access token in HTTP-only cookie
- Refresh token rotation
- Protect API routes with middleware
- Attach user to request object
- Role-check middleware

=========================
API DESIGN
=========================

Use RESTful API conventions:

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/projects
POST   /api/projects
GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/projects/:id

Return consistent JSON response structure:
{
  success: boolean,
  data: {},
  message: string,
  error?: string
}

=========================
ERROR HANDLING
=========================

- Global error handler
- Try/catch async wrapper
- Meaningful status codes
- Custom error class

=========================
REAL-TIME SETUP
=========================

- Configure Socket.io server in Next.js
- Join user to room by userId
- Emit notification event on task update
- Frontend listens and shows toast

=========================
DELIVERABLES
=========================

1. Complete folder structure
2. All Mongoose schemas
3. Auth implementation
4. Middleware implementation
5. API route handlers
6. Example frontend integration (Axios)
7. Socket.io integration
8. Step-by-step explanation
9. Setup instructions
10. .env example

Write clean, maintainable, scalable code.
Follow best practices.
Use TypeScript strictly.
Add comments explaining important logic.