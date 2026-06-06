import { useId, useState } from 'react';

const inputClass =
  'w-full bg-bark border border-mist/40 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm focus-visible:outline-none focus:border-mist/70 transition-colors';

type Props = {
  label: string;
  genres: string[];
  onChange: (genres: string[]) => void;
};

export default function GenreTagInput({ label, genres, onChange }: Props) {
  const id = useId();
  const [input, setInput] = useState('');

  const add = () => {
    const g = input.trim().toLowerCase();
    if (g && !genres.includes(g)) onChange([...genres, g]);
    setInput('');
  };

  const remove = (g: string) => onChange(genres.filter((x) => x !== g));

  return (
    <div>
      <label htmlFor={id} className="block text-xs text-parchment mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          className={inputClass}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder="fantasy…"
        />
        <button
          type="button"
          onClick={add}
          aria-label="Add genre"
          className="text-xs bg-bark border border-mist/40 rounded-lg px-3 text-parchment hover:text-cream transition-colors"
        >
          +
        </button>
      </div>
      {genres.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {genres.map((g) => (
            <span
              key={g}
              className="flex items-center gap-1 text-xs bg-mist/20 text-parchment px-2 py-0.5 rounded-full"
            >
              {g}
              <button
                type="button"
                onClick={() => remove(g)}
                aria-label={`Remove genre ${g}`}
                className="text-stone hover:text-cream"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
