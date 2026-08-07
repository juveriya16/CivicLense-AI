import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ALLOWED_EMAIL_DOMAIN, isAllowedGovEmail } from '../lib/supabaseClient'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const emailTouched = form.email.length > 0
  const emailValid = isAllowedGovEmail(form.email)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!isAllowedGovEmail(form.email)) {
      setError(`Use your official ${ALLOWED_EMAIL_DOMAIN} email address to sign up.`)
      return
    }
    setSubmitting(true)
    try {
      await signUp(form)
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Dark brand panel */}
      <div className="brand-glow relative hidden w-1/2 flex-col justify-between p-12 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-extrabold">
            GC
          </div>
          <span className="font-display text-base uppercase tracking-wide">GovConnect</span>
        </div>

        <div>
          <h1 className="font-display text-5xl uppercase leading-[0.95] tracking-wide">
            Your ward,
            <br />
            <span className="text-brand">one console away.</span>
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            Join the officers already triaging, routing, and closing out citizen complaints faster.
          </p>

          <ul className="mt-8 space-y-4">
            <Feature text="Only official .gov.in accounts can register" />
            <Feature text="Every request is reviewed by a super admin" />
            <Feature text="Live complaint feed the moment you're approved" />
          </ul>
        </div>

        <p className="text-xs text-white/30">© 2026 GovConnect. Built for public service.</p>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          {done ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-extrabold text-white">
                GC
              </div>
              <h2 className="font-display text-2xl uppercase tracking-wide text-ink-900">Request submitted</h2>
              <p className="mt-2 text-sm text-ink-700/70">
                Your account has been created and is now pending approval by a super admin. You'll be able to
                sign in once it's approved.
              </p>
              <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-brand hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h2 className="font-display text-3xl uppercase tracking-wide text-ink-900">Request access</h2>
              <p className="mt-1 text-sm text-ink-700/70">
                Only official {ALLOWED_EMAIL_DOMAIN} addresses can register.
              </p>

              <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
                <Input
                  id="fullName"
                  label="Full name"
                  placeholder="As it appears in your service record"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
                <Input
                  id="email"
                  label="Official email"
                  type="email"
                  placeholder={`employee${ALLOWED_EMAIL_DOMAIN}`}
                  autoComplete="username"
                  required
                  error={emailTouched && !emailValid ? `Must end with ${ALLOWED_EMAIL_DOMAIN}` : ''}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                {error && (
                  <p className="rounded-xl bg-status-redSoft px-3.5 py-2.5 text-xs text-status-red">{error}</p>
                )}
                <p className="text-xs text-ink-700/50">
                  New accounts start as <strong>admin</strong> and stay pending until a super admin approves
                  them — nobody can grant themselves access.
                </p>
                <Button type="submit" disabled={submitting} className="mt-1 w-full">
                  {submitting ? 'Submitting…' : 'Submit request →'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-ink-700/70">
                Already approved?{' '}
                <Link to="/login" className="font-semibold text-brand hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Feature({ text }) {
  return (
    <li className="flex items-center gap-3 text-sm text-white/70">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-brand">
        ✓
      </span>
      {text}
    </li>
  )
}
