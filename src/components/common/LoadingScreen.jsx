import { motion } from 'framer-motion'
import { ScanLine } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        className="h-12 w-12 rounded-2xl bg-navy-900 flex items-center justify-center"
      >
        <ScanLine size={22} className="text-orange-500" />
      </motion.div>
    </div>
  )
}
