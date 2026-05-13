import { useCallback, useState } from 'react';
import { readsApi } from '../api/books';
import type { Read } from '../api/books';
import { useLanguage } from '../i18n/LanguageContext';
import { useApi } from '../hooks/useApi';

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs text-stone mb-1">
        <span>{current} / {total} p.</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-bark rounded-full overflow-hidden">
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
  const [pageInput, setPageInput] = useState(String(read.currentPage ?? ''));
  const [saving, setSaving] = useState(false);

  const savePage = async () => {
    const p = parseInt(pageInput);
    if (isNaN(p)) return;
    setSaving(true);
    await readsApi.update(read._id, { currentPage: p });
    setSaving(false);
    onUpdate();
  };

  const markAs = async (status: 'finished' | 'dropped') => {
    await readsApi.update(read._id, {
      status,
      finishedAt: status === 'finished' ? new Date().toISOString() : undefined,
    });
    onUpdate();
  };

  const book = read.book;
  const hasPages = !!book.pages;

  return (
    <div className="bg-dusk border border-mist/30 rounded-xl p-5 flex gap-4">
      <div className="w-14 h-20 bg-bark rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
        {book.coverUrl
          ? <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
          : <span className="text-2xl opacity-30">📖</span>
        }
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-display text-cream text-sm leading-snug truncate">{book.title}</h3>
        <p className="text-stone text-xs mt-0.5">{book.author}</p>

        {read.startedAt && (
          <p className="text-stone text-xs mt-1">
            🕯️ {new Date(read.startedAt).toLocaleDateString()}
          </p>
        )}

        <div className="mt-3 space-y-3">
          {hasPages && (
            <ProgressBar current={read.currentPage ?? 0} total={book.pages!} />
          )}

          <div className="flex gap-2 items-center">
            <input
              type="number"
              min={0}
              max={book.pages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder={t.reading.currentPage}
              className="w-24 bg-bark border border-mist/20 rounded-lg px-2 py-1 text-cream text-xs outline-none focus:border-mist/50"
            />
            <button
              onClick={savePage}
              disabled={saving}
              className="text-xs bg-bark border border-mist/20 rounded-lg px-3 py-1 text-parchment hover:text-cream transition-colors"
            >
              {saving ? '✦' : t.reading.save}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => markAs('finished')}
              className="text-xs px-3 py-1 rounded-full bg-wine/20 text-blush hover:bg-wine/40 transition-colors"
            >
              ✦ {t.reading.markFinished}
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
  const { data: reads, loading, refetch } = useApi<Read[]>(fetchReads);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl mb-1">{t.reading.title}</h1>
        <p className="text-parchment">{t.reading.subtitle}</p>
      </div>

      {loading ? (
        <p className="text-stone text-center mt-16">✦</p>
      ) : !reads?.length ? (
        <p className="text-stone text-center mt-16">{t.reading.empty}</p>
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
