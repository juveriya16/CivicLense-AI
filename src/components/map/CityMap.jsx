import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet'
import L from 'leaflet'
import { statusMeta } from '../../mock/reports'
import { getCategory } from '../../mock/categories'

function pinIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(16,25,46,0.35)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

export default function CityMap({ reports = [], center, height = 320, single = false }) {
  const mapCenter = center ?? (reports[0] ? [reports[0].lat, reports[0].lng] : [19.1197, 72.8697])

  return (
    <div style={{ height }} className="rounded-2xl overflow-hidden relative z-0">
      <MapContainer center={mapCenter} zoom={single ? 15 : 13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((r) => {
          const meta = statusMeta[r.status] ?? statusMeta.submitted
          const cat = getCategory(r.category)
          return (
            <Marker key={r.id} position={[r.lat, r.lng]} icon={pinIcon(meta.color)}>
              <Popup>
                <div className="text-xs">
                  <p className="font-semibold text-sm mb-0.5">{r.title}</p>
                  <p className="text-ink-soft">{r.id} · {cat.label}</p>
                  <p className="text-ink-soft">{r.address}</p>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
