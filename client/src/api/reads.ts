import { api } from './client';

export type ReadStatus = 'reading' | 'finished' | 'dropped' | 'wishlist';

export type Read = {
  _id: string;
  book: import('./books').Book;
  status: ReadStatus;
  startedAt?: string;
  finishedAt?: string;
  currentPage?: number;
  rating?: number;
  review?: string;
};

export const readsApi = {
  getAll: () => api.get<Read[]>('/reads'),
  timeline: () => api.get<Read[]>('/reads/timeline'),
  byStatus: (status: ReadStatus) => api.get<Read[]>(`/reads/status/${status}`),
  byBook: (bookId: string) => api.get<Read>(`/reads/book/${bookId}`),
  create: (body: Omit<Partial<Read>, 'book'> & { book: string }) =>
    api.post<Read>('/reads', body),
  update: (id: string, body: Partial<Read>) =>
    api.patch<Read>(`/reads/${id}`, body),
  delete: (id: string) => api.delete<void>(`/reads/${id}`),
};
