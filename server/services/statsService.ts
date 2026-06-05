import { Types } from 'mongoose';
import { Read } from '../models/Read.js';

export const statsService = {
  async global(userId: Types.ObjectId) {
    const result = await Read.aggregate([
      { $match: { userId } },
      {
        $facet: {
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $project: { _id: 0, status: '$_id', count: 1 } },
          ],
          finished: [
            { $match: { status: 'finished', rating: { $exists: true } } },
            {
              $group: {
                _id: null,
                totalBooks: { $sum: 1 },
                avgRating: { $avg: '$rating' },
              },
            },
            {
              $project: {
                _id: 0,
                totalBooks: 1,
                avgRating: { $round: ['$avgRating', 2] },
              },
            },
          ],
          totalPages: [
            { $match: { status: 'finished' } },
            {
              $lookup: {
                from: 'books',
                localField: 'book',
                foreignField: '_id',
                as: 'bookData',
              },
            },
            {
              $unwind: { path: '$bookData', preserveNullAndEmptyArrays: true },
            },
            {
              $group: {
                _id: null,
                total: { $sum: { $ifNull: ['$bookData.pages', 0] } },
              },
            },
            { $project: { _id: 0, total: 1 } },
          ],
        },
      },
    ]);
    return result[0];
  },

  async byMonth(userId: Types.ObjectId, year: number) {
    return Read.aggregate([
      {
        $match: {
          userId,
          status: 'finished',
          finishedAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      { $group: { _id: { $month: '$finishedAt' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, month: '$_id', count: 1 } },
    ]);
  },

  async byGenre(userId: Types.ObjectId) {
    return Read.aggregate([
      { $match: { userId, status: 'finished' } },
      {
        $lookup: {
          from: 'books',
          localField: 'book',
          foreignField: '_id',
          as: 'bookData',
        },
      },
      { $unwind: '$bookData' },
      { $unwind: '$bookData.genre' },
      { $group: { _id: '$bookData.genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, genre: '$_id', count: 1 } },
    ]);
  },

  async ratingsByGenre(userId: Types.ObjectId) {
    return Read.aggregate([
      { $match: { userId, status: 'finished', rating: { $exists: true } } },
      {
        $lookup: {
          from: 'books',
          localField: 'book',
          foreignField: '_id',
          as: 'bookData',
        },
      },
      { $unwind: '$bookData' },
      { $unwind: '$bookData.genre' },
      {
        $group: {
          _id: '$bookData.genre',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
      { $sort: { avgRating: -1 } },
      {
        $project: {
          _id: 0,
          genre: '$_id',
          avgRating: { $round: ['$avgRating', 2] },
          count: 1,
        },
      },
    ]);
  },

  async streak(userId: Types.ObjectId) {
    const oneYearAgo = new Date(Date.now() - 365 * 86400000);
    const reads = await Read.find({
      userId,
      status: 'finished',
      finishedAt: { $exists: true, $gte: oneYearAgo },
    })
      .select('finishedAt')
      .sort({ finishedAt: -1 });

    const days = Array.from(
      new Set(reads.map((r) => r.finishedAt!.toISOString().split('T')[0])),
    )
      .sort()
      .reverse();

    if (!days.length) return { streak: 0 };

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split('T')[0];

    if (days[0] !== today && days[0] !== yesterday) return { streak: 0 };

    let count = 0;
    let cursor = days[0] === today ? today : yesterday;
    for (const day of days) {
      if (day !== cursor) break;
      count++;
      cursor = new Date(new Date(cursor).getTime() - 86400000)
        .toISOString()
        .split('T')[0];
    }

    return { streak: count };
  },
};
