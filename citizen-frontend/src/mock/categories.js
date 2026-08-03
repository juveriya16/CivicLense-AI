import { Construction, Trash2, Lightbulb, TrafficCone, Droplets, RectangleHorizontal, MoreHorizontal } from 'lucide-react'

export const categories = [
  { id: 'pothole', label: 'Pothole', icon: Construction, color: '#ff6b2c', avgDays: 3 },
  { id: 'garbage', label: 'Garbage', icon: Trash2, color: '#1e9e6b', avgDays: 1 },
  { id: 'streetlight', label: 'Streetlight', icon: Lightbulb, color: '#e0a72b', avgDays: 2 },
  { id: 'traffic_signal', label: 'Traffic Signal', icon: TrafficCone, color: '#e0472f', avgDays: 2 },
  { id: 'water_leakage', label: 'Water Leakage', icon: Droplets, color: '#2c7bd6', avgDays: 4 },
  { id: 'road_crack', label: 'Road Crack', icon: RectangleHorizontal, color: '#7a5ff2', avgDays: 5 },
  { id: 'others', label: 'Others', icon: MoreHorizontal, color: '#4b5670', avgDays: 4 },
]

export const getCategory = (id) => categories.find(c => c.id === id) ?? categories[categories.length - 1]
