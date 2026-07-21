import Modal from './Modal';

type Props = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
  danger?: boolean;
};

export default function ConfirmModal({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
  loading,
  danger = false,
}: Props) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="text-parchment text-sm mb-6">{message}</p>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-stone hover:text-parchment transition-colors px-4 py-2"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
            danger
              ? 'bg-rose-800/60 hover:bg-rose-700/60 text-cream'
              : 'bg-wine/80 hover:bg-wine text-night'
          }`}
        >
          {loading ? '…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
