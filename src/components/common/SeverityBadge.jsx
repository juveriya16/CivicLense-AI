import { severityMeta } from '../../mock/reports'

export default function SeverityBadge({ severity }) {
  const meta = severityMeta[severity] ?? severityMeta.low
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-1 text-[11px] font-bold tracking-wide text-white"
      style={{ background: meta.color }}
    >
      {meta.label}
    </span>
  )
}
