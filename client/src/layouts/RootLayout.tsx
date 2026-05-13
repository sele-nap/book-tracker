import { NavLink, Outlet } from 'react-router-dom';
import LanguageToggle from '../components/LanguageToggle';
import { useLanguage } from '../i18n/LanguageContext';

export default function RootLayout() {
  const { t } = useLanguage();

  const nav = [
    { to: '/', label: t.nav.library, icon: '📚' },
    { to: '/reading', label: t.nav.reading, icon: '🕯️' },
    { to: '/timeline', label: t.nav.timeline, icon: '📜' },
    { to: '/shelves', label: t.nav.shelves, icon: '🍄' },
    { to: '/stats', label: t.nav.stats, icon: '✦' },
    { to: '/challenges', label: t.nav.challenges, icon: '🌙' },
  ];

  return (
    <div className="flex min-h-screen bg-night text-cream">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-mist/30 flex-col py-8 px-4 gap-2">
        <div className="flex items-center gap-3 px-2 mb-6">
          <img src="/logo.svg" alt="logo" className="w-10 h-10" />
          <span className="font-display text-lg text-cream tracking-wide leading-tight">
            Book
            <br />
            Tracker
          </span>
        </div>

        {nav.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-wine/40 text-cream'
                  : 'text-parchment hover:bg-bark hover:text-cream'
              }`
            }
          >
            <span>{icon}</span>
            <span className="font-body">{label}</span>
          </NavLink>
        ))}

        <div className="mt-auto px-2 pt-4 border-t border-mist/20 flex justify-center">
          <LanguageToggle />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Bottom nav — mobile only */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-dusk border-t border-mist/30 flex items-center z-40">
        {nav.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors ${
                isActive ? 'text-cream' : 'text-stone'
              }`
            }
          >
            <span className="text-base leading-none">{icon}</span>
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
