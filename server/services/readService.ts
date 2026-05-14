import type { ReadStatus } from '../models/Read.js';
import { Read } from '../models/Read.js';

export const readService = {
  async getAll() {
    return Read.find().populate('book').sort({ createdAt: -1 });
  },

  async getByStatus(status: ReadStatus) {
    return Read.find({ status }).populate('book');
  },

  async getByBook(bookId: string) {
    return Read.findOne({ book: bookId }).populate('book');
  },

  async create(data: Record<string, unknown>) {
    if (data.status === 'finished' && !data.finishedAt)
      data.finishedAt = new Date();
    if (data.status === 'reading' && !data.startedAt)
      data.startedAt = new Date();
    return Read.create(data);
  },

  async update(id: string, data: Record<string, unknown>) {
    if (data.status === 'finished' && !data.finishedAt)
      data.finishedAt = new Date();
    if (data.status === 'reading' && !data.startedAt)
      data.startedAt = new Date();
    return Read.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async delete(id: string) {
    return Read.findByIdAndDelete(id);
  },

  async getTimeline() {
    return Read.find({ status: 'finished', finishedAt: { $exists: true } })
      .populate('book')
      .sort({ finishedAt: -1 });
  },
};
