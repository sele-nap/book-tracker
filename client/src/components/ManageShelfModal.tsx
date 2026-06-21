import { CircleNotch } from '@phosphor-icons/react';
import { useEffect, useId, useState } from 'react';
import type { Book } from '../api/books';
import { booksApi } from '../api/books';
import type { Shelf } from '../api/shelves';
import { shelvesApi } from '../api/shelves';
import { useDebounce } from '../hooks/useDebounce';
import { useLanguage } from '../hooks/useLanguage';
import Modal from './Modal';

export default function ManageShelfModal({
  shelf,
  onClose,
  onUpdate,
}: {
  shelf: Shelf;
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
    await shelvesApi.addBook(shelf._id, bookId);
    onUpdate();
  };

  const removeBook = async (bookId: string) => {
    await shelvesApi.removeBook(shelf._id, bookId);
    onUpdate();
  };

  const shelfBookIds = new Set(shelf.books.map((b) => b._id));

  return (
    <Modal title={shelf.name} onClose={onClose}>
      <div className="space-y-4">
        <div className="relative">
          <label htmlFor={searchId} className="sr-only">
            {t.shelves.searchBooks}
          </label>
          <input
            id={searchId}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.shelves.searchBooks}
            className="w-full bg-bark border border-mist/40 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm focus:border-mist/50"
          />
          {searching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone">
              <CircleNotch size={13} weight="light" className="animate-spin" />
            </span>
          )}
        </div>

        {visibleResults.length > 0 && (
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {visibleResults.map((b) => (
              <div
                key={b._id}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-bark/50"
              >
                <div>
                  <p className="text-cream text-xs font-display">{b.title}</p>
                  <p className="text-stone text-xs">{b.author}</p>
                </div>
                {shelfBookIds.has(b._id) ? (
                  <button
                    onClick={() => removeBook(b._id)}
                    className="text-xs text-blush hover:text-rose transition-colors"
                  >
                    {t.shelves.remove}
                  </button>
                ) : (
                  <button
                    onClick={() => addBook(b._id)}
                    className="text-xs text-sage hover:text-fern transition-colors"
                  >
                    {t.shelves.add}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div>
          <p className="text-parchment text-xs mb-2">
            {t.shelves.currentBooks}
          </p>
          {shelf.books.length === 0 ? (
            <p className="text-stone text-xs italic">{t.shelves.empty}</p>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {shelf.books.map((b) => (
                <div
                  key={b._id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-bark/50"
                >
                  <div>
                    <p className="text-cream text-xs font-display">{b.title}</p>
                    <p className="text-stone text-xs">{b.author}</p>
                  </div>
                  <button
                    onClick={() => removeBook(b._id)}
                    className="text-xs text-blush hover:text-rose transition-colors"
                  >
                    {t.shelves.remove}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
