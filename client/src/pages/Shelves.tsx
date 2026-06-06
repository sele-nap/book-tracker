import { Book as BookIcon, CircleNotch } from '@phosphor-icons/react';
import { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import type { Book } from '../api/books';
import { booksApi } from '../api/books';
import type { Shelf } from '../api/shelves';
import { shelvesApi } from '../api/shelves';
import ApiError from '../components/ApiError';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { ShelvesSkeleton } from '../components/Skeleton';
import { useLanguage } from '../hooks/useLanguage';

function ShelfCard({
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
    <div className="bg-dusk border border-mist/30 rounded-xl p-5 flex flex-col gap-4 hover:border-mist/60 transition-colors">
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

function ManageShelfModal({
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
  const [searching, setSearching] = useState(false);

  const searchBooks = async () => {
    if (!search.trim()) return;
    setSearching(true);
    const data = await booksApi.search(search);
    setResults(data);
    setSearching(false);
  };

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
        <div className="flex gap-2">
          <label htmlFor={searchId} className="sr-only">
            {t.shelves.searchBooks}
          </label>
          <input
            id={searchId}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') searchBooks();
            }}
            placeholder={t.shelves.searchBooks}
            className="flex-1 bg-bark border border-mist/40 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm focus:border-mist/50"
          />
          <button
            onClick={searchBooks}
            className="text-sm bg-bark border border-mist/40 rounded-lg px-3 text-parchment hover:text-cream transition-colors"
          >
            {searching ? (
              <CircleNotch size={13} weight="light" className="animate-spin" />
            ) : (
              t.shelves.search
            )}
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {results.map((b) => (
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

export default function Shelves() {
  const { t } = useLanguage();
  const [showCreate, setShowCreate] = useState(false);
  const [activeShelf, setActiveShelf] = useState<Shelf | null>(null);
  const [shelfToDelete, setShelfToDelete] = useState<Shelf | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const {
    data: shelves,
    isLoading: loading,
    error: shelvesErr,
    mutate: refetch,
  } = useSWR<Shelf[]>('/shelves', shelvesApi.getAll);

  useEffect(() => {
    document.title = `${t.shelves.title} — Book Tracker`;
  }, [t]);

  const createShelf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await shelvesApi.create({ name, description: description || undefined });
    setName('');
    setDescription('');
    setShowCreate(false);
    refetch();
  };

  const deleteShelf = async () => {
    if (!shelfToDelete) return;
    await shelvesApi.delete(shelfToDelete._id);
    setShelfToDelete(null);
    refetch();
  };

  const handleUpdate = () => {
    refetch();
    if (activeShelf) {
      const updated = shelves?.find((s) => s._id === activeShelf._id);
      if (updated) setActiveShelf(updated);
    }
  };

  return (
    <div>
      {shelfToDelete && (
        <ConfirmModal
          title={t.shelves.confirmDelete}
          message={shelfToDelete.name}
          confirmLabel={t.shelves.confirmDeleteLabel}
          cancelLabel={t.settings.cancel}
          danger
          onConfirm={deleteShelf}
          onClose={() => setShelfToDelete(null)}
        />
      )}

      {showCreate && (
        <Modal title={t.shelves.create} onClose={() => setShowCreate(false)}>
          <form onSubmit={createShelf} className="space-y-4">
            <div>
              <label
                htmlFor="shelf-name"
                className="block text-xs text-parchment mb-1"
              >
                {t.shelves.name} *
              </label>
              <input
                id="shelf-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="fantasy favs…"
                required
                className="w-full bg-bark border border-mist/40 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm focus:border-mist/50"
              />
            </div>
            <div>
              <label
                htmlFor="shelf-description"
                className="block text-xs text-parchment mb-1"
              >
                {t.shelves.description}
              </label>
              <input
                id="shelf-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="my favourite books…"
                className="w-full bg-bark border border-mist/40 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm focus:border-mist/50"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-wine hover:bg-rose text-cream text-sm py-2.5 rounded-lg transition-colors"
            >
              {t.shelves.create}
            </button>
          </form>
        </Modal>
      )}

      {activeShelf && (
        <ManageShelfModal
          shelf={activeShelf}
          onClose={() => setActiveShelf(null)}
          onUpdate={handleUpdate}
        />
      )}

      <div className="flex flex-wrap items-start justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl mb-1">{t.shelves.title}</h1>
          <p className="text-parchment">{t.shelves.subtitle}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-wine hover:bg-rose text-cream text-sm px-4 py-2 rounded-lg transition-colors font-body"
        >
          {t.shelves.new}
        </button>
      </div>

      {loading ? (
        <ShelvesSkeleton />
      ) : shelvesErr ? (
        <ApiError
          message={shelvesErr?.message ?? 'Unknown error'}
          onRetry={refetch}
        />
      ) : !shelves?.length ? (
        <EmptyState message={t.shelves.noShelves} variant="mushroom" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shelves.map((shelf) => (
            <ShelfCard
              key={shelf._id}
              shelf={shelf}
              onDelete={() => setShelfToDelete(shelf)}
              onOpen={() => setActiveShelf(shelf)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
