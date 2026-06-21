import {
  BookBookmark,
  Books,
  ChartBar,
  ClockCounterClockwise,
  Gear,
  List,
  SignOut,
  SquaresFour,
  Trophy,
  X,
} from '@phosphor-icons/react';
import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import LanguageToggle from '../components/LanguageToggle.js';
import { useAuth } from '../hooks/useAuth.js';
import { useLanguage } from '../hooks/useLanguage.js';

const primaryNav = [
  { to: '/', label: 'library', icon: Books },
  { to: '/reading', label: 'reading', icon: BookBookmark },
  { to: '/shelves', label: 'shelves', icon: SquaresFour },
  { to: '/stats', label: 'stats', icon: ChartBar },
];

const secondaryNav = [
  { to: '/timeline', label: 'timeline', icon: ClockCounterClockwise },
  { to: '/challenges', label: 'challenges', icon: Trophy },
  { to: '/settings', label: 'settings', icon: Gear },
];

const allNav = [...primaryNav, ...secondaryNav];

export default function RootLayout() {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { pathname } = useLocation();

  const secondaryActive = secondaryNav.some(({ to }) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to),
  );

  return (
    <div className="flex min-h-screen bg-night text-cream">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:bg-wine focus:text-cream focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
      >
        Skip to main content
      </a>

      <aside className="hidden md:flex w-56 shrink-0 border-r border-mist/20 flex-col py-8 px-4 gap-2 relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-wine/5 via-transparent to-transparent pointer-events-none"
        />

        <div className="flex items-center gap-3 px-2 mb-6 relative">
          <img
            src="/logo.svg"
            alt=""
            aria-hidden="true"
            className="w-10 h-10 drop-shadow-[0_0_8px_rgba(144,96,176,0.5)]"
          />
          <span className="font-display text-lg text-cream tracking-wide leading-tight">
            Book
            <br />
            Tracker
          </span>
        </div>

        <nav aria-label="Sidebar navigation" className="relative">
          <ul className="flex flex-col gap-0.5">
            {allNav.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-base transition-all duration-200 ${
                      isActive
                        ? 'bg-wine/20 text-cream border-l-2 border-wine shadow-[inset_0_0_16px_rgba(144,96,176,0.12)]'
                        : 'text-parchment hover:bg-bark/80 hover:text-cream border-l-2 border-transparent'
                    }`
                  }
                >
                  <Icon size={17} weight="light" aria-hidden="true" />
                  <span className="font-body">
                    {t.nav[label as keyof typeof t.nav]}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px bg-linear-to-r from-transparent to-mist/30" />
            <span aria-hidden="true" className="text-mist/50 text-xs">
              ✦
            </span>
            <div className="flex-1 h-px bg-linear-to-l from-transparent to-mist/30" />
          </div>
          <div className="px-2 flex flex-col gap-2 items-center">
            <LanguageToggle />
            <button
              onClick={() => void logout()}
              className="flex items-center gap-1.5 text-xs text-stone hover:text-parchment transition-colors duration-200"
            >
              <SignOut size={13} weight="light" aria-hidden="true" />
              {t.auth.logout}
            </button>
          </div>
        </div>
      </aside>

      <main
        id="main-content"
        className="flex-1 p-4 md:p-8 overflow-y-auto pb-28 md:pb-8"
      >
        <Outlet />
      </main>

      <nav
        aria-label="Main navigation"
        className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40
          flex items-center gap-1 px-3 py-2
          bg-dusk/90 backdrop-blur-md
          border border-mist/30
          rounded-full shadow-2xl shadow-night/70"
      >
        {primaryNav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-12 h-10 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-wine/30 text-cream'
                  : 'text-stone hover:text-parchment hover:bg-bark/60'
              }`
            }
          >
            <Icon size={20} weight="light" aria-hidden="true" />
            <span className="sr-only">
              {t.nav[label as keyof typeof t.nav]}
            </span>
          </NavLink>
        ))}

        <div aria-hidden="true" className="w-px h-5 bg-mist/30 mx-1" />

        <button
          onClick={() => setSheetOpen(true)}
          aria-label="More navigation options"
          aria-expanded={sheetOpen}
          className={`flex flex-col items-center justify-center w-12 h-10 rounded-full transition-all duration-200 ${
            secondaryActive
              ? 'bg-wine/30 text-cream'
              : 'text-stone hover:text-parchment hover:bg-bark/60'
          }`}
        >
          <List size={20} weight="light" aria-hidden="true" />
        </button>
      </nav>

      {sheetOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex flex-col justify-end"
          onClick={() => setSheetOpen(false)}
        >
          <div className="absolute inset-0 bg-night/70 backdrop-blur-sm animate-fade-in" />

          <div
            className="relative bg-dusk border-t border-mist/20 rounded-t-3xl p-6 pb-10 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              aria-hidden="true"
              className="w-10 h-1 bg-mist/40 rounded-full mx-auto mb-6"
            />

            <button
              onClick={() => setSheetOpen(false)}
              aria-label="Close menu"
              className="absolute top-5 right-5 text-stone hover:text-parchment transition-colors"
            >
              <X size={18} weight="light" />
            </button>

            <nav aria-label="More navigation">
              <ul className="flex flex-col gap-1">
                {secondaryNav.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={to === '/'}
                      onClick={() => setSheetOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
                          isActive
                            ? 'bg-wine/20 text-cream'
                            : 'text-parchment hover:bg-bark/80 hover:text-cream'
                        }`
                      }
                    >
                      <Icon size={20} weight="light" aria-hidden="true" />
                      <span className="font-body text-base">
                        {t.nav[label as keyof typeof t.nav]}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center justify-between mt-6 pt-5 border-t border-mist/20 px-4">
              <LanguageToggle />
              <button
                onClick={() => void logout()}
                className="flex items-center gap-2 text-sm text-stone hover:text-parchment transition-colors"
              >
                <SignOut size={15} weight="light" aria-hidden="true" />
                {t.auth.logout}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
