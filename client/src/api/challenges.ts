import { api } from './client';
import type { Book } from './books';

export type Challenge = {
  _id: string;
  year: number;
  goalBooks: number;
  targetGenres: string[];
  books: Book[];
  expiresAt: string;
};

export type ChallengeProgress = {
  year: number;
  goal: number;
  current: number;
  percentage: number;
  targetGenres: string[];
};

export const challengesApi = {
  getAll:      ()                              => api.get<Challenge[]>('/challenges'),
  create:      (body: { year: number; goalBooks: number; targetGenres?: string[] }) => api.post<Challenge>('/challenges', body),
  addBook:     (id: string, bookId: string)    => api.patch<Challenge>(`/challenges/${id}/books/${bookId}`, {}),
  getProgress: (id: string)                    => api.get<ChallengeProgress>(`/challenges/${id}/progress`),
};
