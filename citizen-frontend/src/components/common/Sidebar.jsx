import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Camera, ClipboardList, Bell, UserRound, Settings, ScanLine, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'

const NAV = [
  { to: '/app/dashboard', key: 'nav_dashboard', icon: LayoutDashboard },
  { to: '/app/report', key: 'nav_report', icon: Camera },
  { to: '/app/my-reports', key: 'nav_myReports', icon: ClipboardList },
  { to: '/app/notifications', key: 'nav_notifications', icon: Bell },
  { to: '/app/profile', key: 'nav_profile', icon: UserRound },
  { to: '/app/settings', key: 'nav_settings', icon: Settings },
]

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <div className="h-9 w-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-[0_6px_16px_-4px_rgba(255,107,44,0.6)]">
        <ScanLine size={19} className="text-white" strokeWidth={2.4} />
      </div>
      <span className="font-display text-2xl tracking-wide text-white leading-none pt-1">CivicLens</span>
    </div>
  )
}

export function DesktopSidebar() {
  const { t } = useLanguage()
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-navy-950 bg-noise px-4 py-6 gap-8">
      <Brand />
      <nav className="flex flex-col gap-1">
        {NAV.map(({ to, key, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
                isActive ? 'bg-white/10 text-white' : 'text-white/55 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-orange-500' : ''} />
                {t(key)}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl bg-white/5 border border-white/10 p-4">
        <p className="text-[11px] uppercase tracking-wider text-white/40 font-semibold mb-1">Civic tip</p>
        <p className="text-xs text-white/70 leading-relaxed">Clear photos with visible landmarks help officers resolve issues faster.</p>
      </div>
    </aside>
  )
}

export function MobileSidebar({ open, onClose }) {
  const { t } = useLanguage()
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={onClose} />
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        exit={{ x: -280 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="absolute left-0 top-0 h-full w-72 bg-navy-950 bg-noise px-4 py-6 flex flex-col gap-8"
      >
        <div className="flex items-center justify-between">
          <Brand />
          <button onClick={onClose} className="text-white/60 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/55 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              {t(key)}
            </NavLink>
          ))}
        </nav>
      </motion.aside>
    </div>
  )
}
