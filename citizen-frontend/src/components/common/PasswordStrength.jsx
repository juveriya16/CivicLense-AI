function scorePassword(pwd = '') {
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return score
}

const LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']
const COLORS = ['#e0472f', '#e0472f', '#e0a72b', '#2c7bd6', '#1e9e6b']

export default function PasswordStrength({ password }) {
  const score = scorePassword(password)
  if (!password) return null
  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full bg-surface-alt overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: i < score ? '100%' : '0%', background: COLORS[score] }}
            />
          </div>
        ))}
      </div>
      <p className="text-xs mt-1.5 font-medium" style={{ color: COLORS[score] }}>{LABELS[score]}</p>
    </div>
  )
}
