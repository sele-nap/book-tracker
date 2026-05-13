import { useState } from 'react';
import { booksApi, readsApi } from '../api/books';
import type { Book, BookLanguage, Read, ReadStatus } from '../api/books';
import { useLanguage } from '../i18n/LanguageContext';

type Props = { book: Book; read?: Read; onSuccess: () => void };

const inputClass = 'w-full bg-bark border border-mist/20 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm outline-none focus:border-mist/50 transition-colors';
const labelClass = 'block text-xs text-parchment mb-1';

export default function EditBookForm({ book, read, onSuccess }: Props) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [genreInput, setGenreInput] = useState('');

  const [fields, setFields] = useState({
    title:         book.title,
    author:        book.author,
    genre:         book.genre,
    language:      book.language ?? '' as BookLanguage | '',
    pages:         book.pages ? String(book.pages) : '',
    coverUrl:      book.coverUrl ?? '',
    publishedYear: book.publishedYear ? String(book.publishedYear) : '',
    status:        read?.status ?? 'wishlist' as ReadStatus,
    rating:        read?.rating ? String(read.rating) : '',
  });

  const set = (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  const addGenre = () => {
    const g = genreInput.trim().toLowerCase();
    if (g && !fields.genre.includes(g)) setFields((f) => ({ ...f, genre: [...f.genre, g] }));
    setGenreInput('');
  };

  const removeGenre = (g: string) =>
    setFields((f) => ({ ...f, genre: f.genre.filter((x) => x !== g) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.title || !fields.author) return;
    setLoading(true);
    try {
      await booksApi.update(book._id, {
        title:         fields.title,
        author:        fields.author,
        genre:         fields.genre,
        language:      fields.language || undefined,
        pages:         fields.pages ? parseInt(fields.pages) : undefined,
        coverUrl:      fields.coverUrl || undefined,
        publishedYear: fields.publishedYear ? parseInt(fields.publishedYear) : undefined,
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={labelClass}>{t.form.title} *</label>
          <input className={inputClass} value={fields.title} onChange={set('title')} required />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>{t.form.author} *</label>
          <input className={inputClass} value={fields.author} onChange={set('author')} required />
        </div>
        <div>
          <label className={labelClass}>{t.form.pages}</label>
          <input className={inputClass} type="number" min={1} value={fields.pages} onChange={set('pages')} />
        </div>
        <div>
          <label className={labelClass}>{t.form.year}</label>
          <input className={inputClass} type="number" min={1} value={fields.publishedYear} onChange={set('publishedYear')} />
        </div>
      </div>

      <div>
        <label className={labelClass}>{t.form.genre}</label>
        <div className="flex gap-2">
          <input
            className={inputClass}
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addGenre(); } }}
            placeholder="fantasy…"
          />
          <button type="button" onClick={addGenre} className="text-xs bg-bark border border-mist/20 rounded-lg px-3 text-parchment hover:text-cream transition-colors">+</button>
        </div>
        {fields.genre.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {fields.genre.map((g) => (
              <span key={g} className="flex items-center gap-1 text-xs bg-mist/20 text-parchment px-2 py-0.5 rounded-full">
                {g}
                <button type="button" onClick={() => removeGenre(g)} className="text-stone hover:text-cream">✕</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>{t.bookLanguage.label}</label>
          <select className={inputClass} value={fields.language} onChange={set('language')}>
            <option value="">—</option>
            <option value="vo">{t.bookLanguage.vo}</option>
            <option value="vf">{t.bookLanguage.vf}</option>
            <option value="other">{t.bookLanguage.other}</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>{t.form.status}</label>
          <select className={inputClass} value={fields.status} onChange={set('status')}>
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
          <select className={inputClass} value={fields.rating} onChange={set('rating')}>
            <option value="">—</option>
            {[1,2,3,4,5].map((n) => (
              <option key={n} value={n}>{'★'.repeat(n)}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className={labelClass}>{t.form.cover}</label>
        <input className={inputClass} value={fields.coverUrl} onChange={set('coverUrl')} placeholder="https://…" />
        {fields.coverUrl && (
          <img src={fields.coverUrl} alt="cover preview" className="mt-2 h-20 rounded object-cover" />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-wine hover:bg-rose disabled:opacity-50 text-cream text-sm py-2.5 rounded-lg transition-colors font-body"
      >
        {loading ? '✦' : t.bookDetail.edit}
      </button>
    </form>
  );
}
