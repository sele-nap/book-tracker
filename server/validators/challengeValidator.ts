import { z } from 'zod';

export const createChallengeSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  goalBooks: z.number().int().min(1).max(9999),
  targetGenres: z.array(z.string().min(1)).optional(),
});
