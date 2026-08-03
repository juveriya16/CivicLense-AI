import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, ClipboardX } from 'lucide-react'
import { reports, statusMeta } from '../../mock/reports'
import { categories } from '../../mock/categories'
import ReportCard from '../../components/common/ReportCard'
import EmptyState from '../../components/common/EmptyState'
import { useLanguage } from '../../context/LanguageContext'

const STATUS_TABS = [{ id: 'all', label: 'All' }, ...Object.entries(statusMeta).map(([id, m]) => ({ id, label: m.label }))]
const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'severity', label: 'Highest severity' },
]
const SEVERITY_RANK = { high: 3, medium: 2, low: 1 }

export default function MyReports() {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let list = [...reports]
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.address.toLowerCase().includes(q))
    }
    if (statusFilter !== 'all') list = list.filter((r) => r.status === statusFilter)
    if (categoryFilter !== 'all') list = list.filter((r) => r.category === categoryFilter)

    list.sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sort === 'severity') return SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]
      return 0
    })
    return list
  }, [query, statusFilter, categoryFilter, sort])

  return (
    <div className="pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-ink">{t('myReports_title')}</h1>
          <p className="text-sm text-ink-soft mt-0.5">{reports.length} {t('myReports_total')}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('myReports_search')}
            className="input-field pl-11"
          />
        </div>
        <div className="flex gap-3">
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field !w-auto">
            {SORT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
          <button onClick={() => setShowFilters((s) => !s)} className={`btn-ghost !px-4 ${showFilters ? '!border-orange-500 !text-orange-600' : ''}`}>
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4 overflow-hidden">
          <div className="card p-4 flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-ink-soft self-center mr-1">Category:</span>
            <button onClick={() => setCategoryFilter('all')} className={`text-xs font-medium rounded-full px-3 py-1.5 ${categoryFilter === 'all' ? 'bg-navy-900 text-white' : 'bg-surface-alt text-ink-soft'}`}>All</button>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setCategoryFilter(c.id)} className={`text-xs font-medium rounded-full px-3 py-1.5 ${categoryFilter === c.id ? 'bg-navy-900 text-white' : 'bg-surface-alt text-ink-soft'}`}>{c.label}</button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 -mx-1 px-1">
        {STATUS_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setStatusFilter(t.id)}
            className={`shrink-0 text-sm font-medium rounded-full px-4 py-2 border transition-colors ${statusFilter === t.id ? 'bg-orange-500 border-orange-500 text-white' : 'border-line text-ink-soft hover:border-navy-300'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardX}
          title={t('myReports_empty')}
          description={t('myReports_emptyDesc')}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <ReportCard report={r} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
