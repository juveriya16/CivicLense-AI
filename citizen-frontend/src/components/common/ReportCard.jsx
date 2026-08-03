import { Link } from 'react-router-dom'
import { MapPin, ChevronRight } from 'lucide-react'
import CategoryIcon from './CategoryIcon'
import StatusChip from './StatusChip'
import SeverityBadge from './SeverityBadge'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function ReportCard({ report, compact = false }) {
  return (
    <Link
      to={`/app/track/${report.id}`}
      className="card p-4 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-glass-lg transition-all group"
    >
      <CategoryIcon category={report.category} size={compact ? 40 : 46} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm text-ink truncate">{report.title}</p>
          {!compact && <SeverityBadge severity={report.severity} />}
        </div>
        <p className="text-xs text-ink-soft mt-1 flex items-center gap-1 truncate">
          <MapPin size={12} className="shrink-0" /> {report.address}
        </p>
        <p className="text-[11px] text-ink-soft/70 mt-1 font-mono">{report.id} · {timeAgo(report.createdAt)}</p>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <StatusChip status={report.status} size="sm" />
        <ChevronRight size={16} className="text-ink-soft group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  )
}
