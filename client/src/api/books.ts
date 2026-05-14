import { api } from './client';

export type BookLanguage = 'vo' | 'vf' | 'other';
export type ReadStatus = 'reading' | 'finished' | 'dropped' | 'wishlist';

export type Book = {
  _id: string;
  title: string;
  author: string;
  genre: string[];
  language?: BookLanguage;
  pages?: number;
  isbn?: string;
  coverUrl?: string;
  publishedYear?: number;
  createdAt: string;
};

export type Read = {
  _id: string;
  book: Book;
  status: ReadStatus;
  startedAt?: string;
  finishedAt?: string;
  currentPage?: number;
  rating?: number;
  review?: string;
};

export type BooksPage = {
  books: Book[];
  total: number;
  page: number;
  pages: number;
};

export const booksApi = {
  getAll: (page = 1, limit = 20, q?: string) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (q) params.set('q', q);
    return api.get<BooksPage>(`/books?${params}`);
  },
  getById: (id: string) => api.get<Book>(`/books/${id}`),
  search: (q: string) =>
    api.get<Book[]>(`/books/search?q=${encodeURIComponent(q)}`),
  create: (body: Partial<Book>) => api.post<Book>('/books', body),
  update: (id: string, body: Partial<Book>) =>
    api.patch<Book>(`/books/${id}`, body),
  delete: (id: string) => api.delete<void>(`/books/${id}`),
};

export const readsApi = {
  getAll: () => api.get<Read[]>('/reads'),
  timeline: () => api.get<Read[]>('/reads/timeline'),
  byStatus: (status: ReadStatus) => api.get<Read[]>(`/reads/status/${status}`),
  byBook: (bookId: string) => api.get<Read>(`/reads/book/${bookId}`),
  create: (body: Partial<Read>) => api.post<Read>('/reads', body),
  update: (id: string, body: Partial<Read>) =>
    api.patch<Read>(`/reads/${id}`, body),
  delete: (id: string) => api.delete<void>(`/reads/${id}`),
};
