import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(form)
      navigate('/', { replace: true })
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
            Every complaint,
            <br />
            <span className="text-brand">one console.</span>
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            Sign in with your official government account to triage, route, and resolve citizen complaints.
          </p>
        </div>
        <p className="text-xs text-white/30">© 2026 GovConnect. Built for public service.</p>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-extrabold text-white">
              GC
            </div>
          </div>
          <h2 className="font-display text-3xl uppercase tracking-wide text-ink-900">Sign in</h2>
          <p className="mt-1 text-sm text-ink-700/70">Use your official government email address.</p>

          <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
            <Input
              id="email"
              label="Official email"
              type="email"
              placeholder="employee@gov.in"
              autoComplete="username"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {error && (
              <p className="rounded-xl bg-status-redSoft px-3.5 py-2.5 text-xs text-status-red">{error}</p>
            )}
            <Button type="submit" disabled={submitting} className="mt-1 w-full">
              {submitting ? 'Signing in…' : 'Sign in →'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-700/70">
            New employee?{' '}
            <Link to="/signup" className="font-semibold text-brand hover:underline">
              Request access
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
