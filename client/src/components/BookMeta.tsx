import { Book as BookIcon } from '@phosphor-icons/react';
import type { Book, Read } from '../api/books.js';
import StarRating from '../components/StarRating.js';
import { useLanguage } from '../hooks/useLanguage.js';

const labelClass = 'text-xs text-stone uppercase tracking-widest';
const valueClass = 'text-cream text-sm mt-0.5';

const statusStyles: Record<string, string> = {
  reading: 'bg-sage/20 text-sage',
  finished: 'bg-wine/20 text-blush',
  dropped: 'bg-stone/20 text-stone',
  wishlist: 'bg-amber/20 text-amber',
};

export default function BookMeta({
  book,
  read,
  onEdit,
  onDelete,
  deleting,
}: {
  book: Book;
  read: Read | null | undefined;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
      <div className="shrink-0 flex justify-center md:justify-start">
        <div className="w-32 h-44 sm:w-40 sm:h-56 bg-bark rounded-xl overflow-hidden">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookIcon
                size={36}
                weight="light"
                className="opacity-20 text-parchment"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-display text-cream leading-tight">
              {book.title}
            </h1>
            <p className="text-parchment mt-1">{book.author}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={onEdit}
              className="text-xs text-parchment hover:text-cream border border-mist/30 hover:border-mist/60 rounded-lg px-3 py-1.5 transition-colors"
            >
              {t.bookDetail.edit}
            </button>
            <button
              onClick={onDelete}
              disabled={deleting}
              className="text-xs text-stone hover:text-blush border border-mist/40 hover:border-blush/40 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
            >
              {t.bookDetail.delete}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {read && (
            <span
              className={`text-xs px-2.5 py-1 rounded-full ${statusStyles[read.status]}`}
            >
              {t.status[read.status]}
            </span>
          )}
          {book.language && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-mist/20 text-parchment">
              {t.bookLanguage[book.language]}
            </span>
          )}
          {book.genre.map((g) => (
            <span
              key={g}
              className="text-xs px-2.5 py-1 rounded-full bg-bark text-parchment/60"
            >
              {g}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {book.pages && (
            <div>
              <p className={labelClass}>{t.bookDetail.pages}</p>
              <p className={valueClass}>{book.pages}</p>
            </div>
          )}
          {book.publishedYear && (
            <div>
              <p className={labelClass}>{t.bookDetail.publishedIn}</p>
              <p className={valueClass}>{book.publishedYear}</p>
            </div>
          )}
          {read?.rating && (
            <div>
              <p className={labelClass}>{t.form.rating}</p>
              <p className={valueClass}>
                <StarRating value={read.rating} />
              </p>
            </div>
          )}
          {read?.currentPage && book.pages && (
            <div>
              <p className={labelClass}>{t.reading.currentPage}</p>
              <p className={valueClass}>
                {read.currentPage} / {book.pages}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
