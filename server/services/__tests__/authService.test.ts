import { beforeEach, describe, expect, it, vi } from 'vitest';

const fakeUser = {
  _id: '507f1f77bcf86cd799439011',
  email: 'test@example.com',
  password: '$2a$12$hashedpassword',
  save: vi.fn(),
};

vi.mock('../../models/User.js', () => ({
  User: {
    findOne: vi.fn(),
    findById: vi.fn(),
    findByIdAndDelete: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(async (pw: string) => `hashed_${pw}`),
    compare: vi.fn(async (pw: string, hash: string) => hash === `hashed_${pw}`),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(() => 'mock.jwt.token'),
  },
}));

import { User } from '../../models/User.js';
import { authService } from '../authService.js';

const UserMock = vi.mocked(User);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('authService.register', () => {
  it('creates a user when email is not taken', async () => {
    UserMock.findOne.mockResolvedValue(null);
    UserMock.create.mockResolvedValue(fakeUser as never);

    const result = await authService.register('new@example.com', 'password123');

    expect(UserMock.findOne).toHaveBeenCalledWith({ email: 'new@example.com' });
    expect(UserMock.create).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'hashed_password123',
    });
    expect(result).toEqual(fakeUser);
  });

  it('throws 409 when email is already taken', async () => {
    UserMock.findOne.mockResolvedValue(fakeUser as never);

    const err = await authService
      .register('test@example.com', 'pw')
      .catch((e) => e);

    expect(err.status).toBe(409);
    expect(err.code).toBe('EMAIL_TAKEN');
  });
});

describe('authService.login', () => {
  it('returns user on valid credentials', async () => {
    const user = { ...fakeUser, password: 'hashed_secret123' };
    UserMock.findOne.mockResolvedValue(user as never);

    const result = await authService.login('test@example.com', 'secret123');
    expect(result).toEqual(user);
  });

  it('throws 401 when user not found', async () => {
    UserMock.findOne.mockResolvedValue(null);

    const err = await authService
      .login('nobody@example.com', 'pw')
      .catch((e) => e);

    expect(err.status).toBe(401);
    expect(err.code).toBe('INVALID_CREDENTIALS');
  });

  it('throws 401 on wrong password', async () => {
    UserMock.findOne.mockResolvedValue(fakeUser as never);

    const err = await authService
      .login('test@example.com', 'wrongpassword')
      .catch((e) => e);

    expect(err.status).toBe(401);
    expect(err.code).toBe('INVALID_CREDENTIALS');
  });
});

describe('authService.signToken', () => {
  it('returns a JWT string', () => {
    const token = authService.signToken('user123');
    expect(token).toBe('mock.jwt.token');
  });
});
