import { useEffect } from 'react';

import UnderlineExtension from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { cn } from '@/lib';

import { EditorToolbar } from './EditorToolbar';

interface RichTextEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

/**
 * Rich text editor component using Tiptap
 * Supports bold, italic, underline, and lists
 */
export function RichTextEditor({
  content,
  onUpdate,
  placeholder = 'Start writing...',
  className,
  editable = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, UnderlineExtension],
    content,
    editable,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base max-w-none',
          'min-h-[200px] p-6',
          'focus:outline-none',
          // Custom prose styling
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

  // Update content when it changes externally (e.g., from Yjs sync)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  return (
    <div className={cn('relative', className)}>
      <EditorToolbar editor={editor} />
      <div
        className={cn(
          'rounded-2xl border border-border bg-card/50 backdrop-blur-sm',
          'transition-all duration-300 focus-within:border-primary/50 focus-within:shadow-lg focus-within:shadow-primary/5'
        )}
      >
        <EditorContent
          editor={editor}
          className="[&_.ProseMirror]:min-h-[200px] [&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child]:before:text-muted-foreground/50 [&_.ProseMirror_p.is-editor-empty:first-child]:before:float-left [&_.ProseMirror_p.is-editor-empty:first-child]:before:h-0 [&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none"
          data-placeholder={placeholder}
        />
      </div>
    </div>
  );
}
