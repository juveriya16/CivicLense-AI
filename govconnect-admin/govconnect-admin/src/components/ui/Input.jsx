export default function Input({ label, error, className = '', id, ...props }) {
  return (
    <label className="block" htmlFor={id}>
      {label && (
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-700">
          {label}
        </span>
      )}
      <input
        id={id}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors ${
          error ? 'border-status-red' : 'border-line focus:border-brand'
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-status-red">{error}</span>}
    </label>
  )
}
