import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, Camera } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SUGGESTIONS = [
  'Report a pothole near me',
  'When will CL-0481 be resolved?',
  'How is severity calculated?',
]

export default function FloatingAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'ai', text: "Hi, I'm Lens — your civic assistant. Ask me about a report, or say what's wrong and I'll help you file it." },
  ])
  const [input, setInput] = useState('')
  const navigate = useNavigate()

  function send(text) {
    const value = text ?? input
    if (!value.trim()) return
    setMessages((m) => [...m, { from: 'user', text: value }])
    setInput('')
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'ai', text: 'Got it — I\'d suggest opening the Report Issue page so I can analyse a photo and pin the exact location.' }])
    }, 700)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="fixed bottom-24 right-5 z-50 w-[min(340px,90vw)] rounded-3xl bg-card shadow-glass-lg border border-line flex flex-col overflow-hidden"
            style={{ height: 440 }}
          >
            <div className="bg-navy-950 bg-noise px-4 py-3.5 flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                <Sparkles size={15} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white leading-none">Lens Assistant</p>
                <p className="text-[11px] text-white/50 mt-0.5">Always online</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white p-1">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.from === 'ai' ? 'bg-surface-alt text-ink self-start rounded-tl-sm' : 'bg-orange-500 text-white self-end rounded-tr-sm'
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {messages.length === 1 && (
                <div className="flex flex-col gap-1.5 mt-1">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="text-left text-xs px-3 py-2 rounded-xl border border-line hover:border-orange-500 hover:text-orange-600 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-line p-2.5 flex items-center gap-2">
              <button onClick={() => navigate('/app/report')} className="p-2 rounded-full text-ink-soft hover:bg-surface-alt" title="Report an issue">
                <Camera size={18} />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask Lens…"
                className="flex-1 text-sm outline-none bg-transparent"
              />
              <button onClick={() => send()} className="p-2 rounded-full bg-navy-900 text-white hover:bg-navy-800">
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-orange-500 text-white flex items-center justify-center"
        style={{ boxShadow: 'var(--shadow-glow-orange)' }}
        aria-label="Open Lens assistant"
      >
        <AnimatePresence mode="wait">
          <motion.span key={open ? 'x' : 'a'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
            {open ? <X size={22} /> : <Sparkles size={22} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </>
  )
}
