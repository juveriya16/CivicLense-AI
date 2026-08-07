// Pill status labels — dot + label, matching the "Submitted / Assigned /
// In Progress" style pills from the CivicLens dashboard.
const TONES = {
  new: { text: 'text-status-gray', bg: 'bg-status-graySoft', dot: 'bg-status-gray' },
  in_review: { text: 'text-status-amber', bg: 'bg-status-amberSoft', dot: 'bg-status-amber' },
  in_progress: { text: 'text-status-blue', bg: 'bg-status-blueSoft', dot: 'bg-status-blue' },
  resolved: { text: 'text-status-green', bg: 'bg-status-greenSoft', dot: 'bg-status-green' },
  rejected: { text: 'text-status-gray', bg: 'bg-status-graySoft', dot: 'bg-status-gray' },
  critical: { text: 'text-status-red', bg: 'bg-status-redSoft', dot: 'bg-status-red' },
  high: { text: 'text-status-red', bg: 'bg-status-redSoft', dot: 'bg-status-red' },
  medium: { text: 'text-status-amber', bg: 'bg-status-amberSoft', dot: 'bg-status-amber' },
  low: { text: 'text-status-green', bg: 'bg-status-greenSoft', dot: 'bg-status-green' },
  pending: { text: 'text-status-amber', bg: 'bg-status-amberSoft', dot: 'bg-status-amber' },
  confirmed: { text: 'text-status-red', bg: 'bg-status-redSoft', dot: 'bg-status-red' },
  dismissed: { text: 'text-status-gray', bg: 'bg-status-graySoft', dot: 'bg-status-gray' },
}

export default function Badge({ tone = 'new', children }) {
  const t = TONES[tone] ?? TONES.new
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${t.bg} ${t.text}`}
    >
      <span className={`status-dot ${t.dot}`} />
      {children ?? tone.replace('_', ' ')}
    </span>
  )
}
