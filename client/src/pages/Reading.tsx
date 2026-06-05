import { useEffect } from 'react';
import useSWR from 'swr';
import type { Read } from '../api/books';
import { readsApi } from '../api/books';
import ApiError from '../components/ApiError';
import EmptyState from '../components/EmptyState';
import ReadingCard from '../components/ReadingCard';
import { ReadingSkeleton } from '../components/Skeleton';
import { useLanguage } from '../hooks/useLanguage';

export default function Reading() {
  const { t } = useLanguage();
  const {
    data: reads,
    isLoading: loading,
    error: readsErr,
    mutate: refetch,
  } = useSWR<Read[]>('/reads/status/reading', () =>
    readsApi.byStatus('reading'),
  );

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
      ) : readsErr ? (
        <ApiError
          message={readsErr?.message ?? 'Unknown error'}
          onRetry={() => refetch()}
        />
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
