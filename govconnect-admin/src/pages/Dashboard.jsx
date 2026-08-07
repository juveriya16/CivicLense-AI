import { useMemo } from 'react'
import Topbar from '../components/layout/Topbar'
import Card from '../components/ui/Card'
import { useComplaints } from '../hooks/useComplaints'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

export default function Dashboard() {
  const { complaints, loading } = useComplaints()

  const stats = useMemo(() => {
    const open = complaints.filter((c) => !['resolved', 'rejected'].includes(c.status)).length
    const overdue = complaints.filter(
      (c) => c.sla_due_at && new Date(c.sla_due_at) < new Date() && !['resolved', 'rejected'].includes(c.status)
    ).length
    const resolved = complaints.filter((c) => c.status === 'resolved').length
    const critical = complaints.filter((c) => c.priority === 'critical').length
    return { open, overdue, resolved, critical, total: complaints.length }
  }, [complaints])

  const byCategory = useMemo(() => {
    const counts = {}
    for (const c of complaints) counts[c.category] = (counts[c.category] ?? 0) + 1
    return Object.entries(counts).map(([category, count]) => ({ category, count }))
  }, [complaints])

  return (
    <div>
      <Topbar title="Dashboard" subtitle="Live overview of citizen complaints" />
      <div className="p-8">
        {loading ? (
          <p className="text-sm text-ink/50">Loading…</p>
        ) : complaints.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="font-display text-base font-extrabold text-ink">No complaints yet</p>
            <p className="mt-1 text-sm text-ink/50">
              New citizen complaints synced from Supabase will appear here as soon as they arrive.
            </p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Open" value={stats.open} dot="bg-status-blue" />
              <StatCard label="Overdue SLA" value={stats.overdue} dot="bg-status-red" />
              <StatCard label="Critical priority" value={stats.critical} dot="bg-status-red" />
              <StatCard label="Resolved" value={stats.resolved} dot="bg-status-green" />
            </div>

            <Card className="mt-6 p-6">
              <h2 className="font-display text-sm font-extrabold text-ink">Complaints by category</h2>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byCategory}>
                    <XAxis dataKey="category" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94A3B8" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#FF6A2B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, dot }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/50">{label}</p>
        <span className={`status-dot ${dot}`} />
      </div>
      <p className="mt-2 font-display text-2xl font-extrabold text-ink">{value}</p>
    </Card>
  )
}
