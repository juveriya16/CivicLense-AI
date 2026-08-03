import { statusMeta } from '../../mock/reports'

export default function StatusChip({ status, size = 'md' }) {
  const meta = statusMeta[status] ?? statusMeta.submitted
  const sizeCls = size === 'sm' ? 'text-[11px] px-2.5 py-1' : 'text-xs px-3 py-1.5'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeCls}`}
      style={{ color: meta.color, background: meta.bg }}
    >
      <span className="status-dot" style={{ background: meta.color }} />
      {meta.label}
    </span>
  )
}
