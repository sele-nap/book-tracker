import { useLanguage } from '../i18n/LanguageContext';

type BookLanguage = 'vo' | 'vf' | 'other';

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
    <div className="bg-dusk border border-mist/30 rounded-xl overflow-hidden hover:border-mist/60 transition-colors group">
      <div className="h-40 bg-bark flex items-center justify-center overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-4xl opacity-30">📖</span>
        )}
      </div>

      <div className="p-4">
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
        <p className="text-stone text-xs mt-1">{author}</p>

        {rating && (
          <div className="flex gap-0.5 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-xs ${i < rating ? 'text-amber' : 'text-mist'}`}
              >
                ★
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1 mt-2">
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
  );
}
