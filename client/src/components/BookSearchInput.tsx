import { CircleNotch } from '@phosphor-icons/react';
import { useEffect, useId, useState } from 'react';
import type { BookSearchResult } from '../api/bookSearch';
import { searchBooks } from '../api/bookSearch';
import { useDebounce } from '../hooks/useDebounce';
import SearchResultCover from './SearchResultCover';

const inputClass =
  'w-full bg-bark border border-mist/40 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm focus:border-mist/70 transition-colors';

const SOURCE_LABEL: Record<BookSearchResult['source'], string> = {
  ol: 'OL',
  gb: 'GB',
  bnf: 'BnF',
};
const SOURCE_CLASS: Record<BookSearchResult['source'], string> = {
  ol: 'bg-mist/30 text-parchment',
  gb: 'bg-fern/20 text-fern',
  bnf: 'bg-amber/20 text-amber',
};

type Props = {
  label: string;
  onSelect: (result: BookSearchResult) => void;
};

export default function BookSearchInput({ label, onSelect }: Props) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [fetchedFor, setFetchedFor] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  const trimmed = debouncedQuery.trim();
  const searching =
    query.trim() !== '' && (query !== debouncedQuery || fetchedFor !== trimmed);
  const visibleResults = trimmed ? results : [];

  useEffect(() => {
    if (!trimmed) return;
    let cancelled = false;
    searchBooks(trimmed)
      .then((r) => {
        if (!cancelled) {
          setResults(r);
          setFetchedFor(trimmed);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResults([]);
          setFetchedFor(trimmed);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [trimmed]);

  const handleSelect = (result: BookSearchResult) => {
    onSelect(result);
    setQuery('');
  };

  return (
    <div>
      <label htmlFor={id} className="block text-xs text-parchment mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={inputClass}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
          placeholder="The Name of the Wind…"
        />
        {searching && (
          <span
            aria-hidden="true"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone"
          >
            <CircleNotch size={11} weight="light" className="animate-spin" />
          </span>
        )}
      </div>

      {visibleResults.length > 0 && (
        <div className="mt-2 border border-mist/20 rounded-lg overflow-hidden divide-y divide-mist/10">
          {visibleResults.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => handleSelect(r)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-bark/60 transition-colors text-left"
            >
              <SearchResultCover coverUrl={r.coverUrl} />
              <div className="min-w-0 flex-1">
                <p className="text-cream text-xs font-display truncate">
                  {r.title}
                </p>
                <p className="text-stone text-xs">
                  {r.author}
                  {r.year ? ` · ${r.year}` : ''}
                </p>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${SOURCE_CLASS[r.source]}`}
              >
                {SOURCE_LABEL[r.source]}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
