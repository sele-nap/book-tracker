import { api } from './client';

export type StatByMonth  = { month: number; count: number };
export type StatByGenre  = { genre: string; count: number };
export type StatByRating = { genre: string; avgRating: number; count: number };
export type GlobalStats  = {
  byStatus: { status: string; count: number }[];
  finished: { totalBooks: number; avgRating: number }[];
};

export const statsApi = {
  global:         ()              => api.get<GlobalStats>('/stats/global'),
  byMonth:        (year: number)  => api.get<StatByMonth[]>(`/stats/by-month?year=${year}`),
  byGenre:        ()              => api.get<StatByGenre[]>('/stats/by-genre'),
  ratingsByGenre: ()              => api.get<StatByRating[]>('/stats/ratings-by-genre'),
};
