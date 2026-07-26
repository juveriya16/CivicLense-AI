import { CloudRain, Droplets, Wind } from 'lucide-react'
import { weatherMock } from '../../mock/data'

export default function WeatherWidget() {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-navy-800 to-navy-950 text-white p-5 relative overflow-hidden">
      <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-orange-500/20 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs text-white/50">{weatherMock.location}</p>
          <p className="font-display text-4xl tracking-wide mt-1">{weatherMock.tempC}°C</p>
          <p className="text-sm text-white/70 mt-0.5">{weatherMock.condition}</p>
        </div>
        <CloudRain size={40} className="text-orange-400" />
      </div>
      <div className="relative flex items-center gap-5 mt-4 pt-4 border-t border-white/10 text-xs text-white/60">
        <span className="flex items-center gap-1.5"><Droplets size={13} /> {weatherMock.humidity}%</span>
        <span className="flex items-center gap-1.5"><Wind size={13} /> {weatherMock.windKph} km/h</span>
      </div>
    </div>
  )
}
