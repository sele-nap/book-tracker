import { CircleNotch } from '@phosphor-icons/react';
import { useState } from 'react';
import type { BookLanguage, ReadStatus } from '../api/books';
import { booksApi, readsApi } from '../api/books';
import type { BookSearchResult } from '../api/bookSearch';
import { useLanguage } from '../hooks/useLanguage';
import BookSearchInput from './BookSearchInput';
import GenreTagInput from './GenreTagInput';

type Props = { onSuccess: () => void };

const inputClass =
  'w-full bg-bark border border-mist/40 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm focus:border-mist/70 transition-colors';
const labelClass = 'block text-xs text-parchment mb-1';

type Fields = {
  title: string;
  author: string;
  genre: string[];
  language: BookLanguage | '';
  pages: string;
  coverUrl: string;
  publishedYear: string;
  status: ReadStatus;
  rating: string;
};

const defaultFields: Fields = {
  title: '',
  author: '',
  genre: [],
  language: '',
  pages: '',
  coverUrl: '',
  publishedYear: '',
  status: 'wishlist',
  rating: '',
};

export default function AddBookForm({ onSuccess }: Props) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<Fields>(defaultFields);

  const set =
    (key: keyof Fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

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
        book: book._id,
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
      <BookSearchInput label={t.form.search} onSelect={fillFrom} />

      <div className="border-t border-mist/20 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      <GenreTagInput
        label={t.form.genre}
        genres={fields.genre}
        onChange={(genre) => setFields((f) => ({ ...f, genre }))}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        className="mt-2 bg-wine hover:bg-rose disabled:opacity-50 text-cream text-sm py-2.5 rounded-2xl transition-all duration-200 hover:scale-[1.02] font-body"
      >
        {loading ? (
          <CircleNotch
            size={14}
            weight="light"
            className="animate-spin mx-auto"
            aria-hidden="true"
          />
        ) : (
          t.form.submit
        )}
      </button>
    </form>
  );
}
