import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useComplaints(filters = {}) {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('complaints').select('*').order('created_at', { ascending: false })
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.category) query = query.eq('category', filters.category)
    if (filters.priority) query = query.eq('priority', filters.priority)

    const { data, error } = await query
    if (error) setError(error.message)
    else setComplaints(data ?? [])
    setLoading(false)
  }, [filters.status, filters.category, filters.priority])

  useEffect(() => {
    load()

    const channel = supabase
      .channel('complaints-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => {
        load()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load])

  const updateComplaint = useCallback(async (id, patch) => {
    const { error } = await supabase
      .from('complaints')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  }, [])

  return { complaints, loading, error, refresh: load, updateComplaint }
}

export function useComplaint(id) {
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let mounted = true
    setLoading(true)
    supabase
      .from('complaints')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (mounted) {
          setComplaint(data)
          setLoading(false)
        }
      })
    return () => {
      mounted = false
    }
  }, [id])

  return { complaint, loading }
}
