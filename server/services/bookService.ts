import type { Types } from 'mongoose';
import { Book } from '../models/Book.js';
import { Read } from '../models/Read.js';

export const bookService = {
  async getPaginated(
    userId: Types.ObjectId,
    page: number,
    limit: number,
    q?: string,
  ) {
    const filter = q
      ? {
          userId,
          $or: [
            {
              title: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
            },
            {
              author: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
            },
          ],
        }
      : { userId };
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
    const book = await Book.findOneAndDelete({ _id: id, userId });
    if (book) await Read.deleteMany({ userId, book: book._id });
    return book;
  },

  async search(userId: Types.ObjectId, q: string) {
    const pattern = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return Book.find({
      userId,
      $or: [{ title: pattern }, { author: pattern }],
    });
  },
};
