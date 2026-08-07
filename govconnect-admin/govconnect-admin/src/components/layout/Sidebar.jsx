import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/', label: 'Dashboard', icon: '◇', end: true },
  { to: '/complaints', label: 'Complaints', icon: '☰' },
  { to: '/duplicates', label: 'Duplicate review', icon: '⧉' },
  { to: '/hotspots', label: 'Hotspots', icon: '⌖' },
  { to: '/notifications', label: 'Notifications', icon: '◔' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
]

export default function Sidebar() {
  const { profile, isSuperAdmin, signOut } = useAuth()

  return (
    // app-sidebar = position: sticky; top: 0; height: 100vh (see index.css).
    // It sits inside a flex row with the page content, so it stays pinned
    // to the top of the viewport for the full height of the screen no
    // matter how tall (or short) the sidebar's own nav list is, and no
    // matter how far the page content scrolls.
    <aside className="app-sidebar flex w-64 shrink-0 flex-col justify-between bg-ink-950 text-white">
      <div>
        <div className="flex items-center gap-2.5 px-5 py-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-heading font-extrabold">
            GC
          </div>
          <p className="font-display text-base uppercase tracking-wide leading-none">GovConnect</p>
        </div>

        <nav className="mt-2 flex flex-col gap-1 px-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-white/[0.07] text-white' : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-md text-sm leading-none ${
                      isActive ? 'bg-brand text-white' : 'text-white/40'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}

          {isSuperAdmin && (
            <NavLink
              to="/admin-management"
              className={({ isActive }) =>
                `mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-white/[0.07] text-white' : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-md text-sm leading-none ${
                      isActive ? 'bg-brand text-white' : 'text-white/40'
                    }`}
                  >
                    ☖
                  </span>
                  Admin management
                </>
              )}
            </NavLink>
          )}
        </nav>
      </div>

      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
            {(profile?.full_name || profile?.email || '?').slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{profile?.full_name || profile?.email}</p>
            <p className="text-xs capitalize text-white/40">{profile?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="mt-3 w-full rounded-full border border-white/15 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
