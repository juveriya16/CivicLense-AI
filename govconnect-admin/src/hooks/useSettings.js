import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useRoutingSettings() {
  const [settings, setSettings] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('routing_settings').select('*').order('category')
    if (!error) setSettings(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const upsert = useCallback(async (row) => {
    const { error } = await supabase.from('routing_settings').upsert(row, { onConflict: 'category' })
    if (error) throw error
  }, [])

  return { settings, loading, upsert, refresh: load }
}
