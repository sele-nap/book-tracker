import type { Types } from 'mongoose';
import { Challenge } from '../models/Challenge.js';

export const challengeService = {
  async getAll(userId: Types.ObjectId) {
    return Challenge.find({ userId }).populate('books');
  },

  async create(
    userId: Types.ObjectId,
    data: { year: number; goalBooks: number; targetGenres?: string[] },
  ) {
    return Challenge.create({
      ...data,
      userId,
      expiresAt: new Date(data.year + 1, 0, 1),
    });
  },

  async getById(userId: Types.ObjectId, id: string) {
    return Challenge.findOne({ _id: id, userId }).populate('books');
  },

  async addBook(userId: Types.ObjectId, id: string, bookId: string) {
    return Challenge.findOneAndUpdate(
      { _id: id, userId },
      { $addToSet: { books: bookId } },
      { new: true },
    ).populate('books');
  },
};
