import { Book } from '@phosphor-icons/react';
import type { BookLanguage } from '../api/books';
import { useLanguage } from '../hooks/useLanguage';
import StarRating from './StarRating';

type Props = {
  title: string;
  author: string;
  genre: string[];
  status: 'reading' | 'finished' | 'dropped' | 'wishlist';
  language?: BookLanguage;
  rating?: number;
  coverUrl?: string;
};

const statusStyles: Record<Props['status'], string> = {
  reading: 'bg-sage/20 text-sage',
  finished: 'bg-wine/20 text-blush',
  dropped: 'bg-stone/20 text-stone',
  wishlist: 'bg-amber/20 text-amber',
};

const languageStyles: Record<BookLanguage, string> = {
  vo: 'bg-fern/20 text-fern',
  vf: 'bg-mushroom/20 text-parchment',
  other: 'bg-mist/20 text-stone',
};

export default function BookCard({
  title,
  author,
  genre,
  status,
  language,
  rating,
  coverUrl,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="bg-dusk border border-mist/30 rounded-2xl overflow-hidden hover:border-mist/50 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-2xl hover:shadow-night/70 transition-all duration-300 group flex flex-col h-full">
      <div className="h-40 shrink-0 bg-bark flex items-center justify-center overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Book
            size={32}
            weight="light"
            aria-hidden="true"
            className="opacity-20 text-parchment"
          />
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${statusStyles[status]}`}
          >
            {t.status[status]}
          </span>
          {language && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${languageStyles[language]}`}
            >
              {t.bookLanguage[language]}
            </span>
          )}
        </div>

        <h3 className="font-display text-cream text-sm mt-2 leading-snug line-clamp-2">
          {title}
        </h3>
        <p className="text-stone text-xs mt-1 line-clamp-1">{author}</p>

        <div className="mt-auto pt-2 flex flex-col gap-1.5">
          {rating && (
            <div className="text-xs">
              <StarRating value={rating} />
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {genre.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-xs text-parchment/60 bg-bark px-2 py-0.5 rounded-full"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
