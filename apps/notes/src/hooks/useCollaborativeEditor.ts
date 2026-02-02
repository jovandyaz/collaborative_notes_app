import { useEffect, useMemo, useState } from 'react';

import { COLLAB_CONFIG } from '@/lib';
import { useYjs } from '@/providers';
import type { CollaborativeUser } from '@/types';
import type { Awareness } from 'y-protocols/awareness';
import type * as Y from 'yjs';

interface UseCollaborativeEditorReturn {
  yDoc: Y.Doc;
  yXmlFragment: Y.XmlFragment;
  awareness: Awareness | null;
  currentUser: CollaborativeUser;
  isReady: boolean;
}

export function useCollaborativeEditor(
  noteId: string
): UseCollaborativeEditorReturn {
  const {
    getYDoc,
    getYText,
    getAwareness,
    currentUser,
    clearAwarenessForNote,
  } = useYjs();
  const [isReady, setIsReady] = useState<boolean>(false);

  const yDoc = useMemo(() => getYDoc(noteId), [getYDoc, noteId]);
  const awareness = useMemo(() => getAwareness(noteId), [getAwareness, noteId]);
  const yXmlFragment = useMemo(() => getYText(noteId), [getYText, noteId]);

  useEffect(() => {
    if (!yXmlFragment || !yDoc) {
      return;
    }

    const timer = setTimeout(() => {
      setIsReady(true);
    }, COLLAB_CONFIG.PROVIDER_INIT_DELAY_MS);

    return () => {
      clearTimeout(timer);
      clearAwarenessForNote(noteId);
    };
  }, [yXmlFragment, yDoc, noteId, clearAwarenessForNote]);

  return { yDoc, yXmlFragment, awareness, currentUser, isReady };
}
