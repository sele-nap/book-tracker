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

const FETCH_TIMEOUT_MS = 5_000;
const CACHE_TTL_MS = 5 * 60 * 1_000;

const cache = new Map<
  string,
  { results: BookSearchResult[]; expiresAt: number }
>();

function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(url, { signal: controller.signal }).finally(() =>
    clearTimeout(timer),
  );
}

function settled<T>(result: PromiseSettledResult<T[]>, label: string): T[] {
  if (result.status === 'rejected') {
    console.warn(`⚠️  ${label} search failed:`, result.reason);
    return [];
  }
  return result.value;
}

function deduplicate(results: BookSearchResult[]): BookSearchResult[] {
  const seen = new Set<string>();
  return results.filter((r) => {
    const key = `${r.title.toLowerCase()}|${(r.author ?? '').toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function detectLanguage(languages?: string[]): 'vo' | 'vf' | undefined {
  if (!languages?.length) return undefined;
  return languages.includes('fre') ? 'vf' : 'vo';
}

async function searchOpenLibrary(query: string): Promise<BookSearchResult[]> {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8&fields=key,title,author_name,first_publish_year,number_of_pages_median,cover_i,language`;
  const res = await fetchWithTimeout(url);
  const data = (await res.json()) as OLResponse;
  return data.docs.map((r) => ({
    key: r.key,
    title: r.title,
    author: r.author_name?.[0],
    year: r.first_publish_year,
    pages: r.number_of_pages_median,
    coverUrl: r.cover_i
      ? `https://covers.openlibrary.org/b/id/${r.cover_i}-M.jpg`
      : undefined,
    language: detectLanguage(r.language),
    source: 'ol' as const,
  }));
}

async function searchGoogleBooks(query: string): Promise<BookSearchResult[]> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=8&langRestrict=fr`;
  const res = await fetchWithTimeout(url);
  const data = (await res.json()) as GBResponse;
  return (data.items ?? []).map((item) => ({
    key: `gb-${item.id}`,
    title: item.volumeInfo.title,
    author: item.volumeInfo.authors?.[0],
    year: item.volumeInfo.publishedDate
      ? parseInt(item.volumeInfo.publishedDate, 10)
      : undefined,
    pages: item.volumeInfo.pageCount,
    coverUrl: item.volumeInfo.imageLinks?.thumbnail
      ?.replace('http://', 'https://')
      .replace('&edge=curl', ''),
    language:
      item.volumeInfo.language === 'fr'
        ? 'vf'
        : item.volumeInfo.language
          ? 'vo'
          : undefined,
    source: 'gb' as const,
  }));
}

export async function searchExternalBooks(
  query: string,
): Promise<BookSearchResult[]> {
  const cacheKey = query.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.results;

  const [olRaw, gbRaw] = await Promise.allSettled([
    searchOpenLibrary(query),
    searchGoogleBooks(query),
  ]);

  const results = deduplicate([
    ...settled(olRaw, 'OpenLibrary'),
    ...settled(gbRaw, 'Google Books'),
  ]).slice(0, 10);

  if (cache.size > 500) cache.clear();
  cache.set(cacheKey, { results, expiresAt: Date.now() + CACHE_TTL_MS });
  return results;
}
