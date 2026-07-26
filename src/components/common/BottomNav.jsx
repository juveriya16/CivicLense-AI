import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Camera, Bell, UserRound } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const ITEMS = [
  { to: '/app/dashboard', key: 'nav_dashboard', icon: LayoutDashboard },
  { to: '/app/my-reports', key: 'nav_myReports', icon: ClipboardList },
  { to: '/app/report', key: 'nav_report', icon: Camera, cta: true },
  { to: '/app/notifications', key: 'nav_notifications', icon: Bell },
  { to: '/app/profile', key: 'nav_profile', icon: UserRound },
]

export default function BottomNav() {
  const { t } = useLanguage()
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/90 backdrop-blur-xl border-t border-line px-2 pt-1.5 pb-[calc(0.4rem+env(safe-area-inset-bottom))] flex items-stretch justify-between">
      {ITEMS.map(({ to, key, icon: Icon, cta }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-medium leading-tight text-center ${
              cta ? '' : isActive ? 'text-orange-600' : 'text-ink-soft'
            }`
          }
        >
          {({ isActive }) =>
            cta ? (
              <span className="-mt-6 h-12 w-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(255,107,44,0.6)]">
                <Icon size={20} />
              </span>
            ) : (
              <>
                <Icon size={19} className={isActive ? 'text-orange-600' : ''} />
                {t(key)}
              </>
            )
          }
        </NavLink>
      ))}
    </nav>
  )
}
