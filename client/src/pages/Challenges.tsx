import { useCallback, useState } from 'react';
import type { Book } from '../api/books';
import { booksApi } from '../api/books';
import type { Challenge } from '../api/challenges';
import { challengesApi } from '../api/challenges';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { ChallengesSkeleton } from '../components/Skeleton';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../i18n/LanguageContext';

function ChallengeCard({
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
      className={`bg-dusk border rounded-2xl p-6 space-y-5 ${done ? 'border-amber/50' : 'border-mist/30'}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-cream text-xl">{challenge.year}</h3>
          <p className="text-stone text-sm mt-0.5">
            {challenge.books.length} / {challenge.goalBooks}{' '}
            {t.challenges.books}
          </p>
        </div>
        {done && <span className="text-amber text-lg">✦</span>}
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
            className={`h-full rounded-full transition-all duration-700 ${done ? 'bg-amber' : 'bg-gradient-to-r from-wine to-blush'}`}
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
                title={b.title}
              >
                {b.coverUrl ? (
                  <img
                    src={b.coverUrl}
                    alt={b.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-sm opacity-20">
                    📖
                  </span>
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
        className="w-full text-sm border border-mist/20 rounded-lg py-2 text-parchment hover:text-cream hover:border-mist/50 transition-colors"
      >
        + {t.challenges.addBook}
      </button>
    </div>
  );
}

function AddBookModal({
  challenge,
  onClose,
  onUpdate,
}: {
  challenge: Challenge;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [searching, setSearching] = useState(false);

  const alreadyIn = new Set(challenge.books.map((b) => b._id));

  const searchBooks = async () => {
    if (!search.trim()) return;
    setSearching(true);
    const data = await booksApi.search(search);
    setResults(data);
    setSearching(false);
  };

  const addBook = async (bookId: string) => {
    await challengesApi.addBook(challenge._id, bookId);
    onUpdate();
  };

  return (
    <Modal
      title={`${t.challenges.addBook} — ${challenge.year}`}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') searchBooks();
            }}
            placeholder={t.challenges.searchBooks}
            className="flex-1 bg-bark border border-mist/20 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm outline-none focus:border-mist/50"
          />
          <button
            onClick={searchBooks}
            className="text-sm bg-bark border border-mist/20 rounded-lg px-3 text-parchment hover:text-cream transition-colors"
          >
            {searching ? '✦' : t.challenges.search}
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {results.map((b) => (
              <div
                key={b._id}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-bark/50"
              >
                <div>
                  <p className="text-cream text-xs font-display">{b.title}</p>
                  <p className="text-stone text-xs">{b.author}</p>
                </div>
                {alreadyIn.has(b._id) ? (
                  <span className="text-xs text-sage">
                    ✦ {t.challenges.alreadyIn}
                  </span>
                ) : (
                  <button
                    onClick={() => addBook(b._id)}
                    className="text-xs text-parchment hover:text-cream transition-colors"
                  >
                    + {t.challenges.add}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

function CreateChallengeForm({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useLanguage();
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [goal, setGoal] = useState('');
  const [genreInput, setGenreInput] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addGenre = () => {
    const g = genreInput.trim().toLowerCase();
    if (g && !genres.includes(g)) setGenres((gs) => [...gs, g]);
    setGenreInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;
    setLoading(true);
    await challengesApi.create({
      year: parseInt(year),
      goalBooks: parseInt(goal),
      targetGenres: genres,
    });
    setLoading(false);
    onSuccess();
  };

  const inputClass =
    'w-full bg-bark border border-mist/20 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm outline-none focus:border-mist/50';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-parchment mb-1">
            {t.challenges.year}
          </label>
          <input
            className={inputClass}
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs text-parchment mb-1">
            {t.challenges.goal} *
          </label>
          <input
            className={inputClass}
            type="number"
            min={1}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="52"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-parchment mb-1">
          {t.challenges.targetGenres}
        </label>
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
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {genres.map((g) => (
              <span
                key={g}
                className="flex items-center gap-1 text-xs bg-mist/20 text-parchment px-2 py-0.5 rounded-full"
              >
                {g}
                <button
                  type="button"
                  onClick={() => setGenres((gs) => gs.filter((x) => x !== g))}
                  className="text-stone hover:text-cream"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-wine hover:bg-rose disabled:opacity-50 text-cream text-sm py-2.5 rounded-lg transition-colors"
      >
        {loading ? '✦' : t.challenges.create}
      </button>
    </form>
  );
}

export default function Challenges() {
  const { t } = useLanguage();
  const [showCreate, setShowCreate] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(
    null,
  );

  const fetchChallenges = useCallback(() => challengesApi.getAll(), []);
  const {
    data: challenges,
    loading,
    refetch,
  } = useApi<Challenge[]>(fetchChallenges);

  const handleUpdate = () => {
    refetch();
    if (activeChallenge) {
      const updated = challenges?.find((c) => c._id === activeChallenge._id);
      if (updated) setActiveChallenge(updated);
    }
  };

  return (
    <div>
      {showCreate && (
        <Modal title={t.challenges.create} onClose={() => setShowCreate(false)}>
          <CreateChallengeForm
            onSuccess={() => {
              setShowCreate(false);
              refetch();
            }}
          />
        </Modal>
      )}

      {activeChallenge && (
        <AddBookModal
          challenge={activeChallenge}
          onClose={() => setActiveChallenge(null)}
          onUpdate={handleUpdate}
        />
      )}

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl mb-1">{t.challenges.title}</h1>
          <p className="text-parchment">{t.challenges.subtitle}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-wine hover:bg-rose text-cream text-sm px-4 py-2 rounded-lg transition-colors font-body"
        >
          {t.challenges.new}
        </button>
      </div>

      {loading ? (
        <ChallengesSkeleton />
      ) : !challenges?.length ? (
        <EmptyState message={t.challenges.noChallenges} variant="moon" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {challenges.map((c) => (
            <ChallengeCard
              key={c._id}
              challenge={c}
              onAddBook={() => setActiveChallenge(c)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
