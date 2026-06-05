import type { Types } from 'mongoose';
import { Book } from '../models/Book.js';

export const bookService = {
  async getPaginated(
    userId: Types.ObjectId,
    page: number,
    limit: number,
    q?: string,
  ) {
    const filter = q ? { userId, $text: { $search: q } } : { userId };
    const skip = (page - 1) * limit;
    const [books, total] = await Promise.all([
      Book.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Book.countDocuments(filter),
    ]);
    return { books, total, page, pages: Math.ceil(total / limit) };
  },

  async getById(userId: Types.ObjectId, id: string) {
    return Book.findOne({ _id: id, userId });
  },

  async create(userId: Types.ObjectId, data: Record<string, unknown>) {
    return Book.create({ ...data, userId });
  },

  async update(
    userId: Types.ObjectId,
    id: string,
    data: Record<string, unknown>,
  ) {
    return Book.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
      runValidators: true,
    });
  },

  async delete(userId: Types.ObjectId, id: string) {
    return Book.findOneAndDelete({ _id: id, userId });
  },

  async search(userId: Types.ObjectId, q: string) {
    return Book.find({ userId, $text: { $search: q } });
  },
};
