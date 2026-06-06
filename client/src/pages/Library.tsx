import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import type { BooksPage, Read, ReadStatus } from '../api/books';
import { booksApi, readsApi } from '../api/books';
import AddBookForm from '../components/AddBookForm';
import ApiError from '../components/ApiError';
import BookCard from '../components/BookCard';
import EmptyState from '../components/EmptyState';
import LibraryFilters from '../components/LibraryFilters';
import LibraryPagination from '../components/LibraryPagination';
import Modal from '../components/Modal';
import { LibrarySkeleton } from '../components/Skeleton';
import { useDebounce } from '../hooks/useDebounce';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';

const LIMIT = 20;

export default function Library() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReadStatus>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    document.title = `${t.library.title} — Book Tracker`;
  }, [t]);

  const {
    data: booksPage,
    isLoading: booksLoading,
    error: booksErr,
    mutate: refetchBooks,
  } = useSWR<BooksPage>(['/books', page, debouncedSearch], () =>
    booksApi.getAll(page, LIMIT, debouncedSearch || undefined),
  );
  const {
    data: reads,
    isLoading: readsLoading,
    mutate: refetchReads,
  } = useSWR<Read[]>('/reads', readsApi.getAll);

  const readsByBookId = useMemo(
    () => new Map(reads?.map((r) => [r.book._id, r]) ?? []),
    [reads],
  );
  const books = (booksPage?.books ?? []).filter(
    (b) =>
      statusFilter === 'all' ||
      readsByBookId.get(b._id)?.status === statusFilter,
  );

  const loading = booksLoading || readsLoading;

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {showAddModal && (
        <Modal title={t.library.add} onClose={() => setShowAddModal(false)}>
          <AddBookForm
            onSuccess={() => {
              setShowAddModal(false);
              refetchBooks();
              refetchReads();
              toast(t.toast.bookAdded);
            }}
          />
        </Modal>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl mb-1">{t.library.title}</h1>
          <p className="text-parchment">
            {booksPage?.total ?? '—'} {t.library.bookCount} ✨
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-wine hover:bg-rose text-cream text-sm px-5 py-2 rounded-full transition-all duration-200 hover:scale-105 font-body"
        >
          {t.library.add}
        </button>
      </div>

      <LibraryFilters
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(v) => {
          setStatusFilter(v);
          setPage(1);
        }}
      />

      {loading ? (
        <LibrarySkeleton />
      ) : booksErr ? (
        <ApiError
          message={booksErr?.message ?? 'Unknown error'}
          onRetry={() => refetchBooks()}
        />
      ) : books.length === 0 ? (
        <EmptyState message={t.library.empty} variant="book" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-fade-in">
          {books.map((book) => {
            const read = readsByBookId.get(book._id);
            return (
              <Link
                key={book._id}
                to={`/books/${book._id}`}
                aria-label={`${book.title} by ${book.author}`}
              >
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

      <LibraryPagination
        page={page}
        totalPages={booksPage?.pages ?? 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
