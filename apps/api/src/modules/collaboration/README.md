# Collaboration Module

Real-time collaborative editing using WebSockets and Yjs CRDTs.

## Architecture

```
┌─────────────┐    WebSocket    ┌─────────────┐    Persist    ┌────────────┐
│   Client    │◄──────────────►│   Server    │──────────────►│ PostgreSQL │
│  (Yjs Doc)  │                │  (Yjs Doc)  │               │ (yjs_state)│
└─────────────┘                └─────────────┘               └────────────┘
```

## Events

### Client → Server

| Event                     | Payload              | Description          |
| ------------------------- | -------------------- | -------------------- |
| `collaboration:join`      | `{ noteId, user }`   | Join a room          |
| `collaboration:leave`     | -                    | Leave current room   |
| `collaboration:sync`      | `{ noteId, update }` | Send CRDT update     |
| `collaboration:awareness` | `{ noteId, update }` | Send cursor/presence |

### Server → Client

| Event                         | Payload                    | Description              |
| ----------------------------- | -------------------------- | ------------------------ |
| `collaboration:initial-state` | `{ noteId, state, users }` | Initial state on join    |
| `collaboration:update`        | `{ noteId, update }`       | Update from other client |
| `collaboration:user-joined`   | `{ id, name, color }`      | User joined room         |
| `collaboration:user-left`     | `{ userId, name }`         | User left room           |
| `collaboration:error`         | `{ message, code }`        | Error response           |

## Key Features

- **CRDT Persistence**: Document state saved to PostgreSQL (debounced 2s)
- **Room Cleanup**: Empty rooms are cleaned up after 1 minute
- **Access Control**: Validates user permissions before allowing edits
- **Graceful Shutdown**: All rooms persisted on server shutdown

## Files

| File                       | Purpose                             |
| -------------------------- | ----------------------------------- |
| `collaboration.gateway.ts` | WebSocket gateway (join/leave/sync) |
| `collaboration.service.ts` | Room management and persistence     |
| `collaboration.types.ts`   | TypeScript types                    |
| `collaboration.module.ts`  | NestJS module                       |
