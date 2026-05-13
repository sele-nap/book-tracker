import { Book } from '../models/Book.js';

export const bookService = {
  async getPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [books, total] = await Promise.all([
      Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Book.countDocuments(),
    ]);
    return { books, total, page, pages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    return Book.findById(id);
  },

  async create(data: Record<string, unknown>) {
    return Book.create(data);
  },

  async update(id: string, data: Record<string, unknown>) {
    return Book.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async delete(id: string) {
    return Book.findByIdAndDelete(id);
  },

  async search(q: string) {
    return Book.find({ $text: { $search: q } });
  },
};
