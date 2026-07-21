import { useEffect, useState } from 'react';
import useSWR from 'swr';
import type { Shelf } from '../api/shelves';
import { shelvesApi } from '../api/shelves';
import ApiError from '../components/ApiError';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import ManageShelfModal from '../components/ManageShelfModal';
import Modal from '../components/Modal';
import ShelfCard from '../components/ShelfCard';
import { ShelvesSkeleton } from '../components/Skeleton';
import { useLanguage } from '../hooks/useLanguage';

export default function Shelves() {
  const { t } = useLanguage();
  const [showCreate, setShowCreate] = useState(false);
  const [activeShelf, setActiveShelf] = useState<Shelf | null>(null);
  const [shelfToDelete, setShelfToDelete] = useState<Shelf | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const {
    data: shelves,
    isLoading: loading,
    error: shelvesErr,
    mutate: refetch,
  } = useSWR<Shelf[]>('/shelves', shelvesApi.getAll);

  useEffect(() => {
    document.title = `${t.shelves.title} — Book Tracker`;
  }, [t]);

  const createShelf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await shelvesApi.create({ name, description: description || undefined });
    setName('');
    setDescription('');
    setShowCreate(false);
    refetch();
  };

  const deleteShelf = async () => {
    if (!shelfToDelete) return;
    await shelvesApi.delete(shelfToDelete._id);
    setShelfToDelete(null);
    refetch();
  };

  const handleUpdate = () => {
    refetch();
    if (activeShelf) {
      const updated = shelves?.find((s) => s._id === activeShelf._id);
      if (updated) setActiveShelf(updated);
    }
  };

  return (
    <div>
      {shelfToDelete && (
        <ConfirmModal
          title={t.shelves.confirmDelete}
          message={shelfToDelete.name}
          confirmLabel={t.shelves.confirmDeleteLabel}
          cancelLabel={t.settings.cancel}
          danger
          onConfirm={deleteShelf}
          onClose={() => setShelfToDelete(null)}
        />
      )}

      {showCreate && (
        <Modal title={t.shelves.create} onClose={() => setShowCreate(false)}>
          <form onSubmit={createShelf} className="space-y-4">
            <div>
              <label
                htmlFor="shelf-name"
                className="block text-xs text-parchment mb-1"
              >
                {t.shelves.name} *
              </label>
              <input
                id="shelf-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.shelves.namePlaceholder}
                required
                className="w-full bg-bark border border-mist/40 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm focus:border-mist/50"
              />
            </div>
            <div>
              <label
                htmlFor="shelf-description"
                className="block text-xs text-parchment mb-1"
              >
                {t.shelves.description}
              </label>
              <input
                id="shelf-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.shelves.descriptionPlaceholder}
                className="w-full bg-bark border border-mist/40 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm focus:border-mist/50"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-wine hover:bg-rose text-night font-medium text-sm py-2.5 rounded-lg transition-colors"
            >
              {t.shelves.create}
            </button>
          </form>
        </Modal>
      )}

      {activeShelf && (
        <ManageShelfModal
          shelf={activeShelf}
          onClose={() => setActiveShelf(null)}
          onUpdate={handleUpdate}
        />
      )}

      <div className="flex flex-wrap items-start justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl mb-1">{t.shelves.title}</h1>
          <p className="text-parchment">{t.shelves.subtitle}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-wine hover:bg-rose text-night font-medium text-sm px-5 py-2 rounded-full transition-all duration-200 hover:scale-105 font-body"
        >
          {t.shelves.new}
        </button>
      </div>

      {loading ? (
        <ShelvesSkeleton />
      ) : shelvesErr ? (
        <ApiError
          message={shelvesErr?.message ?? 'Unknown error'}
          onRetry={refetch}
        />
      ) : !shelves?.length ? (
        <EmptyState message={t.shelves.noShelves} variant="mushroom" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {shelves.map((shelf) => (
            <ShelfCard
              key={shelf._id}
              shelf={shelf}
              onDelete={() => setShelfToDelete(shelf)}
              onOpen={() => setActiveShelf(shelf)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
