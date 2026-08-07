import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import Topbar from '../components/layout/Topbar'
import { useComplaints } from '../hooks/useComplaints'

const PRIORITY_COLOR = {
  critical: '#DC2626',
  high: '#DC2626',
  medium: '#D97706',
  low: '#15803D',
}

export default function Hotspots() {
  const { complaints, loading } = useComplaints()
  const located = complaints.filter((c) => c.latitude && c.longitude)
  const center = located.length
    ? [located[0].latitude, located[0].longitude]
    : [20.5937, 78.9629] // India, default view until real data loads

  return (
    <div>
      <Topbar title="Hotspots" subtitle="Geographic clustering of active complaints" />
      <div className="p-8">
        {loading ? (
          <p className="text-sm text-ink/50">Loading…</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-line" style={{ height: '70vh' }}>
            <MapContainer center={center} zoom={located.length ? 12 : 5} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {located.map((c) => (
                <CircleMarker
                  key={c.id}
                  center={[c.latitude, c.longitude]}
                  radius={8}
                  pathOptions={{
                    color: PRIORITY_COLOR[c.priority] ?? '#FF6A2B',
                    fillColor: PRIORITY_COLOR[c.priority] ?? '#FF6A2B',
                    fillOpacity: 0.7,
                  }}
                >
                  <Popup>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-xs text-ink/60">{c.ticket_no}</p>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        )}
        {!loading && located.length === 0 && (
          <p className="mt-3 text-sm text-ink/50">
            No complaints have coordinates yet — the map will populate as located complaints come in.
          </p>
        )}
      </div>
    </div>
  )
}
