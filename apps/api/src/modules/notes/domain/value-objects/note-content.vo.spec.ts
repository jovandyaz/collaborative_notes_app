import { describe, expect, it } from 'vitest';

import { NoteContent } from './note-content.vo';

describe('NoteContent', () => {
  it('should create valid content', () => {
    const content = 'Some content';
    const result = NoteContent.create(content);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.value).toBe(content);
    }
  });

  it('should accept empty content', () => {
    const content = '';
    const result = NoteContent.create(content);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.value).toBe(content);
    }
  });

  // Since typescript prevents passing null/undefined if strict null checks are on,
  // we might force cast to test runtime check if we want, or skip it.
  // Given the VO checks for null/undefined explicitly:
  it('should fail if content is null or undefined (runtime check)', () => {
    // @ts-expect-error - testing invalid input
    const resultUndef = NoteContent.create(undefined);
    expect(resultUndef.isErr()).toBe(true);

    // @ts-expect-error - testing invalid input
    const resultNull = NoteContent.create(null);
    expect(resultNull.isErr()).toBe(true);
  });
});
