import { Shelf } from '../models/Shelf.js';

export const shelfService = {
  async getAll() {
    return Shelf.find().populate('books');
  },

  async create(data: Record<string, unknown>) {
    return Shelf.create(data);
  },

  async addBook(id: string, bookId: string) {
    return Shelf.findByIdAndUpdate(
      id,
      { $addToSet: { books: bookId } },
      { new: true },
    ).populate('books');
  },

  async removeBook(id: string, bookId: string) {
    return Shelf.findByIdAndUpdate(
      id,
      { $pull: { books: bookId } },
      { new: true },
    ).populate('books');
  },

  async delete(id: string) {
    return Shelf.findByIdAndDelete(id);
  },
};
