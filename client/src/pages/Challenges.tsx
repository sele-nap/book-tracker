import { useEffect, useState } from 'react';
import useSWR from 'swr';
import type { Challenge } from '../api/challenges';
import { challengesApi } from '../api/challenges';
import ApiError from '../components/ApiError';
import ChallengeAddBookModal from '../components/ChallengeAddBookModal';
import ChallengeCard from '../components/ChallengeCard';
import CreateChallengeForm from '../components/CreateChallengeForm';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { ChallengesSkeleton } from '../components/Skeleton';
import { useLanguage } from '../hooks/useLanguage';

export default function Challenges() {
  const { t } = useLanguage();
  const [showCreate, setShowCreate] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(
    null,
  );

  const {
    data: challenges,
    isLoading: loading,
    error: challengesErr,
    mutate: refetch,
  } = useSWR<Challenge[]>('/challenges', challengesApi.getAll);

  useEffect(() => {
    document.title = `${t.challenges.title} — Book Tracker`;
  }, [t]);

  const handleUpdate = () => {
    refetch();
    if (activeChallenge) {
      const updated = challenges?.find((c) => c._id === activeChallenge._id);
      if (updated) setActiveChallenge(updated);
    }
  };

  return (
    <div>
      {showCreate && (
        <Modal title={t.challenges.create} onClose={() => setShowCreate(false)}>
          <CreateChallengeForm
            onSuccess={() => {
              setShowCreate(false);
              refetch();
            }}
          />
        </Modal>
      )}

      {activeChallenge && (
        <ChallengeAddBookModal
          challenge={activeChallenge}
          onClose={() => setActiveChallenge(null)}
          onUpdate={handleUpdate}
        />
      )}

      <div className="flex flex-wrap items-start justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl mb-1">{t.challenges.title}</h1>
          <p className="text-parchment">{t.challenges.subtitle}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-wine hover:bg-rose text-night font-medium text-sm px-5 py-2 rounded-full transition-all duration-200 hover:scale-105 font-body"
        >
          {t.challenges.new}
        </button>
      </div>

      {loading ? (
        <ChallengesSkeleton />
      ) : challengesErr ? (
        <ApiError
          message={challengesErr?.message ?? 'Unknown error'}
          onRetry={refetch}
        />
      ) : !challenges?.length ? (
        <EmptyState message={t.challenges.noChallenges} variant="moon" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
          {challenges.map((c) => (
            <ChallengeCard
              key={c._id}
              challenge={c}
              onAddBook={() => setActiveChallenge(c)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
