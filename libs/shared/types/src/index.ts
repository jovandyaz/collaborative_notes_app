export type {
  User,
  UserProfile,
  CreateUserInput,
  UpdateUserInput,
} from './lib/user.types';

export type {
  Note,
  NoteWithOwner,
  CreateNoteInput,
  UpdateNoteInput,
  PermissionLevel,
  NotePermission,
  ShareNoteInput,
} from './lib/note.types';

export type {
  LoginInput,
  RegisterInput,
  AuthTokens,
  AuthResponse,
  RefreshTokenInput,
  OAuthProvider,
  JwtUserPayload,
  RequestUser,
} from './lib/auth.types';

export type {
  ApiError,
  PaginationMeta,
  PaginatedResponse,
  PaginationQuery,
  ApiSuccessResponse,
} from './lib/api.types';

export {
  COLLABORATION_EVENTS,
  type CollaborationEventType,
  type CollaborationUser,
  type JoinRoomPayload,
  type SyncUpdatePayload,
  type AwarenessUpdatePayload,
  type InitialStateResponse,
  type CollaborationError,
  type UserJoinedPayload,
  type UserLeftPayload,
} from './lib/collaboration.types';
