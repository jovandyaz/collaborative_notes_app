import { describe, expect, it } from 'vitest';

import { NoteTitle } from './note-title.vo';

describe('NoteTitle', () => {
  it('should create a valid title', () => {
    const title = 'My Note';
    const result = NoteTitle.create(title);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.value).toBe(title);
    }
  });

  it('should fail if title is empty', () => {
    const result = NoteTitle.create('');
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toBe('Invalid title: Title cannot be empty');
    }
  });

  it('should fail if title is only whitespace', () => {
    const result = NoteTitle.create('   ');
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toBe('Invalid title: Title cannot be empty');
    }
  });

  it('should fail if title exceeds 200 characters', () => {
    const longTitle = 'a'.repeat(201);
    const result = NoteTitle.create(longTitle);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toBe(
        'Invalid title: Title cannot exceed 200 characters'
      );
    }
  });

  it('should create a title with exactly 200 characters', () => {
    const longTitle = 'a'.repeat(200);
    const result = NoteTitle.create(longTitle);
    expect(result.isOk()).toBe(true);
  });
});
