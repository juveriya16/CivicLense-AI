import { useState } from 'react'
import Topbar from '../components/layout/Topbar'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ComplaintDrawer from '../components/complaints/ComplaintDrawer'
import { useComplaints } from '../hooks/useComplaints'

export default function Complaints() {
  const [statusFilter, setStatusFilter] = useState('')
  const { complaints, loading, updateComplaint } = useComplaints({ status: statusFilter || undefined })
  const [selected, setSelected] = useState(null)

  return (
    <div>
      <Topbar
        title="Complaints"
        subtitle="All citizen complaints synced from Supabase"
        actions={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-line bg-white px-3 py-1.5 text-sm"
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="in_review">In review</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        }
      />

      <div className="p-8">
        <Card className="overflow-hidden">
          {loading ? (
            <p className="p-6 text-sm text-ink/50">Loading…</p>
          ) : complaints.length === 0 ? (
            <p className="p-10 text-center text-sm text-ink/50">No complaints match this filter yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-ink/40">
                <tr>
                  <th className="px-5 py-3 font-medium">Ticket</th>
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Priority</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Filed</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="cursor-pointer border-b border-line last:border-0 hover:bg-paper"
                  >
                    <td className="px-5 py-3 ticket-id">{c.ticket_no}</td>
                    <td className="px-5 py-3 font-medium text-ink">{c.title}</td>
                    <td className="px-5 py-3 capitalize text-ink/70">{c.category}</td>
                    <td className="px-5 py-3">
                      <Badge tone={c.priority} />
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={c.status} />
                    </td>
                    <td className="px-5 py-3 text-ink/50">{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <ComplaintDrawer complaint={selected} onClose={() => setSelected(null)} onUpdate={updateComplaint} />
    </div>
  )
}
