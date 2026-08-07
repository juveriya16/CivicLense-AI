export default function Button({ variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-dark',
    secondary: 'bg-white text-ink-900 border border-line hover:bg-paper',
    danger: 'bg-status-red text-white hover:opacity-90',
    ghost: 'text-ink-900 hover:bg-ink-900/5',
    dark: 'bg-ink-900 text-white hover:bg-ink-800',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
