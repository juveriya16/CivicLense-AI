import { motion } from 'framer-motion'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center py-16 px-6"
    >
      <div className="h-16 w-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-5">
        {Icon && <Icon size={28} />}
      </div>
      <h3 className="font-display text-2xl tracking-wide text-ink mb-1.5">{title}</h3>
      <p className="text-sm text-ink-soft max-w-sm mb-6">{description}</p>
      {action}
    </motion.div>
  )
}
