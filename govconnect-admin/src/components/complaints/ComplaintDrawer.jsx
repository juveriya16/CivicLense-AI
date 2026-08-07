import { useState, useEffect } from 'react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

const STATUSES = ['new', 'in_review', 'in_progress', 'resolved', 'rejected']

export default function ComplaintDrawer({ complaint, onClose, onUpdate }) {
  const [status, setStatus] = useState(complaint?.status)

  useEffect(() => setStatus(complaint?.status), [complaint])

  if (!complaint) return null

  const save = async () => {
    await onUpdate(complaint.id, { status })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-30 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} />

      {/* Slide-in panel */}
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl animate-[slideIn_0.2s_ease-out]">
        <div className="flex items-start justify-between border-b border-line px-6 py-5">
          <div>
            <p className="ticket-id">{complaint.ticket_no}</p>
            <h2 className="mt-1 font-display text-lg font-extrabold text-ink">{complaint.title}</h2>
          </div>
          <button onClick={onClose} className="text-ink/40 hover:text-ink" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-wrap gap-2">
            <Badge tone={complaint.priority} />
            <Badge tone={complaint.status} />
            <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium capitalize text-brand-dark">
              {complaint.category}
            </span>
          </div>

          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-ink/40">Description</dt>
              <dd className="mt-1 text-ink">{complaint.description || '—'}</dd>
            </div>
            <div>
              <dt className="text-ink/40">Citizen</dt>
              <dd className="mt-1 text-ink">{complaint.citizen_name || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-ink/40">Contact</dt>
              <dd className="mt-1 text-ink">{complaint.citizen_contact || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-ink/40">Location</dt>
              <dd className="mt-1 text-ink">{complaint.address || '—'}</dd>
            </div>
            <div>
              <dt className="text-ink/40">Filed</dt>
              <dd className="mt-1 text-ink">{new Date(complaint.created_at).toLocaleString()}</dd>
            </div>
            {complaint.sla_due_at && (
              <div>
                <dt className="text-ink/40">SLA due</dt>
                <dd className="mt-1 text-ink">{new Date(complaint.sla_due_at).toLocaleString()}</dd>
              </div>
            )}
          </dl>

          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="status">
              Update status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-line px-3 py-2 text-sm capitalize outline-none focus:border-brand"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 border-t border-line px-6 py-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={save} className="flex-1">
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}
