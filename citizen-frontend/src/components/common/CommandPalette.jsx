import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Camera, LayoutDashboard, ClipboardList, UserRound, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { reports } from '../../mock/reports'

const QUICK_LINKS = [
  { label: 'Go to Dashboard', to: '/app/dashboard', icon: LayoutDashboard },
  { label: 'Report a new issue', to: '/app/report', icon: Camera },
  { label: 'View my reports', to: '/app/my-reports', icon: ClipboardList },
  { label: 'Open my profile', to: '/app/profile', icon: UserRound },
]

export default function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) setQ('')
  }, [open])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const matchedReports = useMemo(() => {
    if (!q.trim()) return []
    const term = q.toLowerCase()
    return reports.filter((r) => r.title.toLowerCase().includes(term) || r.id.toLowerCase().includes(term) || r.address.toLowerCase().includes(term)).slice(0, 5)
  }, [q])

  const matchedLinks = useMemo(() => {
    if (!q.trim()) return QUICK_LINKS
    return QUICK_LINKS.filter((l) => l.label.toLowerCase().includes(q.toLowerCase()))
  }, [q])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="relative w-full max-w-lg rounded-3xl bg-card shadow-glass-lg border border-line overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
              <Search size={18} className="text-ink-soft" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search reports, addresses, or jump to a page…"
                className="flex-1 outline-none text-sm bg-transparent"
              />
              <kbd className="text-[11px] font-mono text-ink-soft border border-line rounded px-1.5 py-0.5">Esc</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {matchedLinks.length > 0 && (
                <div className="mb-1">
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Navigate</p>
                  {matchedLinks.map((l) => (
                    <button
                      key={l.to}
                      onClick={() => { navigate(l.to); onClose() }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-alt text-left text-sm"
                    >
                      <l.icon size={16} className="text-orange-500" />
                      {l.label}
                      <ArrowRight size={14} className="ml-auto text-ink-soft" />
                    </button>
                  ))}
                </div>
              )}
              {matchedReports.length > 0 && (
                <div>
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Reports</p>
                  {matchedReports.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => { navigate(`/app/track/${r.id}`); onClose() }}
                      className="w-full flex flex-col px-3 py-2.5 rounded-xl hover:bg-surface-alt text-left"
                    >
                      <span className="text-sm font-medium">{r.title}</span>
                      <span className="text-xs text-ink-soft">{r.id} · {r.address}</span>
                    </button>
                  ))}
                </div>
              )}
              {q && matchedLinks.length === 0 && matchedReports.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-ink-soft">No matches for "{q}"</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
