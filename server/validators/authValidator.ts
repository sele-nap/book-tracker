import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateMeSchema = z.object({
  email: z.string().email().optional(),
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128).optional(),
});

export const deleteMeSchema = z.object({
  currentPassword: z.string().min(1),
});
