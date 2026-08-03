import { Menu, Search, Bell, Moon, Sun, Command } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { notifications } from '../../mock/data'

export default function Topbar({ onMenuClick, onSearchClick }) {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const { t } = useLanguage()
  const unread = notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-line">
      <div className="flex items-center gap-3 px-4 lg:px-8 h-16">
        <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-ink-soft">
          <Menu size={22} />
        </button>

        <button
          onClick={onSearchClick}
          className="hidden sm:flex items-center gap-2 flex-1 max-w-md rounded-full border border-line bg-card px-4 py-2.5 text-sm text-ink-soft hover:border-navy-300 transition-colors"
        >
          <Search size={16} />
          <span className="flex-1 text-left">{t('search_placeholder')}</span>
          <span className="flex items-center gap-0.5 text-[11px] font-mono bg-surface-alt px-1.5 py-0.5 rounded border border-line">
            <Command size={10} /> K
          </span>
        </button>

        <button onClick={onSearchClick} className="sm:hidden ml-auto p-2 text-ink-soft">
          <Search size={20} />
        </button>

        <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-ink-soft hover:bg-surface-alt transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <Link to="/app/notifications" className="relative p-2.5 rounded-full text-ink-soft hover:bg-surface-alt transition-colors">
            <Bell size={19} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-surface" />
            )}
          </Link>

          <Link to="/app/profile" className="ml-1 h-9 w-9 rounded-full bg-navy-900 text-white flex items-center justify-center font-semibold text-sm">
            {user?.fullName?.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </Link>
        </div>
      </div>
    </header>
  )
}
