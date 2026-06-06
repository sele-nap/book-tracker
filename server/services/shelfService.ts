import type { Types } from 'mongoose';
import { Book } from '../models/Book.js';
import { Shelf } from '../models/Shelf.js';

export const shelfService = {
  async getAll(userId: Types.ObjectId) {
    return Shelf.find({ userId }).populate('books');
  },

  async create(userId: Types.ObjectId, data: Record<string, unknown>) {
    return Shelf.create({ ...data, userId });
  },

  async addBook(userId: Types.ObjectId, id: string, bookId: string) {
    const book = await Book.findOne({ _id: bookId, userId });
    if (!book) return null;
    return Shelf.findOneAndUpdate(
      { _id: id, userId },
      { $addToSet: { books: bookId } },
      { new: true },
    ).populate('books');
  },

  async removeBook(userId: Types.ObjectId, id: string, bookId: string) {
    return Shelf.findOneAndUpdate(
      { _id: id, userId },
      { $pull: { books: bookId } },
      { new: true },
    ).populate('books');
  },

  async delete(userId: Types.ObjectId, id: string) {
    return Shelf.findOneAndDelete({ _id: id, userId });
  },
};
