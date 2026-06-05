import { Book, Check, CircleNotch, Flame } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Read } from '../api/books';
import { readsApi } from '../api/books';
import ApiError from '../components/ApiError';
import EmptyState from '../components/EmptyState';
import { ReadingSkeleton } from '../components/Skeleton';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';

function ProgressBar({
  current,
  total,
  bookTitle,
}: {
  current: number;
  total: number;
  bookTitle: string;
}) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div>
      <div
        className="flex justify-between text-xs text-stone mb-1"
        aria-hidden="true"
      >
        <span>
          {current} / {total} p.
        </span>
        <span>{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Reading progress for ${bookTitle}: ${pct}%`}
        className="h-1.5 bg-bark rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-gradient-to-r from-wine to-blush rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ReadingCard({ read, onUpdate }: { read: Read; onUpdate: () => void }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [pageInput, setPageInput] = useState(String(read.currentPage ?? ''));
  const [saving, setSaving] = useState(false);
  const pageInputId = `page-input-${read._id}`;

  const savePage = async () => {
    const p = parseInt(pageInput);
    if (isNaN(p)) return;
    setSaving(true);
    await readsApi.update(read._id, { currentPage: p });
    setSaving(false);
    onUpdate();
    toast(t.toast.pageSaved);
  };

  const markAs = async (status: 'finished' | 'dropped') => {
    await readsApi.update(read._id, {
      status,
      finishedAt: status === 'finished' ? new Date().toISOString() : undefined,
    });
    onUpdate();
    toast(
      status === 'finished' ? t.toast.markedFinished : t.toast.markedDropped,
    );
  };

  const book = read.book;
  const hasPages = !!book.pages;

  return (
    <div className="bg-dusk border border-mist/30 rounded-xl p-5 flex gap-4">
      <Link
        to={`/books/${book._id}`}
        aria-label={book.title}
        className="w-14 h-20 bg-bark rounded-lg shrink-0 flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity"
      >
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        ) : (
          <Book
            size={22}
            weight="light"
            className="opacity-20 text-parchment"
          />
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <h3 className="font-display text-cream text-sm leading-snug truncate">
          {book.title}
        </h3>
        <p className="text-stone text-xs mt-0.5">{book.author}</p>

        {read.startedAt && (
          <p className="text-stone text-xs mt-1 flex items-center gap-1">
            <Flame size={11} weight="light" aria-hidden="true" />
            {new Date(read.startedAt).toLocaleDateString()}
          </p>
        )}

        <div className="mt-3 space-y-3">
          {hasPages && (
            <ProgressBar
              current={read.currentPage ?? 0}
              total={book.pages!}
              bookTitle={book.title}
            />
          )}

          <div className="flex gap-2 items-center">
            <label htmlFor={pageInputId} className="sr-only">
              {t.reading.currentPage}
            </label>
            <input
              id={pageInputId}
              type="number"
              min={0}
              max={book.pages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder={t.reading.currentPage}
              className="w-24 bg-bark border border-mist/40 rounded-lg px-2 py-1 text-cream text-xs outline-none focus:border-mist/60"
            />
            <button
              onClick={savePage}
              disabled={saving}
              aria-busy={saving}
              className="text-xs bg-bark border border-mist/40 rounded-lg px-3 py-1 text-parchment hover:text-cream transition-colors"
            >
              {saving ? (
                <CircleNotch
                  size={12}
                  weight="light"
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                t.reading.save
              )}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => markAs('finished')}
              className="text-xs px-3 py-1 rounded-full bg-wine/20 text-blush hover:bg-wine/40 transition-colors"
            >
              <Check size={12} weight="light" aria-hidden="true" />{' '}
              {t.reading.markFinished}
            </button>
            <button
              onClick={() => markAs('dropped')}
              className="text-xs px-3 py-1 rounded-full bg-stone/10 text-stone hover:bg-stone/20 transition-colors"
            >
              — {t.reading.markDropped}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Reading() {
  const { t } = useLanguage();
  const fetchReads = useCallback(() => readsApi.byStatus('reading'), []);
  const { data: reads, loading, error, refetch } = useApi<Read[]>(fetchReads);

  useEffect(() => {
    document.title = `${t.reading.title} — Book Tracker`;
  }, [t]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl mb-1">{t.reading.title}</h1>
        <p className="text-parchment">{t.reading.subtitle}</p>
      </div>

      {loading ? (
        <ReadingSkeleton />
      ) : error ? (
        <ApiError message={error} onRetry={refetch} />
      ) : !reads?.length ? (
        <EmptyState message={t.reading.empty} variant="candle" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reads.map((read) => (
            <ReadingCard key={read._id} read={read} onUpdate={refetch} />
          ))}
        </div>
      )}
    </div>
  );
}
