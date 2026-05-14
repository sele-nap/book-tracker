import { Book } from '../models/Book.js';

export const bookService = {
  async getPaginated(page: number, limit: number, q?: string) {
    const filter = q ? { $text: { $search: q } } : {};
    const skip = (page - 1) * limit;
    const [books, total] = await Promise.all([
      Book.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Book.countDocuments(filter),
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
