import { type FormEvent, useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { Plus } from 'lucide-react';

import { useNotesStore } from '@/stores';

import { Button } from '../ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/Dialog';
import { Input } from '../ui/Input';

/**
 * Dialog for creating a new note
 * Navigates to the editor after creation
 */
export function CreateNoteDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const createNote = useNotesStore((state) => state.createNote);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Title is required');
      return;
    }

    if (trimmedTitle.length > 200) {
      setError('Title must be less than 200 characters');
      return;
    }

    // Create note and navigate to editor
    const newNote = createNote({ title: trimmedTitle, content: '' });
    setOpen(false);
    setTitle('');
    setError('');

    navigate({ to: '/notes/$noteId', params: { noteId: newNote.id } });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form on close
      setTitle('');
      setError('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>
              Give your note a title. You can edit the content after creation.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              aria-invalid={!!error}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-[var(--destructive)]">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
