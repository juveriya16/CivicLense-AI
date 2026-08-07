import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isAllowedGovEmail, ALLOWED_EMAIL_DOMAIN } from '../lib/supabaseClient'

const AuthContext = createContext(null)

// Roles: 'super_admin' | 'admin'
// New signups are created as role='admin', is_approved=false.
// Only a super_admin can approve/promote from the Admin Management page.
// There is no client-side path to create a super_admin — that is seeded
// directly in the database, since granting it from the browser would
// require exposing a service-role key.

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  const fetchProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, is_approved, created_at')
      .eq('id', userId)
      .single()
    if (error) {
      console.error('[GovConnect] Failed to load profile:', error.message)
      return null
    }
    return data
  }, [])

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return
      setSession(session)
      if (session?.user) {
        const p = await fetchProfile(session.user.id)
        if (mounted) setProfile(p)
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session?.user) {
        const p = await fetchProfile(session.user.id)
        setProfile(p)
      } else {
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [fetchProfile])

  const signUp = useCallback(async ({ email, password, fullName }) => {
    setAuthError(null)
    if (!isAllowedGovEmail(email)) {
      const err = new Error(`Use your official ${ALLOWED_EMAIL_DOMAIN} email address to sign up.`)
      setAuthError(err.message)
      throw err
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) {
      setAuthError(error.message)
      throw error
    }
    // Profile row is created by the handle_new_user trigger in supabase/schema.sql
    // with role='admin', is_approved=false. If email confirmation is enabled in
    // your Supabase project, data.session will be null until the user confirms.
    return data
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    setAuthError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setAuthError(error.message)
      throw error
    }
    const p = await fetchProfile(data.user.id)
    if (!p) {
      const err = new Error('No profile found for this account. Contact a super admin.')
      setAuthError(err.message)
      await supabase.auth.signOut()
      throw err
    }
    if (!p.is_approved) {
      const err = new Error('Your account is pending approval by a super admin.')
      setAuthError(err.message)
      await supabase.auth.signOut()
      throw err
    }
    setProfile(p)
    return p
  }, [fetchProfile])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setSession(null)
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    authError,
    isSuperAdmin: profile?.role === 'super_admin',
    isAdmin: profile?.role === 'admin',
    isApproved: Boolean(profile?.is_approved),
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
