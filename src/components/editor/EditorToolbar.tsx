import { memo } from 'react';

import type { Editor } from '@tiptap/react';
import { motion } from 'motion/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Redo,
  Underline,
  Undo,
} from 'lucide-react';

import { cn } from '@/lib';

import { Button } from '../ui/Button';

interface EditorToolbarProps {
  editor: Editor | null;
}

/**
 * Toolbar for the rich text editor
 * Provides formatting controls: bold, italic, underline, lists
 * Refactored to use a modern floating pill design
 */
export const EditorToolbar = memo(function EditorToolbar({
  editor,
}: EditorToolbarProps) {
  if (!editor) return null;

  const tools = [
    {
      icon: Bold,
      label: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      shortcut: 'Ctrl+B',
    },
    {
      icon: Italic,
      label: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      shortcut: 'Ctrl+I',
    },
    {
      icon: Underline,
      label: 'Underline',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
      shortcut: 'Ctrl+U',
    },
    { type: 'separator' as const },
    {
      icon: List,
      label: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: ListOrdered,
      label: 'Numbered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    { type: 'separator' as const },
    {
      icon: Undo,
      label: 'Undo',
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      disabled: !editor.can().undo(),
    },
    {
      icon: Redo,
      label: 'Redo',
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      disabled: !editor.can().redo(),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-4 z-10 mx-auto mb-4 w-fit"
    >
      <div className="flex items-center gap-1 rounded-full border border-border/50 bg-background/80 p-1 shadow-lg shadow-black/5 backdrop-blur-md dark:bg-muted/30">
        {tools.map((tool, index) => {
          if ('type' in tool && tool.type === 'separator') {
            return (
              <div
                key={`sep-${index}`}
                className="mx-1 h-4 w-px bg-border"
              />
            );
          }

          const { icon: Icon, label, action, isActive, disabled } = tool as {
            icon: typeof Bold;
            label: string;
            action: () => void;
            isActive: boolean;
            disabled?: boolean;
            shortcut?: string;
          };

          return (
            <Button
              key={label}
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 w-8 rounded-full p-0 transition-all',
                isActive
                  ? 'bg-foreground text-background hover:bg-foreground/90'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              onClick={action}
              disabled={disabled}
              title={label}
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
});
