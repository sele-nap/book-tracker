import { Book as BookIcon, CircleNotch } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import type { Book, Read } from '../api/books';
import { booksApi, readsApi } from '../api/books';
import EditBookForm from '../components/EditBookForm';
import Modal from '../components/Modal';
import StarRating from '../components/StarRating';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';

const labelClass = 'text-xs text-stone uppercase tracking-widest';
const valueClass = 'text-cream text-sm mt-0.5';

const statusStyles = {
  reading: 'bg-sage/20 text-sage',
  finished: 'bg-wine/20 text-blush',
  dropped: 'bg-stone/20 text-stone',
  wishlist: 'bg-amber/20 text-amber',
};

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [showEdit, setShowEdit] = useState(false);
  const [reviewText, setReviewText] = useState<string | null>(null);
  const [savingReview, setSavingReview] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: book, mutate: refetchBook } = useSWR<Book>(
    id ? ['/books', id] : null,
    () => booksApi.getById(id!),
  );
  const { data: read, mutate: refetchRead } = useSWR<Read | null>(
    id ? ['/reads/book', id] : null,
    () =>
      readsApi.byBook(id!).catch((err: unknown) => {
        if (
          err instanceof Error &&
          'status' in err &&
          (err as { status: number }).status === 404
        )
          return null;
        throw err;
      }),
  );

  useEffect(() => {
    if (book) document.title = `${book.title} — Book Tracker`;
    return () => {
      document.title = 'Book Tracker';
    };
  }, [book]);

  const currentReview = reviewText ?? read?.review ?? '';

  const handleSaveReview = async () => {
    if (!read) return;
    setSavingReview(true);
    await readsApi.update(read._id, { review: currentReview });
    setSavingReview(false);
    refetchRead();
    toast(t.toast.reviewSaved);
  };

  const handleDelete = async () => {
    if (!book || !window.confirm(t.bookDetail.confirmDelete)) return;
    setDeleting(true);
    if (read) await readsApi.delete(read._id);
    await booksApi.delete(book._id);
    toast(t.toast.bookDeleted);
    navigate('/');
  };

  if (!book)
    return (
      <div className="flex justify-center mt-16">
        <CircleNotch
          size={20}
          weight="light"
          className="animate-spin text-stone"
        />
      </div>
    );

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="text-parchment hover:text-cream text-sm mb-8 transition-colors"
      >
        {t.bookDetail.back}
      </button>

      {showEdit && (
        <Modal title={t.bookDetail.edit} onClose={() => setShowEdit(false)}>
          <EditBookForm
            book={book}
            read={read ?? undefined}
            onSuccess={() => {
              setShowEdit(false);
              refetchBook();
              refetchRead();
              setReviewText(null);
              toast(t.toast.bookUpdated);
            }}
          />
        </Modal>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="shrink-0">
          <div className="w-40 h-56 bg-bark rounded-xl overflow-hidden">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookIcon
                  size={36}
                  weight="light"
                  className="opacity-20 text-parchment"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-display text-cream leading-tight">
                {book.title}
              </h1>
              <p className="text-parchment mt-1">{book.author}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setShowEdit(true)}
                className="text-xs text-parchment hover:text-cream border border-mist/30 hover:border-mist/60 rounded-lg px-3 py-1.5 transition-colors"
              >
                {t.bookDetail.edit}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs text-stone hover:text-blush border border-mist/40 hover:border-blush/40 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
              >
                {t.bookDetail.delete}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {read && (
              <span
                className={`text-xs px-2.5 py-1 rounded-full ${statusStyles[read.status]}`}
              >
                {t.status[read.status]}
              </span>
            )}
            {book.language && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-mist/20 text-parchment">
                {t.bookLanguage[book.language]}
              </span>
            )}
            {book.genre.map((g) => (
              <span
                key={g}
                className="text-xs px-2.5 py-1 rounded-full bg-bark text-parchment/60"
              >
                {g}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {book.pages && (
              <div>
                <p className={labelClass}>{t.bookDetail.pages}</p>
                <p className={valueClass}>{book.pages}</p>
              </div>
            )}
            {book.publishedYear && (
              <div>
                <p className={labelClass}>{t.bookDetail.publishedIn}</p>
                <p className={valueClass}>{book.publishedYear}</p>
              </div>
            )}
            {read?.rating && (
              <div>
                <p className={labelClass}>{t.form.rating}</p>
                <p className={valueClass}>
                  <StarRating value={read.rating} />
                </p>
              </div>
            )}
            {read?.currentPage && book.pages && (
              <div>
                <p className={labelClass}>{t.reading.currentPage}</p>
                <p className={valueClass}>
                  {read.currentPage} / {book.pages}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-dusk border border-mist/30 rounded-xl p-5">
        <label
          htmlFor="book-review"
          className="block text-parchment text-sm mb-3"
        >
          {t.bookDetail.review}
        </label>
        <textarea
          id="book-review"
          value={currentReview}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder={t.bookDetail.reviewPlaceholder}
          rows={5}
          className="w-full bg-bark border border-mist/40 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm outline-none focus:border-mist/60 transition-colors resize-none"
        />
        {reviewText !== null && reviewText !== (read?.review ?? '') && (
          <button
            onClick={handleSaveReview}
            disabled={savingReview}
            aria-busy={savingReview}
            className="mt-2 text-xs bg-wine hover:bg-rose text-cream px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {savingReview ? (
              <CircleNotch
                size={12}
                weight="light"
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              t.bookDetail.saveReview
            )}
          </button>
        )}
      </div>
    </div>
  );
}
