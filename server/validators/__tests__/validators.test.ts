import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from '../authValidator.js';
import { createBookSchema, updateBookSchema } from '../bookValidator.js';
import { createReadSchema } from '../readValidator.js';

describe('bookValidator', () => {
  it('accepts a valid book', () => {
    const result = createBookSchema.safeParse({
      title: 'Dune',
      author: 'Frank Herbert',
      genre: ['sci-fi'],
      pages: 412,
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing title', () => {
    const result = createBookSchema.safeParse({
      author: 'Frank Herbert',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing author', () => {
    const result = createBookSchema.safeParse({
      title: 'Dune',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid coverUrl', () => {
    const result = createBookSchema.safeParse({
      title: 'Dune',
      author: 'Frank Herbert',
      coverUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('accepts empty string coverUrl', () => {
    const result = createBookSchema.safeParse({
      title: 'Dune',
      author: 'Frank Herbert',
      coverUrl: '',
    });
    expect(result.success).toBe(true);
  });

  it('defaults genre to empty array', () => {
    const result = createBookSchema.safeParse({
      title: 'Dune',
      author: 'Frank Herbert',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.genre).toEqual([]);
    }
  });

  it('updateBookSchema makes all fields optional', () => {
    const result = updateBookSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe('authValidator', () => {
  it('accepts valid registration', () => {
    const result = registerSchema.safeParse({
      email: 'user@test.com',
      password: 'securepass',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short password on register', () => {
    const result = registerSchema.safeParse({
      email: 'user@test.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({
      email: 'not-an-email',
      password: 'securepass',
    });
    expect(result.success).toBe(false);
  });

  it('loginSchema accepts any non-empty password', () => {
    const result = loginSchema.safeParse({
      email: 'user@test.com',
      password: 'x',
    });
    expect(result.success).toBe(true);
  });
});

describe('readValidator', () => {
  it('accepts a valid read', () => {
    const result = createReadSchema.safeParse({
      book: '507f1f77bcf86cd799439011',
      status: 'reading',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid status', () => {
    const result = createReadSchema.safeParse({
      book: '507f1f77bcf86cd799439011',
      status: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('rejects rating out of range', () => {
    const result = createReadSchema.safeParse({
      book: '507f1f77bcf86cd799439011',
      status: 'finished',
      rating: 6,
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid rating', () => {
    const result = createReadSchema.safeParse({
      book: '507f1f77bcf86cd799439011',
      status: 'finished',
      rating: 4,
    });
    expect(result.success).toBe(true);
  });
});
