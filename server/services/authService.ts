import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: COOKIE_MAX_AGE,
  path: '/api',
};

export const authService = {
  async register(email: string, password: string) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw Object.assign(new Error('Email already in use'), {
        status: 409,
        code: 'EMAIL_TAKEN',
      });
    }
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hash });
    return user;
  },

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), {
        status: 401,
        code: 'INVALID_CREDENTIALS',
      });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw Object.assign(new Error('Invalid credentials'), {
        status: 401,
        code: 'INVALID_CREDENTIALS',
      });
    }
    return user;
  },

  async updateMe(
    userId: string,
    currentPassword: string,
    email?: string,
    newPassword?: string,
  ) {
    const user = await User.findById(userId);
    if (!user)
      throw Object.assign(new Error('User not found'), {
        status: 404,
        code: 'NOT_FOUND',
      });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid)
      throw Object.assign(new Error('Invalid password'), {
        status: 401,
        code: 'INVALID_PASSWORD',
      });

    if (email && email !== user.email) {
      const taken = await User.findOne({ email });
      if (taken)
        throw Object.assign(new Error('Email already in use'), {
          status: 409,
          code: 'EMAIL_TAKEN',
        });
      user.email = email;
    }

    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();
    return user;
  },

  async deleteAccount(userId: string, currentPassword: string) {
    const user = await User.findById(userId);
    if (!user)
      throw Object.assign(new Error('User not found'), {
        status: 404,
        code: 'NOT_FOUND',
      });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid)
      throw Object.assign(new Error('Invalid password'), {
        status: 401,
        code: 'INVALID_PASSWORD',
      });

    await User.findByIdAndDelete(userId);
  },

  signToken(userId: string) {
    return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '30d' });
  },
};
