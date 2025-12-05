import { useEffect } from 'react';

import Collaboration from '@tiptap/extension-collaboration';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';

import { cn } from '@/lib';
import { useYjs } from '@/providers';

import { CollaborationIndicator } from './CollaborationIndicator';
import { EditorToolbar } from './EditorToolbar';

interface CollaborativeEditorProps {
  noteId: string;
  initialContent: string;
  onUpdate: (content: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Collaborative rich text editor using Tiptap + Yjs
 * Supports real-time collaboration via BroadcastChannel
 */
export function CollaborativeEditor({
  noteId,
  initialContent,
  onUpdate,
  placeholder = 'Start writing...',
  className,
}: CollaborativeEditorProps) {
  const { getYText, currentUser, activeUsers, broadcastPresence } = useYjs();

  // Get Yjs fragment for this note
  const yXmlFragment = getYText(noteId);

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      Collaboration.configure({
        fragment: yXmlFragment,
      }),
    ],
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base max-w-none',
          'min-h-[300px] p-6',
          'focus:outline-none',
          'prose-headings:text-foreground font-bold',
          'prose-p:text-foreground leading-relaxed',
          'prose-strong:text-foreground font-semibold',
          'prose-em:text-foreground italic',
          'prose-ul:text-foreground',
          'prose-ol:text-foreground',
          'prose-li:text-foreground marker:text-muted-foreground'
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  // Initialize content if Yjs fragment is empty
  useEffect(() => {
    if (editor && yXmlFragment.length === 0 && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, yXmlFragment, initialContent]);

  // Broadcast presence when editor mounts
  useEffect(() => {
    broadcastPresence(noteId);

    // Periodically broadcast presence (heartbeat)
    const interval = setInterval(() => {
      broadcastPresence(noteId);
    }, 5000);

    return () => clearInterval(interval);
  }, [noteId, broadcastPresence]);

  // Get other users editing this note (exclude current user)
  const otherUsers = (activeUsers.get(noteId) || []).filter(
    (u) => u.id !== currentUser.id
  );

  return (
    <div className={cn('relative', className)}>
      {/* Collaboration indicator */}
      {otherUsers.length > 0 && (
        <CollaborationIndicator users={otherUsers} />
      )}

      <EditorToolbar editor={editor} />
      <div
        className={cn(
          'rounded-2xl border border-border bg-card/50 backdrop-blur-sm',
          'transition-all duration-300 focus-within:border-primary/50 focus-within:shadow-lg focus-within:shadow-primary/5'
        )}
      >
        <EditorContent
          editor={editor}
          className="[&_.ProseMirror]:min-h-[300px] [&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child]:before:text-muted-foreground/50 [&_.ProseMirror_p.is-editor-empty:first-child]:before:float-left [&_.ProseMirror_p.is-editor-empty:first-child]:before:h-0 [&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none"
          data-placeholder={placeholder}
        />
      </div>
    </div>
  );
}
