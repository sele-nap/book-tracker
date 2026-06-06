import { api } from './client';

export type BookLanguage = 'vo' | 'vf' | 'other';

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

export type BooksPage = {
  books: Book[];
  total: number;
  page: number;
  pages: number;
};

export { readsApi, type Read, type ReadStatus } from './reads';

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
