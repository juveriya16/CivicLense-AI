export default function Topbar({ title, subtitle, actions }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper/90 px-8 py-6 backdrop-blur">
      <div>
        <h1 className="font-display text-2xl uppercase tracking-wide text-ink-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-700/70">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
