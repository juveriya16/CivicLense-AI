import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react'
import AuthLayout from './AuthLayout'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function onSubmit(data) {
    setLoading(true)
    await login(data)
    setLoading(false)
    toast.push('Welcome back! Redirecting to your dashboard…', 'success')
    navigate('/app/dashboard')
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to track and report civic issues in your city.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <label className="label mb-1.5 block">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              type="email"
              placeholder="you@example.com"
              className="input-field pl-11"
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })}
            />
          </div>
          {errors.email && <p className="text-xs text-danger mt-1.5">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label">Password</label>
            <Link to="/forgot-password" className="text-xs font-medium text-orange-600 hover:text-orange-700">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="input-field pl-11 pr-11"
              {...register('password', { required: 'Password is required' })}
            />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-danger mt-1.5">{errors.password.message}</p>}
        </div>

        <label className="flex items-center gap-2.5 text-sm text-ink-soft">
          <input type="checkbox" className="h-4 w-4 rounded border-line text-orange-500 focus:ring-orange-500" {...register('remember')} />
          Remember me
        </label>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-70">
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Log in'}
        </button>

        <div className="flex items-center gap-3 my-1">
          <div className="h-px bg-line flex-1" />
          <span className="text-xs text-ink-soft">or</span>
          <div className="h-px bg-line flex-1" />
        </div>

        <button type="button" className="btn-ghost w-full py-3.5">
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.87 2.7-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 009 18z"/><path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.97H.98A9 9 0 000 9c0 1.45.35 2.83.98 4.03l2.97-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.98 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z"/></svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-ink-soft mt-2">
          New to CivicLens? <Link to="/signup" className="font-semibold text-orange-600 hover:text-orange-700">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
