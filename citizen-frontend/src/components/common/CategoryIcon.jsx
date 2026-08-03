import { getCategory } from '../../mock/categories'

export default function CategoryIcon({ category, size = 44 }) {
  const cat = getCategory(category)
  const Icon = cat.icon
  return (
    <div
      className="flex items-center justify-center rounded-2xl shrink-0"
      style={{ width: size, height: size, background: `${cat.color}1a`, color: cat.color }}
    >
      <Icon size={size * 0.5} />
    </div>
  )
}
