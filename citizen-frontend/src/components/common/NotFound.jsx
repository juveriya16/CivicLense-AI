import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ScanLine, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-950 bg-noise text-white flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <motion.div
        className="absolute h-96 w-96 rounded-full bg-orange-500/20 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <div className="relative viewfinder p-10">
        <ScanLine size={40} className="text-orange-500 mx-auto mb-6" />
        <h1 className="font-display text-8xl tracking-wide leading-none">404</h1>
        <p className="font-display text-2xl tracking-wide mt-3">SIGNAL LOST</p>
        <p className="text-white/50 text-sm mt-3 max-w-xs mx-auto">This page couldn't be located — even our AI couldn't classify it.</p>
        <Link to="/app/dashboard" className="btn-primary mt-7">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
