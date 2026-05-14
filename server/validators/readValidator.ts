import { z } from 'zod';

export const createReadSchema = z.object({
  book: z.string().min(1),
  status: z.enum(['reading', 'finished', 'dropped', 'wishlist']),
  startedAt: z.string().datetime().optional(),
  finishedAt: z.string().datetime().optional(),
  currentPage: z.number().int().min(0).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  review: z.string().max(5000).optional(),
});

export const updateReadSchema = createReadSchema.omit({ book: true }).partial();
