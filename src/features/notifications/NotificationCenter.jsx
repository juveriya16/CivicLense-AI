import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, UserCheck, Info, Award, BellOff, Check } from 'lucide-react'
import { notifications as initial } from '../../mock/data'
import EmptyState from '../../components/common/EmptyState'
import { useLanguage } from '../../context/LanguageContext'

const ICONS = { status: CheckCircle2, assign: UserCheck, system: Info, badge: Award }
const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'status', label: 'Status' },
  { id: 'assign', label: 'Assignments' },
  { id: 'badge', label: 'Badges' },
]

export default function NotificationCenter() {
  const { t } = useLanguage()
  const [items, setItems] = useState(initial)
  const [filter, setFilter] = useState('all')

  const filtered = items.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    return n.type === filter
  })
  const unreadCount = items.filter((n) => !n.read).length

  function markRead(id) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }
  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-3xl tracking-wide text-ink">{t('notif_title')}</h1>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
            <Check size={13} /> {t('notif_markAll')}
          </button>
        )}
      </div>
      <p className="text-sm text-ink-soft mb-6">{unreadCount} {t('notif_unread')}{unreadCount !== 1 && 's'}</p>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 text-sm font-medium rounded-full px-4 py-2 border transition-colors ${filter === f.id ? 'bg-orange-500 border-orange-500 text-white' : 'border-line text-ink-soft hover:border-navy-300'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={BellOff} title={t('notif_empty')} description={t('notif_emptyDesc')} />
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((n, i) => {
              const Icon = ICONS[n.type] ?? Info
              return (
                <motion.button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ delay: i * 0.04 }}
                  className={`card p-4 flex items-start gap-3.5 text-left w-full ${!n.read ? 'border-orange-200 bg-orange-50/40' : ''}`}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${!n.read ? 'bg-orange-500 text-white' : 'bg-surface-alt text-ink-soft'}`}>
                    <Icon size={17} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink">{n.title}</p>
                    <p className="text-sm text-ink-soft mt-0.5">{n.body}</p>
                    <p className="text-[11px] text-ink-soft/70 mt-1.5">{n.time}</p>
                  </div>
                  {!n.read && <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />}
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
