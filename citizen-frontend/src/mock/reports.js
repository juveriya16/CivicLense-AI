// Mock complaint records — this array is intentionally EMPTY.
// Replace `reports` with data from your backend (e.g. a TanStack Query hook
// hitting GET /api/reports). The shape citizens' reports should follow is
// documented below so your API/DB schema lines up with the UI:
//
// {
//   id, category, title, description, status, severity, confidence,
//   createdAt, updatedAt, estResolution, address, lat, lng, images,
//   officer, timeline: [{ stage, label, at, note }]
// }
export const reports = []

export const getReport = (id) => reports.find(r => r.id === id)

export const statusMeta = {
  submitted:   { label: 'Submitted',   color: '#4b5670', bg: '#eef1f8' },
  assigned:    { label: 'Assigned',    color: '#e0a72b', bg: '#fff8e8' },
  in_progress: { label: 'In Progress', color: '#2c7bd6', bg: '#eaf3fd' },
  resolved:    { label: 'Resolved',    color: '#1e9e6b', bg: '#e9f9f2' },
  rejected:    { label: 'Rejected',    color: '#e0472f', bg: '#fdeeec' },
}

export const severityMeta = {
  low:    { label: 'LOW',    color: '#1e9e6b' },
  medium: { label: 'MEDIUM', color: '#e0a72b' },
  high:   { label: 'HIGH',   color: '#e0472f' },
}
