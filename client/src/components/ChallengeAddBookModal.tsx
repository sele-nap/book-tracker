import { Check, CircleNotch } from '@phosphor-icons/react';
import { useEffect, useId, useState } from 'react';
import type { Book } from '../api/books';
import { booksApi } from '../api/books';
import type { Challenge } from '../api/challenges';
import { challengesApi } from '../api/challenges';
import { useDebounce } from '../hooks/useDebounce';
import { useLanguage } from '../hooks/useLanguage';
import Modal from './Modal';

export default function ChallengeAddBookModal({
  challenge,
  onClose,
  onUpdate,
}: {
  challenge: Challenge;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const { t } = useLanguage();
  const searchId = useId();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Book[]>([]);

  const debouncedSearch = useDebounce(search, 300);

  const trimmed = debouncedSearch.trim();
  const searching = search.trim() !== '' && search !== debouncedSearch;
  const visibleResults = trimmed ? results : [];
  const alreadyIn = new Set(challenge.books.map((b) => b._id));

  useEffect(() => {
    if (!trimmed) return;
    let cancelled = false;
    booksApi.search(trimmed).then((data) => {
      if (!cancelled) {
        setResults(data);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [trimmed]);

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
        <div className="relative">
          <label htmlFor={searchId} className="sr-only">
            {t.challenges.searchBooks}
          </label>
          <input
            id={searchId}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.challenges.searchBooks}
            className="w-full bg-bark border border-mist/40 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm focus:border-mist/50"
          />
          {searching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone">
              <CircleNotch size={13} weight="light" className="animate-spin" />
            </span>
          )}
        </div>

        {visibleResults.length > 0 && (
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {visibleResults.map((b) => (
              <div
                key={b._id}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-bark/50"
              >
                <div>
                  <p className="text-cream text-xs font-display">{b.title}</p>
                  <p className="text-stone text-xs">{b.author}</p>
                </div>
                {alreadyIn.has(b._id) ? (
                  <span className="text-xs text-sage flex items-center gap-1">
                    <Check size={12} weight="light" aria-hidden="true" />{' '}
                    {t.challenges.alreadyIn}
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
