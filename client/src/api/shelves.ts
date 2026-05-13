import type { Book } from './books';
import { api } from './client';

export type Shelf = {
  _id: string;
  name: string;
  description?: string;
  books: Book[];
  createdAt: string;
};

export const shelvesApi = {
  getAll: () => api.get<Shelf[]>('/shelves'),
  create: (body: Partial<Shelf>) => api.post<Shelf>('/shelves', body),
  addBook: (id: string, bookId: string) =>
    api.patch<Shelf>(`/shelves/${id}/books/${bookId}`, {}),
  removeBook: (id: string, bookId: string) =>
    api.delete<Shelf>(`/shelves/${id}/books/${bookId}`),
  delete: (id: string) => api.delete<void>(`/shelves/${id}`),
};
