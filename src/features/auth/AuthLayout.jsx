import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ScanLine, ShieldCheck, MapPin, TrendingUp } from 'lucide-react'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex bg-surface">
      <div className="hidden lg:flex w-[42%] bg-navy-950 bg-noise text-white relative overflow-hidden flex-col justify-between p-10">
        <motion.div
          className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-orange-500/25 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <Link to="/" className="flex items-center gap-2.5 relative">
          <div className="h-9 w-9 rounded-xl bg-orange-500 flex items-center justify-center">
            <ScanLine size={18} strokeWidth={2.4} />
          </div>
          <span className="font-display text-2xl tracking-wide pt-1">CivicLens</span>
        </Link>

        <div className="relative">
          <p className="font-display text-4xl leading-tight tracking-wide mb-4">
            YOUR CITY,<br />ONE PHOTO AWAY.
          </p>
          <p className="text-white/50 text-sm max-w-xs">
            Join thousands of citizens making their neighbourhood better, one report at a time.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {[
              { icon: MapPin, text: 'Auto-pinned GPS location on every report' },
              { icon: ShieldCheck, text: 'Transparent, real-time status tracking' },
              { icon: TrendingUp, text: 'Earn badges as your reports get resolved' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-white/70">
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-orange-500" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/30">© 2026 CivicLens. Built for citizens.</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="h-8 w-8 rounded-lg bg-navy-900 flex items-center justify-center">
              <ScanLine size={16} className="text-orange-500" />
            </div>
            <span className="font-display text-xl tracking-wide text-navy-900">CivicLens</span>
          </div>
          <h1 className="font-display text-3xl tracking-wide text-ink mb-1.5">{title}</h1>
          {subtitle && <p className="text-sm text-ink-soft mb-8">{subtitle}</p>}
          {children}
        </motion.div>
      </div>
    </div>
  )
}
