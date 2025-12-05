import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { IndexeddbPersistence } from 'y-indexeddb';
import * as Y from 'yjs';

import { COLLAB_CONFIG, STORAGE_KEYS } from '@/lib';
import type { CollaborativeUser } from '@/types';

/**
 * Generate or retrieve a persistent user ID
 */
function getUserId(): string {
  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }
  return userId;
}

/**
 * Get a random cursor color for the current user
 */
function getUserColor(): string {
  const colors = COLLAB_CONFIG.CURSOR_COLORS;
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Context value for Yjs collaboration
 */
interface YjsContextValue {
  getYDoc: (noteId: string) => Y.Doc;
  getYText: (noteId: string) => Y.XmlFragment;
  currentUser: CollaborativeUser;
  activeUsers: Map<string, CollaborativeUser[]>;
  broadcastPresence: (noteId: string) => void;
}

const YjsContext = createContext<YjsContextValue | null>(null);

/**
 * Hook to access Yjs collaboration features
 */
export function useYjs() {
  const context = useContext(YjsContext);
  if (!context) {
    throw new Error('useYjs must be used within a YjsProvider');
  }
  return context;
}

interface YjsProviderProps {
  children: ReactNode;
}

/**
 * Provider for Yjs collaboration functionality
 * Manages Y.Doc instances per note and cross-tab synchronization
 */
export function YjsProvider({ children }: YjsProviderProps) {
  // Store Y.Doc instances per note ID
  const docsRef = useRef<Map<string, Y.Doc>>(new Map());
  const persistenceRef = useRef<Map<string, IndexeddbPersistence>>(new Map());
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Current user info
  const [currentUser] = useState<CollaborativeUser>(() => ({
    id: getUserId(),
    name: `User ${getUserId().slice(0, 4)}`,
    color: getUserColor(),
  }));

  // Track active users per note
  const [activeUsers, setActiveUsers] = useState<
    Map<string, CollaborativeUser[]>
  >(new Map());

  // Initialize BroadcastChannel for cross-tab sync
  useEffect(() => {
    channelRef.current = new BroadcastChannel(COLLAB_CONFIG.CHANNEL_NAME);

    const handleMessage = (event: MessageEvent) => {
      const { type, noteId, user, updates } = event.data;

      switch (type) {
        case 'presence':
          // Update active users for the note
          setActiveUsers((prev) => {
            const newMap = new Map(prev);
            const noteUsers = newMap.get(noteId) || [];
            const existingIndex = noteUsers.findIndex((u) => u.id === user.id);

            if (existingIndex >= 0) {
              noteUsers[existingIndex] = user;
            } else {
              noteUsers.push(user);
            }

            newMap.set(noteId, noteUsers);
            return newMap;
          });
          break;

        case 'update':
          // Apply Yjs update from another tab
          const doc = docsRef.current.get(noteId);
          if (doc && updates) {
            Y.applyUpdate(doc, new Uint8Array(updates));
          }
          break;

        case 'leave':
          // Remove user from active users
          setActiveUsers((prev) => {
            const newMap = new Map(prev);
            const noteUsers = (newMap.get(noteId) || []).filter(
              (u) => u.id !== user.id
            );
            newMap.set(noteId, noteUsers);
            return newMap;
          });
          break;
      }
    };

    channelRef.current.addEventListener('message', handleMessage);

    // Cleanup on unmount
    return () => {
      channelRef.current?.removeEventListener('message', handleMessage);
      channelRef.current?.close();

      // Cleanup Y.Doc instances
      docsRef.current.forEach((doc) => doc.destroy());
      persistenceRef.current.forEach((persistence) => persistence.destroy());
    };
  }, []);

  // Get or create a Y.Doc for a note
  const getYDoc = useCallback((noteId: string): Y.Doc => {
    let doc = docsRef.current.get(noteId);

    if (!doc) {
      doc = new Y.Doc();
      docsRef.current.set(noteId, doc);

      // Set up IndexedDB persistence
      const persistence = new IndexeddbPersistence(`note-${noteId}`, doc);
      persistenceRef.current.set(noteId, persistence);

      // Broadcast updates to other tabs
      doc.on('update', (update: Uint8Array) => {
        channelRef.current?.postMessage({
          type: 'update',
          noteId,
          updates: Array.from(update),
        });
      });
    }

    return doc;
  }, []);

  // Get the Y.XmlFragment for editor content
  const getYText = useCallback(
    (noteId: string): Y.XmlFragment => {
      const doc = getYDoc(noteId);
      return doc.getXmlFragment('content');
    },
    [getYDoc]
  );

  // Broadcast presence to other tabs
  const broadcastPresence = useCallback(
    (noteId: string) => {
      channelRef.current?.postMessage({
        type: 'presence',
        noteId,
        user: currentUser,
      });
    },
    [currentUser]
  );

  // Broadcast leave when component unmounts
  useEffect(() => {
    return () => {
      // Notify all notes that this user is leaving
      docsRef.current.forEach((_, noteId) => {
        channelRef.current?.postMessage({
          type: 'leave',
          noteId,
          user: currentUser,
        });
      });
    };
  }, [currentUser]);

  const value = useMemo(
    () => ({
      getYDoc,
      getYText,
      currentUser,
      activeUsers,
      broadcastPresence,
    }),
    [getYDoc, getYText, currentUser, activeUsers, broadcastPresence]
  );

  return <YjsContext.Provider value={value}>{children}</YjsContext.Provider>;
}
