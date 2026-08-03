import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ScanLine, MapPin, Zap, ShieldCheck } from 'lucide-react'

const FEATURES = [
  { icon: ScanLine, title: 'Snap & classify', desc: 'Take a photo — our AI identifies the issue type in seconds.' },
  { icon: MapPin, title: 'Auto geo-tag', desc: 'Your location is pinned automatically, no typing addresses.' },
  { icon: Zap, title: 'Smart priority', desc: 'Severity is scored instantly so urgent issues rise first.' },
  { icon: ShieldCheck, title: 'Track it live', desc: 'Follow every status change from submitted to resolved.' },
]

export default function Welcome() {
  return (
    <div className="min-h-screen bg-navy-950 bg-noise text-white overflow-hidden relative">
      {/* Ambient animated gradient blobs */}
      <motion.div
        className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-orange-500/30 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-navy-600/40 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-24">
        <nav className="flex items-center justify-between mb-16 sm:mb-24">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-orange-500 flex items-center justify-center">
              <ScanLine size={18} strokeWidth={2.4} />
            </div>
            <span className="font-display text-2xl tracking-wide pt-1">CivicLens</span>
          </div>
          <Link to="/login" className="btn-ghost !bg-transparent !text-white !border-white/20 hover:!border-white/50 text-sm px-5 py-2.5">
            Log in
          </Link>
        </nav>

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/70 mb-6"
            >
              <span className="status-dot bg-orange-500" />
              Live across Andheri East, Mumbai
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[3.2rem] sm:text-[4.5rem] leading-[0.95] tracking-wide"
            >
              SEE SOMETHING
              <br />
              <span className="text-orange-500">BROKEN?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-lg text-white/60 max-w-md font-sans"
            >
              Snap a photo, we handle the rest. CivicLens uses computer vision to classify, prioritise, and route civic
              issues — so your city fixes what matters, faster.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link to="/signup" className="btn-primary text-base px-7 py-3.5">
                Get Started <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-ghost !bg-transparent !text-white !border-white/20 hover:!border-white/50">
                I already have an account
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-14 flex items-center gap-8 text-white/50 text-sm"
            >
              <div><span className="text-white font-display text-2xl tracking-wide">1,204</span><br />reports filed</div>
              <div className="h-8 w-px bg-white/15" />
              <div><span className="text-white font-display text-2xl tracking-wide">83%</span><br />resolved rate</div>
              <div className="h-8 w-px bg-white/15" />
              <div><span className="text-white font-display text-2xl tracking-wide">2.4d</span><br />avg. resolution</div>
            </motion.div>
          </div>

          {/* Illustration: viewfinder capture card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.25, type: 'spring' }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="viewfinder rounded-[2rem] bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 p-6 shadow-glass-lg">
              <div className="aspect-[4/5] rounded-2xl bg-navy-700/60 relative overflow-hidden flex items-center justify-center">
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'radial-gradient(circle at 50% 40%, rgba(255,107,44,0.25), transparent 60%)' }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative h-24 w-24 rounded-full border-2 border-orange-500/70 flex items-center justify-center">
                  <div className="h-14 w-14 rounded-full border-2 border-orange-500/40" />
                  <motion.div
                    className="absolute h-1 w-full bg-orange-500/60"
                    animate={{ y: [-48, 48, -48] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
                <span className="absolute bottom-4 left-4 right-4 text-center text-xs text-white/50 font-mono">ANALYSING PHOTO…</span>
              </div>
              <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">AI Detection</span>
                  <span className="text-xs font-semibold text-orange-500">96% confident</span>
                </div>
                <p className="text-sm font-medium">Pothole detected</p>
                <p className="text-xs text-white/40 mt-1">Severity: High · Est. resolution 3 days</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-24">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/[0.08] transition-colors"
            >
              <Icon size={20} className="text-orange-500 mb-3" />
              <p className="font-semibold text-sm mb-1">{title}</p>
              <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
