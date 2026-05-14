import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Read } from '../api/books';
import { readsApi } from '../api/books';
import ApiError from '../components/ApiError';
import EmptyState from '../components/EmptyState';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../i18n/LanguageContext';

const MONTHS_FR = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'];
const MONTHS_EN = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function readDuration(startedAt?: string, finishedAt?: string): number | null {
  if (!startedAt || !finishedAt) return null;
  const diff = new Date(finishedAt).getTime() - new Date(startedAt).getTime();
  return Math.max(1, Math.round(diff / 86400000));
}

function TimelineEntry({ read, locale }: { read: Read; locale: string }) {
  const { t } = useLanguage();
  const months = locale === 'fr' ? MONTHS_FR : MONTHS_EN;
  const finished = read.finishedAt ? new Date(read.finishedAt) : null;
  const duration = readDuration(read.startedAt, read.finishedAt);

  return (
    <div className="flex gap-4 group">
      {/* Timeline spine */}
      <div className="flex flex-col items-center shrink-0 w-10">
        <div className="w-2.5 h-2.5 rounded-full bg-wine mt-1.5 shrink-0 group-hover:bg-blush transition-colors" />
        <div className="w-px flex-1 bg-mist/20 mt-1" />
      </div>

      {/* Card */}
      <Link
        to={`/books/${read.book._id}`}
        className="flex gap-3 pb-6 flex-1 hover:opacity-80 transition-opacity"
      >
        {/* Date label */}
        <div className="shrink-0 w-10 text-right mt-0.5">
          {finished ? (
            <>
              <p className="text-stone text-xs leading-none">{months[finished.getMonth()]}</p>
              <p className="text-parchment text-sm font-display leading-tight">{finished.getDate()}</p>
            </>
          ) : (
            <p className="text-stone text-xs">{t.timeline.noDate}</p>
          )}
        </div>

        {/* Cover */}
        <div className="w-10 h-14 bg-bark rounded overflow-hidden shrink-0">
          {read.book.coverUrl ? (
            <img src={read.book.coverUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-base opacity-20">📖</div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-cream text-sm leading-snug truncate">{read.book.title}</h3>
          <p className="text-stone text-xs mt-0.5">{read.book.author}</p>

          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            {read.rating && (
              <span className="text-xs text-amber">
                {'★'.repeat(read.rating)}{'★'.repeat(5 - read.rating).split('').map(() => '☆').join('')}
              </span>
            )}
            {duration && (
              <span className="text-xs text-stone">
                {duration} {t.timeline.days}
              </span>
            )}
            {read.book.genre.slice(0, 2).map((g) => (
              <span key={g} className="text-xs text-parchment/50 bg-bark px-2 py-0.5 rounded-full">
                {g}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}

function YearGroup({ year, reads, locale }: { year: string; reads: Read[]; locale: string }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-display text-2xl text-cream">{year}</h2>
        <span className="text-stone text-xs">{reads.length} ✦</span>
      </div>
      <div>
        {reads.map((read) => (
          <TimelineEntry key={read._id} read={read} locale={locale} />
        ))}
      </div>
    </div>
  );
}

export default function Timeline() {
  const { t, locale } = useLanguage();
  const fetchTimeline = useCallback(() => readsApi.timeline(), []);
  const { data: reads, loading, error } = useApi<Read[]>(fetchTimeline);

  const grouped = (reads ?? []).reduce<Record<string, Read[]>>((acc, read) => {
    const year = read.finishedAt
      ? String(new Date(read.finishedAt).getFullYear())
      : 'unknown';
    (acc[year] ??= []).push(read);
    return acc;
  }, {});

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl mb-1">{t.timeline.title}</h1>
        <p className="text-parchment">{t.timeline.subtitle}</p>
      </div>

      {error ? (
        <ApiError message={error} onRetry={() => window.location.reload()} />
      ) : loading ? (
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="flex flex-col items-center w-10">
                <div className="w-2.5 h-2.5 rounded-full bg-bark mt-1.5" />
                <div className="w-px flex-1 bg-bark mt-1" />
              </div>
              <div className="flex gap-3 pb-6 flex-1">
                <div className="w-10 shrink-0" />
                <div className="w-10 h-14 bg-bark rounded shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-bark rounded w-3/4" />
                  <div className="h-2.5 bg-bark rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !reads?.length ? (
        <EmptyState message={t.timeline.empty} variant="book" />
      ) : (
        <div className="space-y-10">
          {years.map((year) => (
            <YearGroup key={year} year={year} reads={grouped[year]} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
