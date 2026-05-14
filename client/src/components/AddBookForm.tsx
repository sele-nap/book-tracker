import { useEffect, useRef, useState } from 'react';
import type { BookLanguage, ReadStatus } from '../api/books';
import { booksApi, readsApi } from '../api/books';
import type { BookSearchResult } from '../api/bookSearch';
import { searchBooks } from '../api/bookSearch';
import { useLanguage } from '../hooks/useLanguage';

type Props = { onSuccess: () => void };

const inputClass =
  'w-full bg-bark border border-mist/40 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm outline-none focus:border-mist/70 transition-colors';
const labelClass = 'block text-xs text-parchment mb-1';

const SOURCE_LABEL: Record<BookSearchResult['source'], string> = {
  ol: 'OL',
  gb: 'GB',
};
const SOURCE_CLASS: Record<BookSearchResult['source'], string> = {
  ol: 'bg-mist/30 text-parchment',
  gb: 'bg-fern/20 text-fern',
};

export default function AddBookForm({ onSuccess }: Props) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [genreInput, setGenreInput] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [fields, setFields] = useState({
    title: '',
    author: '',
    genre: [] as string[],
    language: '' as BookLanguage | '',
    pages: '',
    coverUrl: '',
    publishedYear: '',
    status: 'wishlist' as ReadStatus,
    rating: '',
  });

  const set =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  const addGenre = () => {
    const g = genreInput.trim().toLowerCase();
    if (g && !fields.genre.includes(g))
      setFields((f) => ({ ...f, genre: [...f.genre, g] }));
    setGenreInput('');
  };

  const removeGenre = (g: string) =>
    setFields((f) => ({ ...f, genre: f.genre.filter((x) => x !== g) }));

  const handleSearch = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const results = await searchBooks(q);
      setResults(results);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(query), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const fillFrom = (result: BookSearchResult) => {
    setFields((f) => ({
      ...f,
      title: result.title,
      author: result.author ?? f.author,
      pages: result.pages ? String(result.pages) : f.pages,
      publishedYear: result.year ? String(result.year) : f.publishedYear,
      coverUrl: result.coverUrl ?? f.coverUrl,
      language: result.language ?? f.language,
    }));
    setResults([]);
    setQuery('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.title || !fields.author) return;
    setLoading(true);
    try {
      const book = await booksApi.create({
        title: fields.title,
        author: fields.author,
        genre: fields.genre,
        language: fields.language || undefined,
        pages: fields.pages ? parseInt(fields.pages) : undefined,
        coverUrl: fields.coverUrl || undefined,
        publishedYear: fields.publishedYear
          ? parseInt(fields.publishedYear)
          : undefined,
      });
      await readsApi.create({
        book: book._id as never,
        status: fields.status,
        rating: fields.rating ? parseInt(fields.rating) : undefined,
      });
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-1"
    >
      <div>
        <label htmlFor="add-book-search" className={labelClass}>
          {t.form.search}
        </label>
        <div className="relative">
          <input
            id="add-book-search"
            className={inputClass}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
            placeholder="The Name of the Wind…"
          />
          {searching && (
            <span
              aria-hidden="true"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone text-xs"
            >
              ✦
            </span>
          )}
        </div>

        {results.length > 0 && (
          <div className="mt-2 border border-mist/20 rounded-lg overflow-hidden divide-y divide-mist/10">
            {results.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => fillFrom(r)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-bark/60 transition-colors text-left"
              >
                {r.coverUrl ? (
                  <img
                    src={r.coverUrl}
                    alt=""
                    className="w-8 h-11 object-cover rounded shrink-0"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="w-8 h-11 bg-bark rounded shrink-0 flex items-center justify-center text-xs opacity-30"
                  >
                    📖
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-cream text-xs font-display truncate">
                    {r.title}
                  </p>
                  <p className="text-stone text-xs">
                    {r.author}
                    {r.year ? ` · ${r.year}` : ''}
                  </p>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${SOURCE_CLASS[r.source]}`}
                >
                  {SOURCE_LABEL[r.source]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-mist/20 pt-4 grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label htmlFor="add-title" className={labelClass}>
            {t.form.title} *
          </label>
          <input
            id="add-title"
            className={inputClass}
            value={fields.title}
            onChange={set('title')}
            placeholder="The Name of the Wind"
            required
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="add-author" className={labelClass}>
            {t.form.author} *
          </label>
          <input
            id="add-author"
            className={inputClass}
            value={fields.author}
            onChange={set('author')}
            placeholder="Patrick Rothfuss"
            required
          />
        </div>
        <div>
          <label htmlFor="add-pages" className={labelClass}>
            {t.form.pages}
          </label>
          <input
            id="add-pages"
            className={inputClass}
            type="number"
            min={1}
            value={fields.pages}
            onChange={set('pages')}
            placeholder="662"
          />
        </div>
        <div>
          <label htmlFor="add-year" className={labelClass}>
            {t.form.year}
          </label>
          <input
            id="add-year"
            className={inputClass}
            type="number"
            min={1}
            value={fields.publishedYear}
            onChange={set('publishedYear')}
            placeholder="2007"
          />
        </div>
      </div>

      <div>
        <label htmlFor="add-genre" className={labelClass}>
          {t.form.genre}
        </label>
        <div className="flex gap-2">
          <input
            id="add-genre"
            className={inputClass}
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addGenre();
              }
            }}
            placeholder="fantasy…"
          />
          <button
            type="button"
            onClick={addGenre}
            aria-label="Add genre"
            className="text-xs bg-bark border border-mist/40 rounded-lg px-3 text-parchment hover:text-cream transition-colors"
          >
            +
          </button>
        </div>
        {fields.genre.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {fields.genre.map((g) => (
              <span
                key={g}
                className="flex items-center gap-1 text-xs bg-mist/20 text-parchment px-2 py-0.5 rounded-full"
              >
                {g}
                <button
                  type="button"
                  onClick={() => removeGenre(g)}
                  aria-label={`Remove genre ${g}`}
                  className="text-stone hover:text-cream"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="add-language" className={labelClass}>
            {t.bookLanguage.label}
          </label>
          <select
            id="add-language"
            className={inputClass}
            value={fields.language}
            onChange={set('language')}
          >
            <option value="">—</option>
            <option value="vo">{t.bookLanguage.vo}</option>
            <option value="vf">{t.bookLanguage.vf}</option>
            <option value="other">{t.bookLanguage.other}</option>
          </select>
        </div>
        <div>
          <label htmlFor="add-status" className={labelClass}>
            {t.form.status}
          </label>
          <select
            id="add-status"
            className={inputClass}
            value={fields.status}
            onChange={set('status')}
          >
            <option value="wishlist">{t.status.wishlist}</option>
            <option value="reading">{t.status.reading}</option>
            <option value="finished">{t.status.finished}</option>
            <option value="dropped">{t.status.dropped}</option>
          </select>
        </div>
      </div>

      {fields.status === 'finished' && (
        <div>
          <label htmlFor="add-rating" className={labelClass}>
            {t.form.rating}
          </label>
          <select
            id="add-rating"
            className={inputClass}
            value={fields.rating}
            onChange={set('rating')}
          >
            <option value="">—</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {'★'.repeat(n)} — {n} star{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="add-cover" className={labelClass}>
          {t.form.cover}
        </label>
        <input
          id="add-cover"
          className={inputClass}
          value={fields.coverUrl}
          onChange={set('coverUrl')}
          placeholder="https://…"
        />
        {fields.coverUrl && (
          <img
            src={fields.coverUrl}
            alt="cover preview"
            className="mt-2 h-20 rounded object-cover"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="mt-2 bg-wine hover:bg-rose disabled:opacity-50 text-cream text-sm py-2.5 rounded-lg transition-colors font-body"
      >
        {loading ? <span aria-hidden="true">✦</span> : t.form.submit}
      </button>
    </form>
  );
}
