import { NavLink, Outlet } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { to: '/', label: 'Singiel', exact: true },
  { to: '/doubles', label: 'Debel' },
  { to: '/matches', label: 'Mecze' },
  { to: '/stats', label: 'Statystyki' },
  { to: '/players', label: 'Gracze' },
]

export default function Layout() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
      <nav
        className="border-b px-6 py-3 flex items-center gap-1"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <span className="font-black text-lg tracking-widest mr-5" style={{ color: 'var(--text)' }}>
          🏓 LOL
        </span>

        <div className="flex items-center gap-1">
          {navItems.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive ? {} : { color: 'var(--text-muted)' }}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Dark/light toggle */}
        <button
          onClick={toggle}
          className="ml-auto w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all hover:scale-110 active:scale-95"
          style={{ border: '1px solid var(--border)', background: 'var(--bg-elevated)' }}
          title={theme === 'dark' ? 'Włącz tryb jasny' : 'Włącz tryb ciemny'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
