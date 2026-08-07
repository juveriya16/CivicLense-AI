import Topbar from '../components/layout/Topbar'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { useProfiles } from '../hooks/useProfiles'
import { useAuth } from '../context/AuthContext'

export default function AdminManagement() {
  const { profiles, loading, approve, revoke } = useProfiles()
  const { user } = useAuth()

  const pending = profiles.filter((p) => !p.is_approved)
  const approved = profiles.filter((p) => p.is_approved)

  return (
    <div>
      <Topbar
        title="Admin management"
        subtitle="Approve staff signups and manage access — super admin only"
      />
      <div className="space-y-6 p-8">
        <Card className="p-5">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-status-amber">⚠</span>
            <p className="text-sm text-ink/60">
              This is the only place accounts get admin access. Regular admins can't see this page or promote
              anyone — only a super admin can approve a pending request or revoke access. Super admin status
              itself isn't grantable here; it's set directly in the database to avoid exposing that power to
              the browser.
            </p>
          </div>
        </Card>

        <div>
          <h2 className="mb-3 font-display text-sm font-extrabold text-ink">
            Pending requests {pending.length > 0 && `(${pending.length})`}
          </h2>
          <Card className="overflow-hidden">
            {loading ? (
              <p className="p-6 text-sm text-ink/50">Loading…</p>
            ) : pending.length === 0 ? (
              <p className="p-6 text-sm text-ink/50">No pending signup requests.</p>
            ) : (
              <ul className="divide-y divide-line">
                {pending.map((p) => (
                  <li key={p.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-ink">{p.full_name || 'Unnamed'}</p>
                      <p className="text-xs text-ink/50">{p.email}</p>
                    </div>
                    <Button onClick={() => approve(p.id)}>Approve</Button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div>
          <h2 className="mb-3 font-display text-sm font-extrabold text-ink">Active staff</h2>
          <Card className="overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-ink/40">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {approved.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-0">
                    <td className="px-5 py-3 font-medium text-ink">{p.full_name || '—'}</td>
                    <td className="px-5 py-3 text-ink/60">{p.email}</td>
                    <td className="px-5 py-3">
                      {p.role === 'super_admin' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium capitalize text-brand-dark">
                          <span className="status-dot bg-brand" />
                          Super admin
                        </span>
                      ) : (
                        <Badge tone="new">Admin</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {p.role !== 'super_admin' && p.id !== user?.id && (
                        <Button variant="secondary" onClick={() => revoke(p.id)}>
                          Revoke access
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  )
}
