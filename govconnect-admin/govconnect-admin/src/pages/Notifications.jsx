import Topbar from '../components/layout/Topbar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useNotifications } from '../hooks/useNotifications'

export default function Notifications() {
  const { notifications, loading, unreadCount, markRead, markAllRead } = useNotifications()

  return (
    <div>
      <Topbar
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        actions={
          unreadCount > 0 && (
            <Button variant="secondary" onClick={markAllRead}>
              Mark all read
            </Button>
          )
        }
      />
      <div className="space-y-2 p-8">
        {loading ? (
          <p className="text-sm text-ink/50">Loading…</p>
        ) : notifications.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="font-display text-base font-extrabold text-ink">No notifications yet</p>
            <p className="mt-1 text-sm text-ink/50">Assignments and SLA alerts will show up here.</p>
          </Card>
        ) : (
          notifications.map((n) => (
            <Card
              key={n.id}
              onClick={() => !n.is_read && markRead(n.id)}
              className={`flex cursor-pointer items-start gap-3 p-4 ${!n.is_read ? 'border-brand/30 bg-brand-soft/40' : ''}`}
            >
              <span
                className={`mt-1.5 status-dot ${n.is_read ? 'bg-line' : 'bg-brand'}`}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{n.title}</p>
                {n.body && <p className="mt-0.5 text-sm text-ink/60">{n.body}</p>}
                <p className="mt-1 text-xs text-ink/40">{new Date(n.created_at).toLocaleString()}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
