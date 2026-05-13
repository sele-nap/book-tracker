export type OLResult = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
  isbn?: string[];
  cover_i?: number;
  language?: string[];
  subject?: string[];
};

type OLResponse = { docs: OLResult[] };

export async function searchOpenLibrary(query: string): Promise<OLResult[]> {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8&fields=key,title,author_name,first_publish_year,number_of_pages_median,isbn,cover_i,language,subject`;
  const res = await fetch(url);
  const data = await res.json() as OLResponse;
  return data.docs;
}

export function getCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M') {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export function detectLanguage(languages?: string[]): 'vo' | 'vf' | undefined {
  if (!languages?.length) return undefined;
  if (languages.includes('fre')) return 'vf';
  return 'vo';
}
