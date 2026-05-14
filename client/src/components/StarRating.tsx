type Props = { value: number; max?: number };

export default function StarRating({ value, max = 5 }: Props) {
  return (
    <span aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={i < value ? 'text-amber' : 'text-mist'}
        >
          ★
        </span>
      ))}
    </span>
  );
}
