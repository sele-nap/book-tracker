export default function LibraryPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="text-xs px-3 py-1.5 rounded-full bg-bark text-parchment hover:bg-mist/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ←
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          aria-label={`Go to page ${p}`}
          aria-current={p === page ? 'page' : undefined}
          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
            p === page
              ? 'bg-wine text-cream'
              : 'bg-bark text-parchment hover:bg-mist/30'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="text-xs px-3 py-1.5 rounded-full bg-bark text-parchment hover:bg-mist/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        →
      </button>
    </div>
  );
}
