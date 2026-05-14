import { api } from './client';

export type BookSearchResult = {
  key: string;
  title: string;
  author?: string;
  year?: number;
  pages?: number;
  coverUrl?: string;
  language?: 'vo' | 'vf';
  source: 'ol' | 'gb';
};

export async function searchBooks(query: string): Promise<BookSearchResult[]> {
  if (!query.trim()) return [];
  return api.get<BookSearchResult[]>(
    `/search?q=${encodeURIComponent(query.trim())}`,
  );
}
