import { Challenge } from '../models/Challenge.js';

export const challengeService = {
  async getAll() {
    return Challenge.find().populate('books');
  },

  async create(data: {
    year: number;
    goalBooks: number;
    targetGenres?: string[];
  }) {
    return Challenge.create({
      ...data,
      expiresAt: new Date(data.year + 1, 0, 1),
    });
  },

  async getById(id: string) {
    return Challenge.findById(id).populate('books');
  },

  async addBook(id: string, bookId: string) {
    return Challenge.findByIdAndUpdate(
      id,
      { $addToSet: { books: bookId } },
      { new: true },
    ).populate('books');
  },
};
