import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireAuth({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-sm text-ink/50">
        Loading…
      </div>
    )
  }
  if (!user || !profile?.is_approved) {
    return <Navigate to="/login" replace />
  }
  return children
}

export function RequireSuperAdmin({ children }) {
  const { profile } = useAuth()
  if (profile?.role !== 'super_admin') {
    return <Navigate to="/" replace />
  }
  return children
}
