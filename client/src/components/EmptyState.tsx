import type { ReactElement } from 'react';

type Variant = 'book' | 'candle' | 'moon' | 'mushroom';

const illustrations: Record<Variant, ReactElement> = {
  book: (
    <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
      <rect
        x="18"
        y="20"
        width="36"
        height="44"
        rx="4"
        fill="#313244"
        stroke="#585b70"
        strokeWidth="1.5"
      />
      <rect x="22" y="20" width="4" height="44" rx="2" fill="#585b70" />
      <line
        x1="30"
        y1="32"
        x2="48"
        y2="32"
        stroke="#585b70"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="38"
        x2="48"
        y2="38"
        stroke="#585b70"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="44"
        x2="42"
        y2="44"
        stroke="#585b70"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <text x="52" y="26" fontSize="10" fill="#fab387" opacity="0.7">
        ✦
      </text>
      <text x="14" y="22" fontSize="8" fill="#fab387" opacity="0.5">
        ✦
      </text>
      <text x="50" y="52" fontSize="7" fill="#fab387" opacity="0.4">
        ✦
      </text>
    </svg>
  ),
  candle: (
    <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
      <rect
        x="33"
        y="42"
        width="14"
        height="24"
        rx="3"
        fill="#313244"
        stroke="#585b70"
        strokeWidth="1.5"
      />
      <rect x="30" y="62" width="20" height="5" rx="2" fill="#585b70" />
      <line
        x1="40"
        y1="42"
        x2="40"
        y2="36"
        stroke="#a6adc8"
        strokeWidth="1.2"
      />
      <ellipse cx="40" cy="33" rx="4" ry="5" fill="#fab387" opacity="0.6" />
      <ellipse cx="40" cy="32" rx="2" ry="3" fill="#cdd6f4" opacity="0.8" />
      <text x="52" y="38" fontSize="9" fill="#fab387" opacity="0.5">
        ✦
      </text>
      <text x="20" y="44" fontSize="7" fill="#fab387" opacity="0.4">
        ✦
      </text>
      <text x="54" y="52" fontSize="6" fill="#fab387" opacity="0.3">
        ✦
      </text>
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
      <defs>
        <mask id="moon-crescent-mask">
          <rect width="80" height="80" fill="white" />

          <circle cx="50" cy="37" r="17" fill="black" />
        </mask>
        <radialGradient id="moon-glow" cx="35%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fab387" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#fab387" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle
        cx="37"
        cy="41"
        r="23"
        fill="url(#moon-glow)"
        mask="url(#moon-crescent-mask)"
      />

      <circle
        cx="37"
        cy="41"
        r="19"
        fill="#313244"
        stroke="#fab387"
        strokeWidth="1.2"
        strokeOpacity="0.7"
        mask="url(#moon-crescent-mask)"
      />

      <circle
        cx="50"
        cy="37"
        r="17"
        fill="none"
        stroke="#fab387"
        strokeWidth="0.6"
        strokeOpacity="0.25"
        mask="url(#moon-crescent-mask)"
      />

      <circle
        cx="30"
        cy="43"
        r="2.5"
        fill="none"
        stroke="#585b70"
        strokeWidth="0.8"
        mask="url(#moon-crescent-mask)"
      />
      <circle
        cx="36"
        cy="53"
        r="1.6"
        fill="none"
        stroke="#585b70"
        strokeWidth="0.7"
        mask="url(#moon-crescent-mask)"
      />
      <circle
        cx="24"
        cy="34"
        r="1.8"
        fill="none"
        stroke="#585b70"
        strokeWidth="0.6"
        mask="url(#moon-crescent-mask)"
      />

      <text x="54" y="24" fontSize="10" fill="#fab387" opacity="0.7">
        ✦
      </text>
      <text x="17" y="22" fontSize="7" fill="#fab387" opacity="0.5">
        ✦
      </text>
      <text x="59" y="53" fontSize="8" fill="#fab387" opacity="0.45">
        ✦
      </text>
      <text x="14" y="58" fontSize="5" fill="#fab387" opacity="0.3">
        ✦
      </text>
    </svg>
  ),
  mushroom: (
    <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
      <rect
        x="32"
        y="44"
        width="16"
        height="20"
        rx="6"
        fill="#313244"
        stroke="#585b70"
        strokeWidth="1.5"
      />
      <path
        d="M14 46 A26 22 0 0 1 66 46 Z"
        fill="#313244"
        stroke="#585b70"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="32" r="3.4" fill="#585b70" />
      <circle cx="43" cy="25" r="2.8" fill="#585b70" />
      <circle cx="53" cy="35" r="3.2" fill="#585b70" />
      <text x="62" y="24" fontSize="9" fill="#fab387" opacity="0.6">
        ✦
      </text>
      <text x="10" y="34" fontSize="7" fill="#fab387" opacity="0.4">
        ✦
      </text>
    </svg>
  ),
};

type Props = { message: string; variant?: Variant };

export default function EmptyState({ message, variant = 'book' }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 mt-20 select-none">
      <div className="opacity-40">{illustrations[variant]}</div>
      <p className="text-stone text-sm">{message}</p>
    </div>
  );
}
