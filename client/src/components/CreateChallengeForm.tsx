import { CircleNotch } from '@phosphor-icons/react';
import { useState } from 'react';
import { challengesApi } from '../api/challenges';
import { useLanguage } from '../hooks/useLanguage';
import GenreTagInput from './GenreTagInput';

export default function CreateChallengeForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const { t } = useLanguage();
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [goal, setGoal] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;
    setLoading(true);
    await challengesApi.create({
      year: parseInt(year),
      goalBooks: parseInt(goal),
      targetGenres: genres,
    });
    setLoading(false);
    onSuccess();
  };

  const inputClass =
    'w-full bg-bark border border-mist/40 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm focus:border-mist/50';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="challenge-year"
            className="block text-xs text-parchment mb-1"
          >
            {t.challenges.year}
          </label>
          <input
            id="challenge-year"
            className={inputClass}
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="challenge-goal"
            className="block text-xs text-parchment mb-1"
          >
            {t.challenges.goal} *
          </label>
          <input
            id="challenge-goal"
            className={inputClass}
            type="number"
            min={1}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="52"
            required
          />
        </div>
      </div>

      <GenreTagInput
        label={t.challenges.targetGenres}
        genres={genres}
        onChange={setGenres}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-wine hover:bg-rose disabled:opacity-50 text-cream text-sm py-2.5 rounded-lg transition-colors"
      >
        {loading ? (
          <CircleNotch
            size={14}
            weight="light"
            className="animate-spin mx-auto"
          />
        ) : (
          t.challenges.create
        )}
      </button>
    </form>
  );
}
