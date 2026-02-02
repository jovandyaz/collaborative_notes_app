# @knowtis/api-client

HTTP and WebSocket client for the Knowtis API.

## Installation

Already available in the monorepo. Import from `@knowtis/api-client`.

## Quick Start

```typescript
import { authApi, collaborationClient, notesApi } from '@knowtis/api-client';

// Auth
await authApi.login({ email, password });
const profile = await authApi.getProfile();

// Notes
const notes = await notesApi.getAll();
const note = await notesApi.create({ title: 'New Note' });

// Collaboration
collaborationClient.connect();
collaborationClient.joinRoom(noteId, { name: 'User', color: '#ff0000' });
```

## Modules

### `authApi`

- `register(input)` - Create account
- `login(input)` - Login and store tokens
- `refreshToken()` - Refresh access token
- `getProfile()` - Get current user
- `logout()` - Clear tokens
- `isAuthenticated()` - Check auth status

### `notesApi`

- `getAll(params?)` - List notes
- `getById(id)` - Get single note
- `create(input)` - Create note
- `update(id, input)` - Update note
- `delete(id)` - Delete note
- `share(noteId, input)` - Share note
- `getCollaborators(noteId)` - List collaborators
- `revokeAccess(noteId, userId)` - Remove access

### `collaborationClient`

- `connect()` - Connect to WebSocket
- `disconnect()` - Disconnect
- `joinRoom(noteId, user)` - Join collaboration room
- `leaveRoom()` - Leave room
- `sendUpdate(update)` - Send Yjs update
- `setHandlers(handlers)` - Set event handlers

## Configuration

Environment variables (Vite):

```env
VITE_API_URL=http://localhost:3333/api
VITE_WS_URL=http://localhost:3333
```

## Features

- Automatic token refresh on 401
- Request deduplication during refresh
- TypeScript types for all responses
- Singleton pattern for global state
