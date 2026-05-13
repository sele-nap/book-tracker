import { Challenge } from '../models/Challenge.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getChallenges = asyncHandler(async (_req, res) => {
  const challenges = await Challenge.find().populate('books');
  res.json(challenges);
});

export const createChallenge = asyncHandler(async (req, res) => {
  const { year, goalBooks, targetGenres } = req.body as {
    year: number;
    goalBooks: number;
    targetGenres?: string[];
  };

  const expiresAt = new Date(year + 1, 0, 1);

  const challenge = await Challenge.create({
    year,
    goalBooks,
    targetGenres,
    expiresAt,
  });
  res.status(201).json(challenge);
});

export const addBookToChallenge = asyncHandler(async (req, res) => {
  const challenge = await Challenge.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { books: req.params.bookId } },
    { new: true },
  ).populate('books');
  if (!challenge) {
    res.status(404).json({ message: 'Challenge not found' });
    return;
  }
  res.json(challenge);
});

export const getChallengeProgress = asyncHandler(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id).populate('books');
  if (!challenge) {
    res.status(404).json({ message: 'Challenge not found' });
    return;
  }
  res.json({
    year: challenge.year,
    goal: challenge.goalBooks,
    current: challenge.books.length,
    percentage: Math.round(
      (challenge.books.length / challenge.goalBooks) * 100,
    ),
    targetGenres: challenge.targetGenres,
  });
});
