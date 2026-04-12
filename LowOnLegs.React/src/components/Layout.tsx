import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Singiel', exact: true },
  { to: '/doubles', label: 'Debel' },
  { to: '/matches', label: 'Mecze' },
  { to: '/stats', label: 'Statystyki' },
  { to: '/players', label: 'Gracze' },
]

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
      <nav className="bg-[#12121a] border-b border-white/10 px-6 py-3 flex items-center gap-6">
        <span className="text-white font-bold text-lg tracking-widest mr-4">🏓 LOL</span>
        {navItems.map(({ to, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
