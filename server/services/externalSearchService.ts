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

type OLResult = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
  cover_i?: number;
  language?: string[];
};

type OLResponse = { docs: OLResult[] };

type GBVolumeInfo = {
  title: string;
  authors?: string[];
  publishedDate?: string;
  pageCount?: number;
  language?: string;
  imageLinks?: { thumbnail?: string };
};

type GBItem = { id: string; volumeInfo: GBVolumeInfo };
type GBResponse = { items?: GBItem[] };

function detectLanguage(languages?: string[]): 'vo' | 'vf' | undefined {
  if (!languages?.length) return undefined;
  return languages.includes('fre') ? 'vf' : 'vo';
}

function getCoverUrl(coverId: number): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}

async function searchOpenLibrary(query: string): Promise<BookSearchResult[]> {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8&fields=key,title,author_name,first_publish_year,number_of_pages_median,cover_i,language`;
  const res = await fetch(url);
  const data = (await res.json()) as OLResponse;
  return data.docs.map((r) => ({
    key: r.key,
    title: r.title,
    author: r.author_name?.[0],
    year: r.first_publish_year,
    pages: r.number_of_pages_median,
    coverUrl: r.cover_i ? getCoverUrl(r.cover_i) : undefined,
    language: detectLanguage(r.language),
    source: 'ol' as const,
  }));
}

async function searchGoogleBooks(query: string): Promise<BookSearchResult[]> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=8&langRestrict=fr`;
  const res = await fetch(url);
  const data = (await res.json()) as GBResponse;
  return (data.items ?? []).map((item) => ({
    key: `gb-${item.id}`,
    title: item.volumeInfo.title,
    author: item.volumeInfo.authors?.[0],
    year: item.volumeInfo.publishedDate
      ? parseInt(item.volumeInfo.publishedDate)
      : undefined,
    pages: item.volumeInfo.pageCount,
    coverUrl: item.volumeInfo.imageLinks?.thumbnail
      ?.replace('http://', 'https://')
      .replace('&edge=curl', ''),
    language: item.volumeInfo.language === 'fr' ? 'vf' : 'vo',
    source: 'gb' as const,
  }));
}

export async function searchExternalBooks(
  query: string,
): Promise<BookSearchResult[]> {
  const [olRaw, gbRaw] = await Promise.allSettled([
    searchOpenLibrary(query),
    searchGoogleBooks(query),
  ]);

  const olResults = olRaw.status === 'fulfilled' ? olRaw.value : [];
  const gbResults = gbRaw.status === 'fulfilled' ? gbRaw.value : [];

  const seen = new Set<string>();
  const merged: BookSearchResult[] = [];
  for (const r of [...olResults, ...gbResults]) {
    const key = `${r.title.toLowerCase()}|${(r.author ?? '').toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(r);
    }
  }

  return merged.slice(0, 10);
}
