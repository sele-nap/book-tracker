import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { booksApi, readsApi } from '../api/books';
import type { Book, Read, ReadStatus } from '../api/books';
import AddBookForm from '../components/AddBookForm';
import BookCard from '../components/BookCard';
import Modal from '../components/Modal';
import { useLanguage } from '../i18n/LanguageContext';
import { useApi } from '../hooks/useApi';

export default function Library() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReadStatus>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchBooks = useCallback(() => booksApi.getAll(), []);
  const fetchReads = useCallback(() => readsApi.getAll(), []);

  const { data: books, loading: booksLoading, refetch: refetchBooks } = useApi<Book[]>(fetchBooks);
  const { data: reads, loading: readsLoading, refetch: refetchReads } = useApi<Read[]>(fetchReads);

  const STATUS_FILTERS: { value: 'all' | ReadStatus; label: string }[] = [
    { value: 'all',      label: t.library.filters.all },
    { value: 'reading',  label: t.library.filters.reading },
    { value: 'finished', label: t.library.filters.finished },
    { value: 'wishlist', label: t.library.filters.wishlist },
    { value: 'dropped',  label: t.library.filters.dropped },
  ];

  const readsByBookId = new Map(reads?.map((r) => [r.book._id, r]) ?? []);

  const filtered = (books ?? []).filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const read = readsByBookId.get(b._id);
    const matchStatus = statusFilter === 'all' || read?.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const loading = booksLoading || readsLoading;

  return (
    <div>
      {showAddModal && (
        <Modal title={t.library.add} onClose={() => setShowAddModal(false)}>
          <AddBookForm onSuccess={() => { setShowAddModal(false); refetchBooks(); refetchReads(); }} />
        </Modal>
      )}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl mb-1">{t.library.title}</h1>
          <p className="text-parchment">{books?.length ?? '—'} {t.library.bookCount} ✨</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-wine hover:bg-rose text-cream text-sm px-4 py-2 rounded-lg transition-colors font-body"
        >
          {t.library.add}
        </button>
      </div>

      <input
        type="text"
        placeholder={t.library.search}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-dusk border border-mist/30 rounded-lg px-4 py-2.5 text-cream placeholder:text-stone text-sm outline-none focus:border-mist/70 mb-4"
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              statusFilter === value
                ? 'bg-wine text-cream'
                : 'bg-bark text-parchment hover:bg-mist/30'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-stone text-center mt-16">✦</p>
      ) : filtered.length === 0 ? (
        <p className="text-stone text-center mt-16">{t.library.empty}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((book) => {
            const read = readsByBookId.get(book._id);
            return (
              <Link key={book._id} to={`/books/${book._id}`}>
                <BookCard
                  title={book.title}
                  author={book.author}
                  genre={book.genre}
                  language={book.language}
                  coverUrl={book.coverUrl}
                  status={read?.status ?? 'wishlist'}
                  rating={read?.rating}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
