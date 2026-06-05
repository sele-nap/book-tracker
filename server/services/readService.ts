import type { Types } from 'mongoose';
import type { ReadStatus } from '../models/Read.js';
import { Read } from '../models/Read.js';

export const readService = {
  async getAll(userId: Types.ObjectId) {
    return Read.find({ userId }).populate('book').sort({ createdAt: -1 });
  },

  async getByStatus(userId: Types.ObjectId, status: ReadStatus) {
    return Read.find({ userId, status }).populate('book');
  },

  async getByBook(userId: Types.ObjectId, bookId: string) {
    return Read.findOne({ userId, book: bookId }).populate('book');
  },

  async create(userId: Types.ObjectId, data: Record<string, unknown>) {
    if (data.status === 'finished' && !data.finishedAt)
      data.finishedAt = new Date();
    if (data.status === 'reading' && !data.startedAt)
      data.startedAt = new Date();
    return Read.create({ ...data, userId });
  },

  async update(
    userId: Types.ObjectId,
    id: string,
    data: Record<string, unknown>,
  ) {
    if (data.status === 'finished' && !data.finishedAt)
      data.finishedAt = new Date();
    if (data.status === 'reading' && !data.startedAt)
      data.startedAt = new Date();
    return Read.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
      runValidators: true,
    });
  },

  async delete(userId: Types.ObjectId, id: string) {
    return Read.findOneAndDelete({ _id: id, userId });
  },

  async getTimeline(userId: Types.ObjectId) {
    return Read.find({
      userId,
      status: 'finished',
      finishedAt: { $exists: true },
    })
      .populate('book')
      .sort({ finishedAt: -1 });
  },
};
