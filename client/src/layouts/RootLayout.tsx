import { NavLink, Outlet } from 'react-router-dom';

const nav = [
  { to: '/',           label: 'Bibliothèque', icon: '📚' },
  { to: '/reading',    label: 'En cours',     icon: '🕯️' },
  { to: '/shelves',    label: 'Étagères',     icon: '🍄' },
  { to: '/stats',      label: 'Stats',        icon: '✦'  },
  { to: '/challenges', label: 'Challenges',   icon: '🌙' },
];

export default function RootLayout() {
  return (
    <div className="flex min-h-screen bg-night text-cream">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-mist/30 flex flex-col py-8 px-4 gap-2">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-6">
          <img src="/logo.svg" alt="logo" className="w-10 h-10" />
          <span className="font-display text-lg text-cream tracking-wide leading-tight">
            Book<br />Tracker
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
      </aside>

      {/* Contenu */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
