
/**
 * BACKEND API DESIGN (RESTful)
 * ----------------------------
 * AUTH:
 * POST /api/v1/auth/register - Create new account
 * POST /api/v1/auth/login - Return JWT + User info
 * GET  /api/v1/auth/me - Verify session
 * 
 * PROJECTS:
 * GET    /api/v1/projects - List user's projects
 * POST   /api/v1/projects - Create project
 * PATCH  /api/v1/projects/:id - Update details
 * DELETE /api/v1/projects/:id - Archive/Delete
 * 
 * TASKS:
 * GET    /api/v1/projects/:id/tasks - Get board state
 * POST   /api/v1/tasks - Create task
 * PATCH  /api/v1/tasks/:id - Update (status, priority, assignee)
 * 
 * DATABASE SCHEMA (PostgreSQL)
 * ----------------------------
 * Users: id, name, email, password_hash, avatar_url, created_at
 * Projects: id, name, description, owner_id (FK), created_at
 * Project_Members: project_id, user_id, role (FK)
 * Tasks: id, project_id (FK), title, description, status (ENUM), priority (ENUM), assignee_id (FK), due_date, created_at
 * Comments: id, task_id (FK), user_id (FK), content, created_at
 * Notifications: id, user_id (FK), type, data (JSON), read, timestamp
 * 
 * WEBSOCKET EVENT FLOW (Socket.io)
 * --------------------------------
 * Client: Join Room `project:${id}`
 * Server: `task:created` -> Broadcast to room
 * Server: `task:updated` (Status Change) -> Broadcast to room
 * Server: `task:commented` -> Broadcast to room
 * Server: `notification:new` -> Direct message to specific user_id
 */

export const BACKEND_DOCUMENTATION = "Production-ready system architecture defined in comments.";
