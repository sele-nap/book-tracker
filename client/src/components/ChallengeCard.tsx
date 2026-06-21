import { Book as BookIcon, Star } from '@phosphor-icons/react';
import type { Challenge } from '../api/challenges';
import { useLanguage } from '../hooks/useLanguage';

export default function ChallengeCard({
  challenge,
  onAddBook,
}: {
  challenge: Challenge;
  onAddBook: () => void;
}) {
  const { t } = useLanguage();
  const pct = Math.min(
    100,
    Math.round((challenge.books.length / challenge.goalBooks) * 100),
  );
  const done = challenge.books.length >= challenge.goalBooks;

  return (
    <div
      className={`bg-dusk border rounded-3xl p-6 space-y-5 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-2xl hover:shadow-night/70 transition-all duration-300 ${done ? 'border-amber/50 hover:border-amber/70' : 'border-mist/30 hover:border-mist/50'}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-cream text-xl">{challenge.year}</h3>
          <p className="text-stone text-sm mt-0.5">
            {challenge.books.length} / {challenge.goalBooks}{' '}
            {t.challenges.books}
          </p>
        </div>
        {done && (
          <Star
            size={18}
            weight="fill"
            className="text-amber"
            aria-hidden="true"
          />
        )}
      </div>

      <div>
        <div className="flex justify-between text-xs text-stone mb-1.5">
          <span>{pct}%</span>
          <span>
            {challenge.goalBooks - challenge.books.length > 0
              ? `${challenge.goalBooks - challenge.books.length} ${t.challenges.remaining}`
              : t.challenges.completed}
          </span>
        </div>
        <div className="h-2 bg-bark rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${done ? 'bg-amber' : 'bg-linear-to-r from-wine to-blush'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {challenge.targetGenres.length > 0 && (
        <div>
          <p className="text-xs text-parchment mb-2">
            {t.challenges.targetGenres}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {challenge.targetGenres.map((g) => {
              const count = challenge.books.filter((b) =>
                b.genre.includes(g),
              ).length;
              return (
                <span
                  key={g}
                  className="flex items-center gap-1 text-xs bg-bark px-2.5 py-1 rounded-full text-parchment"
                >
                  {g}
                  {count > 0 && <span className="text-sage">({count})</span>}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs text-parchment mb-2">
          {t.challenges.recentBooks}
        </p>
        <div className="flex gap-1.5">
          {challenge.books
            .slice(-6)
            .reverse()
            .map((b) => (
              <div
                key={b._id}
                className="w-9 h-12 bg-bark rounded overflow-hidden shrink-0"
              >
                {b.coverUrl ? (
                  <img
                    src={b.coverUrl}
                    alt={b.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="w-full h-full flex items-center justify-center"
                  >
                    <BookIcon
                      size={12}
                      weight="light"
                      className="opacity-20 text-parchment"
                    />
                  </div>
                )}
              </div>
            ))}
          {challenge.books.length === 0 && (
            <p className="text-stone text-xs italic">{t.challenges.noBooks}</p>
          )}
        </div>
      </div>

      <button
        onClick={onAddBook}
        className="w-full text-sm border border-mist/40 rounded-lg py-2 text-parchment hover:text-cream hover:border-mist/50 transition-colors"
      >
        + {t.challenges.addBook}
      </button>
    </div>
  );
}
