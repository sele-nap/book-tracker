import { CircleNotch } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import type { Book, Read } from '../api/books';
import { booksApi, readsApi } from '../api/books';
import BookMeta from '../components/BookMeta';
import BookReview from '../components/BookReview';
import ConfirmModal from '../components/ConfirmModal';
import EditBookForm from '../components/EditBookForm';
import Modal from '../components/Modal';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    data: book,
    error: bookErr,
    isLoading: bookLoading,
    mutate: refetchBook,
  } = useSWR<Book>(id ? ['/books', id] : null, () => booksApi.getById(id!));
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

  const handleDelete = async () => {
    if (!book) return;
    setDeleting(true);
    await booksApi.delete(book._id);
    toast(t.toast.bookDeleted);
    navigate('/');
  };

  if (bookLoading)
    return (
      <div className="flex justify-center mt-16">
        <CircleNotch
          size={20}
          weight="light"
          className="animate-spin text-stone"
        />
      </div>
    );

  if (bookErr || !book)
    return (
      <div className="flex flex-col items-center mt-16 gap-4">
        <p className="text-parchment">{t.bookDetail.notFound}</p>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-stone hover:text-cream transition-colors"
        >
          {t.bookDetail.back}
        </button>
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
              toast(t.toast.bookUpdated);
            }}
          />
        </Modal>
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title={t.bookDetail.delete}
          message={t.bookDetail.confirmDelete}
          confirmLabel={t.bookDetail.delete}
          cancelLabel={t.settings.cancel}
          onConfirm={handleDelete}
          onClose={() => setShowDeleteConfirm(false)}
          loading={deleting}
          danger
        />
      )}

      <BookMeta
        book={book}
        read={read}
        onEdit={() => setShowEdit(true)}
        onDelete={() => setShowDeleteConfirm(true)}
        deleting={deleting}
      />

      <BookReview read={read} onSaved={() => refetchRead()} />
    </div>
  );
}
