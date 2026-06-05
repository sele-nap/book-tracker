import type { Request, Response } from 'express';
import { User } from '../models/User.js';
import { COOKIE_OPTIONS, authService } from '../services/authService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await authService.register(email, password);
  const token = authService.signToken(String(user._id));
  res.cookie('token', token, COOKIE_OPTIONS);
  res.status(201).json({ id: user._id, email: user.email });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await authService.login(email, password);
  const token = authService.signToken(String(user._id));
  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({ id: user._id, email: user.email });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.userId).select('-password');
  if (!user) {
    res.status(401).send();
    return;
  }
  res.json({ id: user._id, email: user.email });
});

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 });
  res.status(204).send();
};

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, email, newPassword } = req.body as {
    currentPassword: string;
    email?: string;
    newPassword?: string;
  };
  const user = await authService.updateMe(
    String(req.userId),
    currentPassword,
    email,
    newPassword,
  );
  res.json({ id: user._id, email: user.email });
});

export const deleteMe = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword } = req.body as { currentPassword: string };
  await authService.deleteAccount(String(req.userId), currentPassword);
  res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 });
  res.status(204).send();
});
