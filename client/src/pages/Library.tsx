import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { booksApi, readsApi } from '../api/books';
import type { BooksPage, Read, ReadStatus } from '../api/books';
import AddBookForm from '../components/AddBookForm';
import BookCard from '../components/BookCard';
import Modal from '../components/Modal';
import { useToast } from '../components/Toaster';
import { useLanguage } from '../i18n/LanguageContext';
import { useApi } from '../hooks/useApi';

const LIMIT = 20;

export default function Library() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReadStatus>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);

  const fetchBooks = useCallback(() => booksApi.getAll(page, LIMIT), [page]);
  const fetchReads = useCallback(() => readsApi.getAll(), []);

  const { data: booksPage, loading: booksLoading, refetch: refetchBooks } = useApi<BooksPage>(fetchBooks);
  const { data: reads, loading: readsLoading, refetch: refetchReads } = useApi<Read[]>(fetchReads);

  const STATUS_FILTERS: { value: 'all' | ReadStatus; label: string }[] = [
    { value: 'all',      label: t.library.filters.all },
    { value: 'reading',  label: t.library.filters.reading },
    { value: 'finished', label: t.library.filters.finished },
    { value: 'wishlist', label: t.library.filters.wishlist },
    { value: 'dropped',  label: t.library.filters.dropped },
  ];

  const readsByBookId = new Map(reads?.map((r) => [r.book._id, r]) ?? []);

  const filtered = (booksPage?.books ?? []).filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const read = readsByBookId.get(b._id);
    const matchStatus = statusFilter === 'all' || read?.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const loading = booksLoading || readsLoading;
  const totalPages = booksPage?.pages ?? 1;

  const goTo = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {showAddModal && (
        <Modal title={t.library.add} onClose={() => setShowAddModal(false)}>
          <AddBookForm onSuccess={() => { setShowAddModal(false); refetchBooks(); refetchReads(); toast(t.toast.bookAdded); }} />
        </Modal>
      )}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl mb-1">{t.library.title}</h1>
          <p className="text-parchment">{booksPage?.total ?? '—'} {t.library.bookCount} ✨</p>
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
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="w-full bg-dusk border border-mist/30 rounded-lg px-4 py-2.5 text-cream placeholder:text-stone text-sm outline-none focus:border-mist/70 mb-4"
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => { setStatusFilter(value); setPage(1); }}
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            className="text-xs px-3 py-1.5 rounded-full bg-bark text-parchment hover:bg-mist/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goTo(p)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                p === page ? 'bg-wine text-cream' : 'bg-bark text-parchment hover:bg-mist/30'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages}
            className="text-xs px-3 py-1.5 rounded-full bg-bark text-parchment hover:bg-mist/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
