import { CircleNotch } from '@phosphor-icons/react';
import { useState } from 'react';
import type { Book, BookLanguage, Read, ReadStatus } from '../api/books';
import { booksApi, readsApi } from '../api/books';
import { useLanguage } from '../hooks/useLanguage';
import GenreTagInput from './GenreTagInput';

type Props = { book: Book; read?: Read; onSuccess: () => void };

const inputClass =
  'w-full bg-bark border border-mist/40 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm focus:border-mist/70 transition-colors';
const labelClass = 'block text-xs text-parchment mb-1';

export default function EditBookForm({ book, read, onSuccess }: Props) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const [fields, setFields] = useState({
    title: book.title,
    author: book.author,
    genre: book.genre,
    language: book.language ?? ('' as BookLanguage | ''),
    pages: book.pages ? String(book.pages) : '',
    coverUrl: book.coverUrl ?? '',
    publishedYear: book.publishedYear ? String(book.publishedYear) : '',
    status: read?.status ?? ('wishlist' as ReadStatus),
    rating: read?.rating ? String(read.rating) : '',
  });

  const set =
    (key: keyof typeof fields) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.title || !fields.author) return;
    setLoading(true);
    try {
      await booksApi.update(book._id, {
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
      if (read) {
        await readsApi.update(read._id, {
          status: fields.status,
          rating: fields.rating ? parseInt(fields.rating) : undefined,
        });
      }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="col-span-2">
          <label htmlFor="edit-title" className={labelClass}>
            {t.form.title} *
          </label>
          <input
            id="edit-title"
            className={inputClass}
            value={fields.title}
            onChange={set('title')}
            required
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="edit-author" className={labelClass}>
            {t.form.author} *
          </label>
          <input
            id="edit-author"
            className={inputClass}
            value={fields.author}
            onChange={set('author')}
            required
          />
        </div>
        <div>
          <label htmlFor="edit-pages" className={labelClass}>
            {t.form.pages}
          </label>
          <input
            id="edit-pages"
            className={inputClass}
            type="number"
            min={1}
            value={fields.pages}
            onChange={set('pages')}
          />
        </div>
        <div>
          <label htmlFor="edit-year" className={labelClass}>
            {t.form.year}
          </label>
          <input
            id="edit-year"
            className={inputClass}
            type="number"
            min={1}
            value={fields.publishedYear}
            onChange={set('publishedYear')}
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
          <label htmlFor="edit-language" className={labelClass}>
            {t.bookLanguage.label}
          </label>
          <select
            id="edit-language"
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
          <label htmlFor="edit-status" className={labelClass}>
            {t.form.status}
          </label>
          <select
            id="edit-status"
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
          <label htmlFor="edit-rating" className={labelClass}>
            {t.form.rating}
          </label>
          <select
            id="edit-rating"
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
        <label htmlFor="edit-cover" className={labelClass}>
          {t.form.cover}
        </label>
        <input
          id="edit-cover"
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
        className="mt-2 bg-wine hover:bg-rose disabled:opacity-50 text-night font-medium text-sm py-2.5 rounded-2xl transition-all duration-200 hover:scale-[1.02] font-body"
      >
        {loading ? (
          <CircleNotch
            size={14}
            weight="light"
            className="animate-spin mx-auto"
            aria-hidden="true"
          />
        ) : (
          t.bookDetail.edit
        )}
      </button>
    </form>
  );
}
