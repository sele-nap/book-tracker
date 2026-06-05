import { CircleNotch } from '@phosphor-icons/react';
import { useState } from 'react';
import type { Read } from '../api/books.js';
import { readsApi } from '../api/books.js';
import { useLanguage } from '../hooks/useLanguage.js';
import { useToast } from '../hooks/useToast.js';

export default function BookReview({
  read,
  onSaved,
}: {
  read: Read | null | undefined;
  onSaved: () => void;
}) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [reviewText, setReviewText] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const currentReview = reviewText ?? read?.review ?? '';
  const isDirty = reviewText !== null && reviewText !== (read?.review ?? '');

  const handleSave = async () => {
    if (!read) return;
    setSaving(true);
    await readsApi.update(read._id, { review: currentReview });
    setSaving(false);
    onSaved();
    toast(t.toast.reviewSaved);
  };

  return (
    <div className="mt-8 bg-dusk border border-mist/30 rounded-xl p-5">
      <label
        htmlFor="book-review"
        className="block text-parchment text-sm mb-3"
      >
        {t.bookDetail.review}
      </label>
      <textarea
        id="book-review"
        value={currentReview}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder={t.bookDetail.reviewPlaceholder}
        rows={5}
        className="w-full bg-bark border border-mist/40 rounded-lg px-3 py-2 text-cream placeholder:text-stone text-sm outline-none focus:border-mist/60 transition-colors resize-none"
      />
      {isDirty && (
        <button
          onClick={handleSave}
          disabled={saving}
          aria-busy={saving}
          className="mt-2 text-xs bg-wine hover:bg-rose text-cream px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? (
            <CircleNotch
              size={12}
              weight="light"
              className="animate-spin"
              aria-hidden="true"
            />
          ) : (
            t.bookDetail.saveReview
          )}
        </button>
      )}
    </div>
  );
}
