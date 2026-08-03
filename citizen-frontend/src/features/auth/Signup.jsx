import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Upload, MapPin, CheckCircle2, ArrowRight, ArrowLeft, Loader2, PartyPopper } from 'lucide-react'
import AuthLayout from './AuthLayout'
import PasswordStrength from '../../components/common/PasswordStrength'
import { useAuth } from '../../context/AuthContext'

const STEPS = ['Account', 'Security', 'Location', 'Review']

const FIELDS_BY_STEP = [
  ['fullName', 'username', 'email', 'phone'],
  ['password', 'confirmPassword', 'dob', 'gender'],
  ['city', 'state', 'pincode'],
  ['terms'],
]

export default function Signup() {
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [locationGranted, setLocationGranted] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef(null)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm({ mode: 'onTouched' })
  const password = watch('password')

  async function next() {
    const valid = await trigger(FIELDS_BY_STEP[step])
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0))
  }

  async function onSubmit(data) {
    setLoading(true)
    await signup(data)
    setLoading(false)
    setSuccess(true)
    setTimeout(() => navigate('/app/dashboard'), 1800)
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (file) setPhotoPreview(URL.createObjectURL(file))
  }

  if (success) {
    return (
      <AuthLayout title="" subtitle="">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-6">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
            className="h-20 w-20 rounded-full bg-success/10 text-success flex items-center justify-center mb-6"
          >
            <PartyPopper size={34} />
          </motion.div>
          <h2 className="font-display text-3xl tracking-wide mb-2">WELCOME TO CIVICLENS</h2>
          <p className="text-sm text-ink-soft max-w-xs">Your account is ready. Taking you to your citizen dashboard…</p>
          <Loader2 className="animate-spin mt-6 text-orange-500" size={22} />
        </motion.div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join CivicLens and start improving your neighbourhood today.">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-7">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1">
            <div className={`h-1.5 rounded-full transition-colors ${i <= step ? 'bg-orange-500' : 'bg-surface-alt'}`} />
            <p className={`text-[11px] mt-1.5 font-medium ${i <= step ? 'text-ink' : 'text-ink-soft'}`}>{label}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-5">
              <div className="flex flex-col items-center mb-1">
                <button type="button" onClick={() => fileRef.current?.click()} className="relative h-20 w-20 rounded-full bg-surface-alt border-2 border-dashed border-line flex items-center justify-center overflow-hidden hover:border-orange-500 transition-colors">
                  {photoPreview ? <img src={photoPreview} alt="" className="h-full w-full object-cover" /> : <Upload size={20} className="text-ink-soft" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                <p className="text-xs text-ink-soft mt-2">Profile photo (optional)</p>
              </div>
              <Field label="Full Name" error={errors.fullName}>
                <input className="input-field" placeholder="Aarav Mehta" {...register('fullName', { required: 'Full name is required' })} />
              </Field>
              <Field label="Username" error={errors.username}>
                <input className="input-field" placeholder="aarav.mehta" {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'At least 3 characters' } })} />
              </Field>
              <Field label="Email" error={errors.email}>
                <input type="email" className="input-field" placeholder="you@example.com" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
              </Field>
              <Field label="Phone Number" error={errors.phone}>
                <input className="input-field" placeholder="+91 98200 11234" {...register('phone', { required: 'Phone number is required', pattern: { value: /^[+\d][\d\s-]{7,}$/, message: 'Enter a valid phone number' } })} />
              </Field>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-5">
              <Field label="Password" error={errors.password}>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} className="input-field pr-11" placeholder="••••••••" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })} />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </Field>
              <Field label="Confirm Password" error={errors.confirmPassword}>
                <input type={showPassword ? 'text' : 'password'} className="input-field" placeholder="••••••••" {...register('confirmPassword', { required: 'Please confirm your password', validate: (v) => v === password || 'Passwords do not match' })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Date of Birth" error={errors.dob}>
                  <input type="date" className="input-field" {...register('dob', { required: 'Required' })} />
                </Field>
                <Field label="Gender" error={errors.gender}>
                  <select className="input-field" {...register('gender', { required: 'Required' })}>
                    <option value="">Select</option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </Field>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-5">
              <Field label="City" error={errors.city}>
                <input className="input-field" placeholder="Mumbai" {...register('city', { required: 'Required' })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="State" error={errors.state}>
                  <input className="input-field" placeholder="Maharashtra" {...register('state', { required: 'Required' })} />
                </Field>
                <Field label="Pincode" error={errors.pincode}>
                  <input className="input-field" placeholder="400069" {...register('pincode', { required: 'Required', pattern: { value: /^\d{6}$/, message: '6 digits' } })} />
                </Field>
              </div>
              <button
                type="button"
                onClick={() => setLocationGranted(true)}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-medium transition-colors ${locationGranted ? 'border-success/40 bg-success/5 text-success' : 'border-line hover:border-orange-500'}`}
              >
                {locationGranted ? <CheckCircle2 size={18} /> : <MapPin size={18} className="text-ink-soft" />}
                {locationGranted ? 'Current location enabled' : 'Allow current location access'}
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-5">
              <div className="rounded-2xl bg-surface-alt p-4 text-sm text-ink-soft leading-relaxed">
                You're almost there — review your details, agree to the terms, and create your account.
              </div>
              <label className="flex items-start gap-3 text-sm text-ink-soft">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-line text-orange-500 focus:ring-orange-500" {...register('terms', { required: 'You must accept the terms to continue' })} />
                I agree to the <a href="#" className="text-orange-600 font-medium">Terms &amp; Conditions</a> and Privacy Policy.
              </label>
              {errors.terms && <p className="text-xs text-danger -mt-3">{errors.terms.message}</p>}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 mt-2">
          {step > 0 && (
            <button type="button" onClick={back} className="btn-ghost flex-1 py-3.5">
              <ArrowLeft size={16} /> Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary flex-1 py-3.5">
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3.5 disabled:opacity-70">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
            </button>
          )}
        </div>

        <p className="text-center text-sm text-ink-soft">
          Already have an account? <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-700">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="label mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-xs text-danger mt-1.5">{error.message}</p>}
    </div>
  )
}
