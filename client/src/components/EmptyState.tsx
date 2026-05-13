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
        fill="#2a2330"
        stroke="#3d3547"
        strokeWidth="1.5"
      />
      <rect x="22" y="20" width="4" height="44" rx="2" fill="#3d3547" />
      <line
        x1="30"
        y1="32"
        x2="48"
        y2="32"
        stroke="#3d3547"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="38"
        x2="48"
        y2="38"
        stroke="#3d3547"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="44"
        x2="42"
        y2="44"
        stroke="#3d3547"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <text x="52" y="26" fontSize="10" fill="#c49a50" opacity="0.7">
        ✦
      </text>
      <text x="14" y="22" fontSize="8" fill="#c49a50" opacity="0.5">
        ✦
      </text>
      <text x="50" y="52" fontSize="7" fill="#c49a50" opacity="0.4">
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
        fill="#2a2330"
        stroke="#3d3547"
        strokeWidth="1.5"
      />
      <rect x="30" y="62" width="20" height="5" rx="2" fill="#3d3547" />
      <line
        x1="40"
        y1="42"
        x2="40"
        y2="36"
        stroke="#8a7a6a"
        strokeWidth="1.2"
      />
      <ellipse cx="40" cy="33" rx="4" ry="5" fill="#c49a50" opacity="0.6" />
      <ellipse cx="40" cy="32" rx="2" ry="3" fill="#e8dfc8" opacity="0.8" />
      <text x="52" y="38" fontSize="9" fill="#c49a50" opacity="0.5">
        ✦
      </text>
      <text x="20" y="44" fontSize="7" fill="#c49a50" opacity="0.4">
        ✦
      </text>
      <text x="54" y="52" fontSize="6" fill="#c49a50" opacity="0.3">
        ✦
      </text>
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
      <path
        d="M48 20c-12 3-20 14-18 26s12 20 24 18c-8 4-18 2-24-6S24 36 30 26a20 20 0 0118-6z"
        fill="#2a2330"
        stroke="#3d3547"
        strokeWidth="1.5"
      />
      <text x="50" y="28" fontSize="10" fill="#c49a50" opacity="0.7">
        ✦
      </text>
      <text x="24" y="24" fontSize="7" fill="#c49a50" opacity="0.5">
        ✦
      </text>
      <text x="52" y="50" fontSize="8" fill="#c49a50" opacity="0.4">
        ✦
      </text>
      <text x="30" y="62" fontSize="6" fill="#c49a50" opacity="0.3">
        ✦
      </text>
    </svg>
  ),
  mushroom: (
    <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
      <path
        d="M30 50 Q29 58 31 63 Q40 68 49 63 Q51 58 50 50Z"
        fill="#2a2330"
        stroke="#3d3547"
        strokeWidth="1.2"
      />
      <path
        d="M14 46 Q15 24 40 18 Q65 24 66 46 Q54 38 40 37 Q26 38 14 46Z"
        fill="#2a2330"
        stroke="#3d3547"
        strokeWidth="1.5"
      />
      <path
        d="M14 46 Q26 52 40 53 Q54 52 66 46"
        stroke="#3d3547"
        strokeWidth="1.2"
        fill="none"
      />
      <ellipse cx="32" cy="34" rx="5" ry="4" fill="#3d3547" />
      <ellipse cx="50" cy="30" rx="4.5" ry="3.5" fill="#3d3547" />
      <ellipse cx="41" cy="24" rx="3.5" ry="3" fill="#3d3547" />
      <text x="10" y="30" fontSize="8" fill="#c49a50" opacity="0.5">
        ✦
      </text>
      <text x="60" y="28" fontSize="7" fill="#c49a50" opacity="0.4">
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
