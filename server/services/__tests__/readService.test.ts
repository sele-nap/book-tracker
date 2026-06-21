import { Types } from 'mongoose';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../models/Read.js', () => ({
  Read: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create: vi.fn(async (data: any) => data),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findOneAndUpdate: vi.fn(async (_f: any, data: any) => data),
  },
}));

import { readService } from '../readService.js';

const userId = new Types.ObjectId();

beforeEach(() => {
  vi.clearAllMocks();
});

describe('readService.create', () => {
  it('auto-sets finishedAt when status is finished', async () => {
    const before = Date.now();
    const result = await readService.create(userId, {
      book: 'bookid',
      status: 'finished',
    });

    expect(result).toHaveProperty('finishedAt');
    const ts = (result as any).finishedAt as Date;
    expect(ts.getTime()).toBeGreaterThanOrEqual(before);
  });

  it('auto-sets startedAt when status is reading', async () => {
    const before = Date.now();
    const result = await readService.create(userId, {
      book: 'bookid',
      status: 'reading',
    });

    expect(result).toHaveProperty('startedAt');
    const ts = (result as any).startedAt as Date;
    expect(ts.getTime()).toBeGreaterThanOrEqual(before);
  });

  it('does not override an explicit finishedAt', async () => {
    const explicit = new Date('2024-06-01');
    const result = await readService.create(userId, {
      book: 'bookid',
      status: 'finished',
      finishedAt: explicit,
    });

    expect((result as any).finishedAt).toBe(explicit);
  });

  it('does not set dates for wishlist status', async () => {
    const result = await readService.create(userId, {
      book: 'bookid',
      status: 'wishlist',
    });

    expect(result).not.toHaveProperty('finishedAt');
    expect(result).not.toHaveProperty('startedAt');
  });
});

describe('readService.update', () => {
  it('auto-sets finishedAt when updating status to finished', async () => {
    const before = Date.now();
    const result = await readService.update(userId, 'readid', {
      status: 'finished',
    });

    const ts = (result as any).finishedAt as Date;
    expect(ts.getTime()).toBeGreaterThanOrEqual(before);
  });
});
