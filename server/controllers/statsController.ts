import { statsService } from '../services/statsService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const globalStats = asyncHandler(async (_req, res) => {
  res.json(await statsService.global());
});

export const readsByMonth = asyncHandler(async (req, res) => {
  const year = parseInt(req.query.year as string) || new Date().getFullYear();
  res.json(await statsService.byMonth(year));
});

export const readsByGenre = asyncHandler(async (_req, res) => {
  res.json(await statsService.byGenre());
});

export const avgRatingByGenre = asyncHandler(async (_req, res) => {
  res.json(await statsService.ratingsByGenre());
});

export const streak = asyncHandler(async (_req, res) => {
  res.json(await statsService.streak());
});
