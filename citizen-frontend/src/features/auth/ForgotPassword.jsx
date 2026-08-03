import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, KeyRound, Lock, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react'
import AuthLayout from './AuthLayout'
import PasswordStrength from '../../components/common/PasswordStrength'

export default function ForgotPassword() {
  const [stage, setStage] = useState('email') // email -> otp -> reset -> success
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(new Array(4).fill(''))
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const inputsRef = useRef([])

  async function submitEmail(e) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    setStage('otp')
  }

  function handleOtpChange(i, val) {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 3) inputsRef.current[i + 1]?.focus()
  }

  async function submitOtp(e) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    setStage('reset')
  }

  async function submitReset(e) {
    e.preventDefault()
    if (password !== confirm || password.length < 8) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    setStage('success')
  }

  return (
    <AuthLayout
      title={{ email: 'Forgot password?', otp: 'Verify your email', reset: 'Set a new password', success: '' }[stage]}
      subtitle={{
        email: 'Enter your email and we\u2019ll send you a verification code.',
        otp: `We sent a 4-digit code to ${email || 'your email'}.`,
        reset: 'Choose a strong password you haven\u2019t used before.',
        success: '',
      }[stage]}
    >
      <AnimatePresence mode="wait">
        {stage === 'email' && (
          <motion.form key="email" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} onSubmit={submitEmail} className="flex flex-col gap-5">
            <div>
              <label className="label mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field pl-11" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-70">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send verification code'}
            </button>
            <Link to="/login" className="text-center text-sm text-ink-soft hover:text-ink flex items-center justify-center gap-1.5">
              <ArrowLeft size={14} /> Back to login
            </Link>
          </motion.form>
        )}

        {stage === 'otp' && (
          <motion.form key="otp" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} onSubmit={submitOtp} className="flex flex-col gap-6">
            <div className="flex items-center justify-center gap-3">
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  value={v}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  maxLength={1}
                  className="h-14 w-14 text-center text-xl font-semibold rounded-2xl border border-line focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
                />
              ))}
            </div>
            <button type="submit" disabled={loading || otp.some((d) => !d)} className="btn-primary w-full py-3.5 disabled:opacity-70">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify code'}
            </button>
            <p className="text-center text-sm text-ink-soft">
              Didn't get a code? <button type="button" className="font-semibold text-orange-600">Resend</button>
            </p>
          </motion.form>
        )}

        {stage === 'reset' && (
          <motion.form key="reset" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} onSubmit={submitReset} className="flex flex-col gap-5">
            <div>
              <label className="label mb-1.5 block">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-11" placeholder="••••••••" />
              </div>
              <PasswordStrength password={password} />
            </div>
            <div>
              <label className="label mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
                <input required type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-field pl-11" placeholder="••••••••" />
              </div>
              {confirm && confirm !== password && <p className="text-xs text-danger mt-1.5">Passwords do not match</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-70">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Reset password'}
            </button>
          </motion.form>
        )}

        {stage === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} className="h-20 w-20 rounded-full bg-success/10 text-success flex items-center justify-center mb-6">
              <CheckCircle2 size={34} />
            </motion.div>
            <h2 className="font-display text-3xl tracking-wide mb-2">PASSWORD RESET</h2>
            <p className="text-sm text-ink-soft max-w-xs mb-7">Your password has been updated. You can now log in with your new password.</p>
            <Link to="/login" className="btn-primary w-full py-3.5">Back to login</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  )
}
