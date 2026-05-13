import { useEffect, useRef, useState } from 'react';
import type { BookLanguage, ReadStatus } from '../api/books';
import { booksApi, readsApi } from '../api/books';
import type { OLResult } from '../api/openLibrary';
import {
  detectLanguage,
  getCoverUrl,
  searchOpenLibrary,
} from '../api/openLibrary';
import { useLanguage } from '../i18n/LanguageContext';

type Props = { onSuccess: () => void };

const inputClass =
  'w-full bg-bark border border-mist/20 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm outline-none focus:border-mist/50 transition-colors';
const labelClass = 'block text-xs text-parchment mb-1';

export default function AddBookForm({ onSuccess }: Props) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [genreInput, setGenreInput] = useState('');
  const [olQuery, setOlQuery] = useState('');
  const [olResults, setOlResults] = useState<OLResult[]>([]);
  const [olSearching, setOlSearching] = useState(false);
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

  const handleOLSearch = async (query: string) => {
    if (!query.trim()) {
      setOlResults([]);
      return;
    }
    setOlSearching(true);
    const results = await searchOpenLibrary(query);
    setOlResults(results);
    setOlSearching(false);
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleOLSearch(olQuery), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [olQuery]);

  const fillFromOL = (result: OLResult) => {
    setFields((f) => ({
      ...f,
      title: result.title,
      author: result.author_name?.[0] ?? f.author,
      pages: result.number_of_pages_median
        ? String(result.number_of_pages_median)
        : f.pages,
      publishedYear: result.first_publish_year
        ? String(result.first_publish_year)
        : f.publishedYear,
      coverUrl: result.cover_i ? getCoverUrl(result.cover_i) : f.coverUrl,
      language: detectLanguage(result.language) ?? f.language,
    }));
    setOlResults([]);
    setOlQuery('');
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
        <label className={labelClass}>{t.form.search}</label>
        <div className="relative">
          <input
            className={inputClass}
            value={olQuery}
            onChange={(e) => setOlQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
            placeholder="The Name of the Wind…"
          />
          {olSearching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone text-xs">
              ✦
            </span>
          )}
        </div>

        {olResults.length > 0 && (
          <div className="mt-2 border border-mist/20 rounded-lg overflow-hidden divide-y divide-mist/10">
            {olResults.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => fillFromOL(r)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-bark/60 transition-colors text-left"
              >
                {r.cover_i ? (
                  <img
                    src={getCoverUrl(r.cover_i, 'S')}
                    alt=""
                    className="w-8 h-11 object-cover rounded shrink-0"
                  />
                ) : (
                  <div className="w-8 h-11 bg-bark rounded shrink-0 flex items-center justify-center text-xs opacity-30">
                    📖
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-cream text-xs font-display truncate">
                    {r.title}
                  </p>
                  <p className="text-stone text-xs">
                    {r.author_name?.[0]}{' '}
                    {r.first_publish_year ? `· ${r.first_publish_year}` : ''}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-mist/20 pt-4 grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={labelClass}>{t.form.title} *</label>
          <input
            className={inputClass}
            value={fields.title}
            onChange={set('title')}
            placeholder="The Name of the Wind"
            required
          />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>{t.form.author} *</label>
          <input
            className={inputClass}
            value={fields.author}
            onChange={set('author')}
            placeholder="Patrick Rothfuss"
            required
          />
        </div>
        <div>
          <label className={labelClass}>{t.form.pages}</label>
          <input
            className={inputClass}
            type="number"
            min={1}
            value={fields.pages}
            onChange={set('pages')}
            placeholder="662"
          />
        </div>
        <div>
          <label className={labelClass}>{t.form.year}</label>
          <input
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
        <label className={labelClass}>{t.form.genre}</label>
        <div className="flex gap-2">
          <input
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
            className="text-xs bg-bark border border-mist/20 rounded-lg px-3 text-parchment hover:text-cream transition-colors"
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
          <label className={labelClass}>{t.bookLanguage.label}</label>
          <select
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
          <label className={labelClass}>{t.form.status}</label>
          <select
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
          <label className={labelClass}>{t.form.rating}</label>
          <select
            className={inputClass}
            value={fields.rating}
            onChange={set('rating')}
          >
            <option value="">—</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {'★'.repeat(n)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className={labelClass}>{t.form.cover}</label>
        <input
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
        className="mt-2 bg-wine hover:bg-rose disabled:opacity-50 text-cream text-sm py-2.5 rounded-lg transition-colors font-body"
      >
        {loading ? '✦' : t.form.submit}
      </button>
    </form>
  );
}
