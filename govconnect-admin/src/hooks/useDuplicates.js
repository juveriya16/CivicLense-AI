import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useDuplicates() {
  const [pairs, setPairs] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('complaint_duplicates')
      .select(`
        *,
        primary:primary_complaint_id ( id, ticket_no, title, category, address ),
        duplicate:duplicate_complaint_id ( id, ticket_no, title, category, address )
      `)
      .order('created_at', { ascending: false })
    if (!error) setPairs(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const channel = supabase
      .channel('duplicates-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaint_duplicates' }, () => load())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [load])

  const resolve = useCallback(async (id, status) => {
    const { error } = await supabase.from('complaint_duplicates').update({ status }).eq('id', id)
    if (error) throw error
  }, [])

  return { pairs, loading, resolve, refresh: load }
}
