import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

// Directory of all staff accounts — used by the Admin Management page
// (super_admin only, enforced both in the UI and by RLS policy).
export function useProfiles() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, is_approved, created_at')
      .order('created_at', { ascending: false })
    if (!error) setProfiles(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const approve = useCallback(async (id) => {
    const { error } = await supabase.from('profiles').update({ is_approved: true }).eq('id', id)
    if (error) throw error
  }, [])

  const revoke = useCallback(async (id) => {
    const { error } = await supabase.from('profiles').update({ is_approved: false }).eq('id', id)
    if (error) throw error
  }, [])

  return { profiles, loading, approve, revoke, refresh: load }
}
