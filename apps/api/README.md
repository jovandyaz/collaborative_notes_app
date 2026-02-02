# Knowtis API

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square" alt="Drizzle" />
  <img src="https://img.shields.io/badge/Socket.io-4.8-010101?style=flat-square&logo=socket.io" alt="Socket.io" />
</p>

**Backend API** for the Knowtis collaborative notes platform. Built with NestJS, featuring JWT authentication, real-time collaboration via WebSocket, and PostgreSQL persistence.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Database](#database)
- [WebSocket Events](#websocket-events)
- [Testing](#testing)
- [Production Deployment](#production-deployment)

---

## Features

| Feature               | Description                                  |
| --------------------- | -------------------------------------------- |
| 🔐 JWT Authentication | Access + refresh token pattern               |
| 📝 Notes CRUD         | Full create, read, update, delete operations |
| 👥 User Management    | User profiles and settings                   |
| 🔄 Real-time Sync     | WebSocket + Yjs for live collaboration       |
| 🗄️ PostgreSQL         | Reliable data persistence with Drizzle ORM   |
| ⚡ Redis Cache        | Session and cache management                 |
| 🛡️ Input Validation   | class-validator for request validation       |
| 📊 Structured Logging | Request logging and error tracking           |
| 🚀 API Versioning     | URI Versioning (v1)                          |

---

## Quick Start

### Prerequisites

| Requirement | Version |
| ----------- | ------- |
| Node.js     | ≥ 18.x  |
| pnpm        | ≥ 8.x   |
| Docker      | ≥ 20.x  |

### 1. Start Infrastructure

```bash
# From workspace root
pnpm docker:up
```

This starts:

- **PostgreSQL 16** on port 5432
- **Redis 7** on port 6379

### 2. Configure Environment

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `.env` with your settings (see [Configuration](#configuration)).

### 3. Initialize Database

```bash
# Push schema to database (development)
pnpm db:push

# Or run migrations (production)
pnpm db:migrate
```

### 4. Start Development Server

```bash
pnpm dev:api
```

The API will be available at:

- **REST API**: http://localhost:3333/api/v1
- **WebSocket**: ws://localhost:3333/collaboration

### 5. Verify Installation

```bash
curl http://localhost:3333/api/v1/health
# Response: { "status": "ok", ... }
```

---

## Project Structure

```
apps/api/
├── src/
│   ├── main.ts                  # Application entry point
│   │
│   ├── app/                     # App module
│   │   ├── app.module.ts        # Root module
│   │   ├── app.controller.ts    # Health check endpoint
│   │   └── app.service.ts
│   │
│   ├── config/                  # Configuration
│   │   ├── config.module.ts     # ConfigModule setup
│   │   └── database.config.ts   # Database configuration
│   │
│   ├── core/                    # Core functionality
│   │   ├── filters/             # Exception filters
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/        # Request interceptors
│   │   │   └── logging.interceptor.ts
│   │   └── guards/              # Global guards
│   │
│   ├── database/                # Database layer
│   │   ├── database.module.ts   # Drizzle connection
│   │   ├── schema/              # Table definitions
│   │   │   ├── users.ts
│   │   │   ├── notes.ts
│   │   │   └── index.ts
│   │   └── migrations/          # SQL migrations
│   │
│   ├── modules/                 # Feature modules
│   │   ├── auth/                # Authentication (DDD)
│   │   │   ├── application/     # Use case handlers
│   │   │   ├── domain/          # Entities, VOs, Ports
│   │   │   ├── infrastructure/  # Adapters
│   │   │   ├── strategies/      # Passport strategies
│   │   │   ├── guards/          # Auth guards
│   │   │   ├── decorators/      # Custom decorators
│   │   │   └── dto/             # Data transfer objects
│   │   │
│   │   ├── users/               # User management
│   │   │   ├── users.module.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.repository.ts
│   │   │
│   │   ├── notes/               # Notes CRUD (DDD)
│   │   │   ├── application/     # Command/Query handlers
│   │   │   ├── domain/          # Entities, VOs, Ports
│   │   │   ├── infrastructure/  # DrizzleNoteRepository
│   │   │   ├── notes.controller.ts
│   │   │   └── dto/
│   │   │
│   │   └── collaboration/       # Real-time WebSocket
│   │       ├── collaboration.module.ts
│   │       ├── collaboration.gateway.ts
│   │       └── collaboration.service.ts
│   │
│   └── adapters/                # External integrations
│       └── redis.adapter.ts
│
├── drizzle.config.ts            # Drizzle Kit config
├── ARCHITECTURE.md              # DDD Architecture guide
├── webpack.config.cjs           # Build configuration
├── tsconfig.json                # TypeScript config
└── project.json                 # Nx project config
```

---

## Configuration

### Environment Variables

Create `.env` in `apps/api/`:

```env
# Database
DATABASE_URL=postgresql://knowtis:knowtis_dev@localhost:5432/knowtis

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3333
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:4200

# Redis (optional)
REDIS_URL=redis://localhost:6379
```

### Environment Variable Reference

| Variable                 | Required | Default                 | Description                  |
| ------------------------ | -------- | ----------------------- | ---------------------------- |
| `DATABASE_URL`           | Yes      | -                       | PostgreSQL connection string |
| `JWT_SECRET`             | Yes      | -                       | Secret for access tokens     |
| `JWT_REFRESH_SECRET`     | Yes      | -                       | Secret for refresh tokens    |
| `JWT_EXPIRES_IN`         | No       | `15m`                   | Access token expiration      |
| `JWT_REFRESH_EXPIRES_IN` | No       | `7d`                    | Refresh token expiration     |
| `PORT`                   | No       | `3333`                  | Server port                  |
| `NODE_ENV`               | No       | `development`           | Environment mode             |
| `FRONTEND_URL`           | No       | `http://localhost:4200` | Allowed CORS origin          |
| `REDIS_URL`              | No       | -                       | Redis connection string      |

---

## API Reference

### Base URL

```
http://localhost:3333/api/v1
```

### Authentication

All endpoints except those marked `[Public]` require authentication via Bearer token:

```
Authorization: Bearer <access_token>
```

---

### Auth Endpoints

#### Register User `[Public]`

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response** `201 Created`:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "refreshToken": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatarUrl": null,
    "createdAt": "2026-01-04T00:00:00.000Z"
  }
}
```

#### Login `[Public]`

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** `200 OK`:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "refreshToken": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Refresh Token `[Public]`

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

**Response** `200 OK`:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

#### Get Current User

```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

**Response** `200 OK`:

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatarUrl": null
  }
}
```

#### Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

**Response** `204 No Content`

---

### Notes Endpoints

#### List Notes

```http
GET /api/v1/notes
Authorization: Bearer <access_token>
```

**Query Parameters**:
| Parameter | Type | Description |
| --------- | ------ | ------------------- |
| `search` | string | Search in title |
| `page` | number | Page number (1-based)|
| `limit` | number | Items per page |

**Response** `200 OK`:

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "My Note",
      "content": "<p>Content here...</p>",
      "ownerId": "user-uuid",
      "createdAt": "2026-01-04T00:00:00.000Z",
      "updatedAt": "2026-01-04T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

#### Get Single Note

```http
GET /api/v1/notes/:id
Authorization: Bearer <access_token>
```

**Response** `200 OK`:

```json
{
  "id": "uuid",
  "title": "My Note",
  "content": "<p>Content here...</p>",
  "ownerId": "user-uuid",
  "createdAt": "2026-01-04T00:00:00.000Z",
  "updatedAt": "2026-01-04T00:00:00.000Z",
  "collaborators": []
}
```

#### Create Note

```http
POST /api/v1/notes
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "New Note",
  "content": "<p>Initial content</p>"
}
```

**Response** `201 Created`:

```json
{
  "id": "uuid",
  "title": "New Note",
  "content": "<p>Initial content</p>",
  "ownerId": "user-uuid",
  "createdAt": "2026-01-04T00:00:00.000Z",
  "updatedAt": "2026-01-04T00:00:00.000Z"
}
```

#### Update Note

```http
PATCH /api/v1/notes/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "<p>Updated content</p>"
}
```

**Response** `200 OK`:

```json
{
  "id": "uuid",
  "title": "Updated Title",
  "content": "<p>Updated content</p>",
  "updatedAt": "2026-01-04T00:00:00.000Z"
}
```

#### Delete Note

```http
DELETE /api/v1/notes/:id
Authorization: Bearer <access_token>
```

**Response** `204 No Content`

#### Share Note

```http
POST /api/v1/notes/:id/share
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "userId": "user-uuid",
  "permission": "edit"
}
```

**Response** `200 OK`:

```json
{
  "message": "Note shared successfully"
}
```

---

### Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2026-01-04T00:00:00.000Z",
  "path": "/api/v1/notes"
}
```

| Status Code | Description                    |
| ----------- | ------------------------------ |
| 400         | Bad Request / Validation Error |
| 401         | Unauthorized                   |
| 403         | Forbidden                      |
| 404         | Not Found                      |
| 409         | Conflict (e.g., duplicate)     |
| 500         | Internal Server Error          |

---

## Database

### Technology

- **PostgreSQL 16** - Primary database
- **Drizzle ORM** - Type-safe SQL toolkit

### Schema Overview

```
┌─────────────────┐     ┌──────────────────┐
│     users       │     │      notes       │
├─────────────────┤     ├──────────────────┤
│ id (PK)         │────<│ owner_id (FK)    │
│ email           │     │ id (PK)          │
│ password        │     │ title            │
│ name            │     │ content          │
│ avatar_url      │     │ created_at       │
│ created_at      │     │ updated_at       │
│ updated_at      │     └──────────────────┘
└─────────────────┘             │
                                │
                    ┌───────────┴────────────┐
                    │   note_collaborators   │
                    ├────────────────────────┤
                    │ note_id (FK)           │
                    │ user_id (FK)           │
                    │ permission             │
                    │ created_at             │
                    └────────────────────────┘
```

### Database Commands

| Command            | Description                         |
| ------------------ | ----------------------------------- |
| `pnpm db:push`     | Push schema changes to DB (dev)     |
| `pnpm db:generate` | Generate migration files            |
| `pnpm db:migrate`  | Run pending migrations              |
| `pnpm db:studio`   | Open Drizzle Studio (visual editor) |

### Migrations

```bash
# Generate migration after schema changes
pnpm db:generate

# Apply migrations
pnpm db:migrate
```

---

## WebSocket Events

### Namespace

```
/collaboration
```

### Connection

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3333/collaboration', {
  auth: { token: accessToken },
});
```

### Events

#### Client → Server

| Event                     | Payload                                  | Description             |
| ------------------------- | ---------------------------------------- | ----------------------- |
| `collaboration:join`      | `{ noteId: string, user: User }`         | Join collaboration room |
| `collaboration:leave`     | `{ noteId: string }`                     | Leave room              |
| `collaboration:sync`      | `{ noteId: string, update: Uint8Array }` | Send Yjs update         |
| `collaboration:awareness` | `{ noteId: string, state: object }`      | Send presence update    |

#### Server → Client

| Event                       | Payload                     | Description        |
| --------------------------- | --------------------------- | ------------------ |
| `collaboration:joined`      | `{ noteId, users: User[] }` | Room joined        |
| `collaboration:user-joined` | `{ user: User }`            | New user in room   |
| `collaboration:user-left`   | `{ userId: string }`        | User left room     |
| `collaboration:update`      | `{ update: Uint8Array }`    | Receive Yjs update |
| `collaboration:awareness`   | `{ userId, state }`         | Receive presence   |

---

## Testing

### Running Tests

```bash
# Run all tests
nx test api

# Watch mode
nx test api --watch

# With coverage
nx test api --coverage
```

### Test Structure

```
src/
├── modules/
│   ├── auth/
│   │   └── application/handlers/*.spec.ts
│   └── notes/
│       └── application/commands/*.spec.ts
```

---

## Production Deployment

### Build

```bash
pnpm build:api
```

Output: `dist/apps/api/main.js`

### Run

```bash
# Set production environment variables first
export NODE_ENV=production
export DATABASE_URL=postgresql://...
export JWT_SECRET=...
# etc.

# Run
node dist/apps/api/main.js
```

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy built application
COPY dist/apps/api ./
COPY node_modules ./node_modules

# Set environment
ENV NODE_ENV=production
ENV PORT=3333

EXPOSE 3333

CMD ["node", "main.js"]
```

### Docker Build

```bash
docker build -t knowtis-api .
docker run -p 3333:3333 --env-file .env knowtis-api
```

### Health Check

```bash
curl http://localhost:3333/api/v1/health
# { "status": "ok", ... }
```

### Production Checklist

- [ ] Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET` (min 32 chars)
- [ ] Use secure PostgreSQL credentials
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper `FRONTEND_URL` for CORS
- [ ] Enable HTTPS (via reverse proxy)
- [ ] Set up database backups
- [ ] Configure logging aggregation
- [ ] Set up health monitoring

---

## Related Documentation

- [Root README](../../README.md) - Workspace overview
- [Notes App](../notes/README.md) - Frontend application
- [Architecture Guide](../../docs/ARCHITECTURE.md) - System design
- [API Client Library](../../libs/api-client/README.md) - Client SDK

---

<p align="center">
  Part of the <strong>Knowtis</strong> monorepo
</p>
