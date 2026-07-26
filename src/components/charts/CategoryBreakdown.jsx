import { motion } from 'framer-motion'
import { cityStats } from '../../mock/data'

export default function CategoryBreakdown() {
  const max = Math.max(...cityStats.byCategory.values)
  return (
    <div className="flex flex-col gap-3.5">
      {cityStats.byCategory.labels.map((label, i) => {
        const value = cityStats.byCategory.values[i]
        const pct = (value / max) * 100
        return (
          <div key={label} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-medium text-ink-soft">{label}</span>
            <div className="flex-1 h-2.5 rounded-full bg-surface-alt overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.05 }}
                className="h-full rounded-full bg-navy-900"
              />
            </div>
            <span className="w-10 text-right text-xs font-semibold text-ink">{value}</span>
          </div>
        )
      })}
    </div>
  )
}
