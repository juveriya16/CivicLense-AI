import Topbar from '../components/layout/Topbar'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { useDuplicates } from '../hooks/useDuplicates'

export default function Duplicates() {
  const { pairs, loading, resolve } = useDuplicates()
  const pending = pairs.filter((p) => p.status === 'pending')

  return (
    <div>
      <Topbar title="Duplicate review" subtitle="Complaints flagged as likely duplicates by location clustering" />
      <div className="space-y-4 p-8">
        {loading ? (
          <p className="text-sm text-ink/50">Loading…</p>
        ) : pending.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="font-display text-base font-extrabold text-ink">Queue is clear</p>
            <p className="mt-1 text-sm text-ink/50">No pending duplicate pairs to review right now.</p>
          </Card>
        ) : (
          pending.map((pair) => (
            <Card key={pair.id} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-ink/50">
                  <Badge tone="pending" />
                  {pair.distance_meters != null && <span>{Math.round(pair.distance_meters)} m apart</span>}
                  {pair.similarity_score != null && (
                    <span>· {Math.round(pair.similarity_score * 100)}% similar</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => resolve(pair.id, 'dismissed')}>
                    Not a duplicate
                  </Button>
                  <Button variant="danger" onClick={() => resolve(pair.id, 'confirmed')}>
                    Confirm duplicate
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <ComplaintMini label="Primary" complaint={pair.primary} />
                <ComplaintMini label="Possible duplicate" complaint={pair.duplicate} />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

function ComplaintMini({ label, complaint }) {
  if (!complaint) return null
  return (
    <div className="rounded-md border border-line p-3">
      <p className="text-xs uppercase tracking-wide text-ink/40">{label}</p>
      <p className="mt-1 ticket-id">{complaint.ticket_no}</p>
      <p className="mt-0.5 text-sm font-medium text-ink">{complaint.title}</p>
      <p className="mt-0.5 text-xs text-ink/50">{complaint.address}</p>
    </div>
  )
}
