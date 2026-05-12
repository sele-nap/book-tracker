import { NavLink, Outlet } from 'react-router-dom';
import LanguageToggle from '../components/LanguageToggle';
import { useLanguage } from '../i18n/LanguageContext';

export default function RootLayout() {
  const { t } = useLanguage();

  const nav = [
    { to: '/', label: t.nav.library, icon: '📚' },
    { to: '/reading', label: t.nav.reading, icon: '🕯️' },
    { to: '/shelves', label: t.nav.shelves, icon: '🍄' },
    { to: '/stats', label: t.nav.stats, icon: '✦' },
    { to: '/challenges', label: t.nav.challenges, icon: '🌙' },
  ];

  return (
    <div className="flex min-h-screen bg-night text-cream">
      <aside className="w-56 shrink-0 border-r border-mist/30 flex flex-col py-8 px-4 gap-2">
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

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
