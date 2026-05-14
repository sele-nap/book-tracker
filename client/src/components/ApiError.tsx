type Props = { message: string; onRetry?: () => void };

export default function ApiError({ message, onRetry }: Props) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 mt-20 text-center"
    >
      <p className="text-blush text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-parchment hover:text-cream border border-mist/40 hover:border-mist/70 rounded-lg px-3 py-1.5 transition-colors"
        >
          retry
        </button>
      )}
    </div>
  );
}
