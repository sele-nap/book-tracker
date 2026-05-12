import { Read } from '../models/Read.js';
import asyncHandler from '../utils/asyncHandler.js';

export const readsByMonth = asyncHandler(async (req, res) => {
  const year = parseInt(req.query.year as string) || new Date().getFullYear();

  const result = await Read.aggregate([
    {
      $match: {
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

  res.json(result);
});

export const readsByGenre = asyncHandler(async (_req, res) => {
  const result = await Read.aggregate([
    { $match: { status: 'finished' } },
    { $lookup: { from: 'books', localField: 'book', foreignField: '_id', as: 'bookData' } },
    { $unwind: '$bookData' },
    { $unwind: '$bookData.genre' },
    { $group: { _id: '$bookData.genre', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, genre: '$_id', count: 1 } },
  ]);

  res.json(result);
});

export const avgRatingByGenre = asyncHandler(async (_req, res) => {
  const result = await Read.aggregate([
    { $match: { status: 'finished', rating: { $exists: true } } },
    { $lookup: { from: 'books', localField: 'book', foreignField: '_id', as: 'bookData' } },
    { $unwind: '$bookData' },
    { $unwind: '$bookData.genre' },
    { $group: { _id: '$bookData.genre', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    { $sort: { avgRating: -1 } },
    { $project: { _id: 0, genre: '$_id', avgRating: { $round: ['$avgRating', 2] }, count: 1 } },
  ]);

  res.json(result);
});

export const globalStats = asyncHandler(async (_req, res) => {
  const result = await Read.aggregate([
    {
      $facet: {
        byStatus: [
          { $group: { _id: '$status', count: { $sum: 1 } } },
          { $project: { _id: 0, status: '$_id', count: 1 } },
        ],
        finished: [
          { $match: { status: 'finished', rating: { $exists: true } } },
          { $group: { _id: null, totalBooks: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
          { $project: { _id: 0, totalBooks: 1, avgRating: { $round: ['$avgRating', 2] } } },
        ],
      },
    },
  ]);

  res.json(result[0]);
});
