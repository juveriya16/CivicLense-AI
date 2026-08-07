import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })
    if (!error) setNotifications(data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    load()
    if (!user) return
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${user.id}` },
        () => load()
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [load, user])

  const markRead = useCallback(async (id) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  }, [])

  const markAllRead = useCallback(async () => {
    if (!user) return
    await supabase.from('notifications').update({ is_read: true }).eq('recipient_id', user.id).eq('is_read', false)
  }, [user])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return { notifications, loading, unreadCount, markRead, markAllRead, refresh: load }
}
