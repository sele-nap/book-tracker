import { useEffect, useId, useRef } from 'react';

type Props = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ title, onClose, children }: Props) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener('keydown', onKey);
    // focus the first focusable element on open
    const first = dialogRef.current?.querySelector<HTMLElement>(
      'button,input,select,textarea,[tabindex]:not([tabindex="-1"])',
    );
    first?.focus();

    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-night/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-dusk border border-mist/30 rounded-2xl w-full max-w-lg mx-4 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id={titleId} className="text-xl font-display text-cream">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-stone hover:text-cream transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
