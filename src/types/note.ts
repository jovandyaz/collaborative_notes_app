import { z } from 'zod';

/**
 * Schema for validating Note objects
 */
export const NoteSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1).max(200),
  content: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

/**
 * Note type inferred from Zod schema
 */
export type Note = z.infer<typeof NoteSchema>;

/**
 * Schema for creating a new note (without id and timestamps)
 */
export const CreateNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().optional().default(''),
});

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;

/**
 * Schema for updating a note
 */
export const UpdateNoteSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
});

export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
