import {
  BookBookmark,
  Books,
  ChartBar,
  ClockCounterClockwise,
  Gear,
  SignOut,
  SquaresFour,
  Trophy,
} from '@phosphor-icons/react';
import { NavLink, Outlet } from 'react-router-dom';
import LanguageToggle from '../components/LanguageToggle.js';
import { useAuth } from '../contexts/auth.js';
import { useLanguage } from '../hooks/useLanguage.js';

export default function RootLayout() {
  const { t } = useLanguage();
  const { logout } = useAuth();

  const nav = [
    { to: '/', label: t.nav.library, icon: Books },
    { to: '/reading', label: t.nav.reading, icon: BookBookmark },
    { to: '/timeline', label: t.nav.timeline, icon: ClockCounterClockwise },
    { to: '/shelves', label: t.nav.shelves, icon: SquaresFour },
    { to: '/stats', label: t.nav.stats, icon: ChartBar },
    { to: '/challenges', label: t.nav.challenges, icon: Trophy },
    { to: '/settings', label: t.nav.settings, icon: Gear },
  ];

  return (
    <div className="flex min-h-screen bg-night text-cream">
      {/* 2.4.1 — Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-wine focus:text-cream focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
      >
        Skip to main content
      </a>

      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-mist/30 flex-col py-8 px-4 gap-2">
        <div className="flex items-center gap-3 px-2 mb-6">
          <img
            src="/logo.svg"
            alt=""
            aria-hidden="true"
            className="w-10 h-10"
          />
          <span className="font-display text-lg text-cream tracking-wide leading-tight">
            Book
            <br />
            Tracker
          </span>
        </div>

        <nav aria-label="Main navigation">
          <ul className="flex flex-col gap-1">
            {nav.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-base transition-colors ${
                      isActive
                        ? 'bg-wine/40 text-cream'
                        : 'text-parchment hover:bg-bark hover:text-cream'
                    }`
                  }
                >
                  <Icon size={17} weight="light" aria-hidden="true" />
                  <span className="font-body">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto px-2 pt-4 border-t border-mist/20 flex flex-col gap-2 items-center">
          <LanguageToggle />
          <button
            onClick={() => void logout()}
            className="flex items-center gap-1.5 text-xs text-stone hover:text-parchment transition-colors"
          >
            <SignOut size={13} weight="light" aria-hidden="true" />
            {t.auth.logout}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        id="main-content"
        className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8"
      >
        <Outlet />
      </main>

      {/* Bottom nav — mobile only */}
      <nav
        aria-label="Main navigation"
        className="md:hidden fixed bottom-0 inset-x-0 bg-dusk border-t border-mist/30 flex items-center z-40"
      >
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-sm transition-colors ${
                isActive ? 'text-cream' : 'text-stone'
              }`
            }
          >
            <Icon size={20} weight="light" aria-hidden="true" />
            <span className="font-body leading-tight truncate max-w-full px-1">
              {label}
            </span>
          </NavLink>
        ))}
        <div className="flex flex-col items-center justify-center py-2.5 px-2">
          <LanguageToggle />
        </div>
      </nav>
    </div>
  );
}
