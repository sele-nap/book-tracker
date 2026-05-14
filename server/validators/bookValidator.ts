import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().min(1).max(300),
  author: z.string().min(1).max(200),
  genre: z.array(z.string().min(1)).default([]),
  language: z.enum(['vo', 'vf', 'other']).optional(),
  pages: z.number().int().positive().optional(),
  isbn: z.string().optional(),
  coverUrl: z.string().url().optional().or(z.literal('')),
  publishedYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear() + 1)
    .optional(),
});

export const updateBookSchema = createBookSchema.partial();
