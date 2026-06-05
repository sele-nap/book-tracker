import { statsService } from '../services/statsService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const globalStats = asyncHandler(async (req, res) => {
  res.json(await statsService.global(req.userId));
});

export const readsByMonth = asyncHandler(async (req, res) => {
  const year = parseInt(req.query.year as string) || new Date().getFullYear();
  res.json(await statsService.byMonth(req.userId, year));
});

export const readsByGenre = asyncHandler(async (req, res) => {
  res.json(await statsService.byGenre(req.userId));
});

export const avgRatingByGenre = asyncHandler(async (req, res) => {
  res.json(await statsService.ratingsByGenre(req.userId));
});

export const streak = asyncHandler(async (req, res) => {
  res.json(await statsService.streak(req.userId));
});
