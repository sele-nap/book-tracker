import { Book as BookIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import type { Shelf } from '../api/shelves';
import { useLanguage } from '../hooks/useLanguage';

export default function ShelfCard({
  shelf,
  onDelete,
  onOpen,
}: {
  shelf: Shelf;
  onDelete: () => void;
  onOpen: () => void;
}) {
  const { t } = useLanguage();
  const previews = shelf.books.slice(0, 4);

  return (
    <div className="bg-dusk border border-mist/30 rounded-2xl p-5 flex flex-col gap-4 hover:border-mist/50 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-night/60 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-cream">{shelf.name}</h3>
          {shelf.description && (
            <p className="text-stone text-xs mt-0.5">{shelf.description}</p>
          )}
        </div>
        <button
          onClick={onDelete}
          aria-label={`Delete shelf ${shelf.name}`}
          className="text-stone hover:text-blush transition-colors text-xs"
        >
          ✕
        </button>
      </div>

      <div className="flex gap-2">
        {previews.map((b) => (
          <Link
            key={b._id}
            to={`/books/${b._id}`}
            aria-label={b.title}
            className="w-14 h-20 bg-bark rounded-lg overflow-hidden shrink-0 border border-mist/40 hover:opacity-80 transition-opacity"
          >
            {b.coverUrl ? (
              <img
                src={b.coverUrl}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className="w-full h-full flex items-center justify-center"
              >
                <BookIcon
                  size={18}
                  weight="light"
                  className="opacity-20 text-parchment"
                />
              </div>
            )}
          </Link>
        ))}
        {shelf.books.length === 0 && (
          <p className="text-stone text-xs italic">{t.shelves.empty}</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-stone text-xs">
          {shelf.books.length} {t.shelves.bookCount}
        </span>
        <button
          onClick={onOpen}
          className="text-xs text-parchment hover:text-cream transition-colors"
        >
          {t.shelves.manage} →
        </button>
      </div>
    </div>
  );
}
