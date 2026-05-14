import { useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import './LanguageToggle.css';

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const next = locale === 'fr' ? 'en' : 'fr';
    setLocale(next);
    if (containerRef.current) createMagicParticles(containerRef.current);
  };

  const createMagicParticles = (container: HTMLElement) => {
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'magic-particle';
      const angle = (i / 8) * Math.PI * 2;
      const distance = 30 + Math.random() * 20;
      particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
      container.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    }
  };

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        onClick={handleToggle}
        aria-label={`Switch to ${locale === 'fr' ? 'English' : 'French'}`}
        className="flex w-fit cursor-pointer appearance-none rounded-full border border-moss/60 p-0.5 relative z-[1] shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition-[border-color,box-shadow] duration-300 hover:border-wine hover:shadow-[0_4px_15px_rgba(122,45,62,0.3)]"
        style={{
          background:
            'linear-gradient(135deg, rgba(42,35,48,0.8), rgba(58,92,58,0.5))',
        }}
      >
        {(['fr', 'en'] as const).map((l) => (
          <span
            key={l}
            className={`pointer-events-none relative px-2.5 py-0.5 font-mono text-[0.625rem] font-semibold uppercase tracking-wider transition-all duration-300 ${
              locale === l
                ? 'rounded-full bg-wine/50 text-cream [text-shadow:0_0_6px_rgba(196,154,80,0.4)]'
                : 'text-stone'
            }`}
          >
            {l}
          </span>
        ))}
      </button>
    </div>
  );
}
