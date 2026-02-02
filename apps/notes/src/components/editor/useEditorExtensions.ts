import { useMemo } from 'react';

import type { CollaborativeUser } from '@/types';
import Collaboration from '@tiptap/extension-collaboration';
import Underline from '@tiptap/extension-underline';
import type { AnyExtension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { Awareness } from 'y-protocols/awareness';
import type * as Y from 'yjs';

import { CollaborativeCursors } from './CollaborativeCursors';

export function useEditorExtensions(
  yDoc: Y.Doc,
  yXmlFragment: Y.XmlFragment,
  awareness: Awareness | null,
  currentUser: CollaborativeUser
): AnyExtension[] {
  return useMemo(() => {
    const extensions: AnyExtension[] = [
      StarterKit.configure({
        undoRedo: false,
        bulletList: {
          HTMLAttributes: { class: 'list-disc list-outside ml-6' },
        },
        orderedList: {
          HTMLAttributes: { class: 'list-decimal list-outside ml-6' },
        },
        listItem: {
          HTMLAttributes: { class: 'leading-normal' },
        },
      }),
      Underline,
      Collaboration.configure({
        document: yDoc,
        fragment: yXmlFragment,
      }),
    ];

    if (awareness) {
      extensions.push(
        CollaborativeCursors.configure({
          awareness,
          user: {
            name: currentUser.name,
            color: currentUser.color,
          },
        })
      );
    }

    return extensions;
  }, [yDoc, yXmlFragment, awareness, currentUser.name, currentUser.color]);
}
