import { challengeService } from '../services/challengeService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getChallenges = asyncHandler(async (_req, res) => {
  res.json(await challengeService.getAll());
});

export const createChallenge = asyncHandler(async (req, res) => {
  res.status(201).json(await challengeService.create(req.body));
});

export const addBookToChallenge = asyncHandler(async (req, res) => {
  const challenge = await challengeService.addBook(
    String(req.params.id),
    String(req.params.bookId),
  );
  if (!challenge) {
    res.status(404).json({ message: 'Challenge not found' });
    return;
  }
  res.json(challenge);
});

export const getChallengeProgress = asyncHandler(async (req, res) => {
  const challenge = await challengeService.getById(String(req.params.id));
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
