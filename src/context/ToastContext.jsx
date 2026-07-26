import { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const ACCENTS = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-navy-700',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const push = useCallback((message, type = 'success', duration = 3500) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => dismiss(id), duration)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 w-[min(360px,90vw)]">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type] ?? Info
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="glass rounded-2xl px-4 py-3 flex items-start gap-3"
              >
                <Icon size={20} className={`shrink-0 mt-0.5 ${ACCENTS[t.type] ?? ''}`} />
                <p className="text-sm text-ink flex-1">{t.message}</p>
                <button onClick={() => dismiss(t.id)} className="text-ink-soft hover:text-ink">
                  <X size={16} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
