import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import {
  BookBookmark,
  CheckCircle,
  List,
  Minus,
  Moon,
} from '@phosphor-icons/react';
import type { ReadStatus } from '../api/books.js';
import { useLanguage } from '../hooks/useLanguage.js';

const STATUS_ICONS: Record<'all' | ReadStatus, PhosphorIcon> = {
  all: List,
  reading: BookBookmark,
  finished: CheckCircle,
  wishlist: Moon,
  dropped: Minus,
};

export default function LibraryFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: 'all' | ReadStatus;
  onStatusChange: (v: 'all' | ReadStatus) => void;
}) {
  const { t } = useLanguage();

  const filters = [
    { value: 'all', label: t.library.filters.all },
    { value: 'reading', label: t.library.filters.reading },
    { value: 'finished', label: t.library.filters.finished },
    { value: 'wishlist', label: t.library.filters.wishlist },
    { value: 'dropped', label: t.library.filters.dropped },
  ] as { value: 'all' | ReadStatus; label: string }[];

  return (
    <>
      <label htmlFor="library-search" className="sr-only">
        {t.library.search}
      </label>
      <input
        id="library-search"
        type="search"
        placeholder={t.library.search}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-dusk border border-mist/40 rounded-lg px-4 py-2.5 text-cream placeholder:text-stone text-sm focus:border-mist/70 mb-4"
      />

      <div
        role="group"
        aria-label="Filter by status"
        className="flex flex-wrap gap-2 mb-8"
      >
        {filters.map(({ value, label }) => {
          const Icon = STATUS_ICONS[value];
          return (
            <button
              key={value}
              onClick={() => onStatusChange(value)}
              aria-pressed={statusFilter === value}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
                statusFilter === value
                  ? 'bg-wine text-cream'
                  : 'bg-bark text-parchment hover:bg-mist/30'
              }`}
            >
              <Icon size={12} weight="light" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>
    </>
  );
}
