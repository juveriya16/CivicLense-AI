import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Sparkles, Download, CheckCircle2, Circle, Clock, XCircle } from 'lucide-react'
import { getReport, statusMeta, severityMeta } from '../../mock/reports'
import CategoryIcon from '../../components/common/CategoryIcon'
import StatusChip from '../../components/common/StatusChip'
import CityMap from '../../components/map/CityMap'
import EmptyState from '../../components/common/EmptyState'
import { useToast } from '../../context/ToastContext'

const STAGE_ORDER = ['submitted', 'assigned', 'in_progress', 'resolved']

function StageIcon({ done, rejected }) {
  if (rejected) return <XCircle size={16} />
  if (done) return <CheckCircle2 size={16} />
  return <Circle size={16} />
}

export default function TrackComplaint() {
  const { id } = useParams()
  const report = getReport(id)
  const navigate = useNavigate()
  const toast = useToast()

  if (!report) {
    return (
      <EmptyState
        icon={Clock}
        title="Report not found"
        description="This complaint may have been removed, or the link is incorrect."
        action={<button onClick={() => navigate('/app/my-reports')} className="btn-primary">Back to My Reports</button>}
      />
    )
  }

  const currentIdx = STAGE_ORDER.indexOf(report.status)
  const rejected = report.status === 'rejected'
  const progressPct = rejected ? 100 : ((currentIdx + 1) / STAGE_ORDER.length) * 100

  function downloadReport() {
    toast.push('Report summary downloaded as PDF (mock).', 'success')
  }

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <Link to="/app/my-reports" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink mb-5">
        <ArrowLeft size={15} /> Back to My Reports
      </Link>

      <div className="card p-6 mb-6">
        <div className="flex items-start gap-4">
          <CategoryIcon category={report.category} size={52} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-display text-2xl tracking-wide text-ink">{report.title}</h1>
              <StatusChip status={report.status} />
            </div>
            <p className="text-sm text-ink-soft flex items-center gap-1.5"><MapPin size={13} /> {report.address}</p>
            <p className="text-xs font-mono text-ink-soft/70 mt-1">{report.id} · Filed {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
          <button onClick={downloadReport} className="btn-ghost !px-3.5 shrink-0" title="Download report">
            <Download size={16} />
          </button>
        </div>

        {report.description && <p className="text-sm text-ink-soft leading-relaxed mt-4 pt-4 border-t border-line">{report.description}</p>}
      </div>

      {/* Progress bar */}
      {!rejected ? (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg tracking-wide text-ink">Progress</h3>
            <span className="text-xs font-semibold text-orange-600">{Math.round(progressPct)}% complete</span>
          </div>
          <div className="h-2.5 rounded-full bg-surface-alt overflow-hidden mb-4">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-300" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {STAGE_ORDER.map((s, i) => (
              <div key={s} className="flex flex-col items-center text-center gap-1.5">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${i <= currentIdx ? 'bg-orange-500 text-white' : 'bg-surface-alt text-ink-soft'}`}>
                  <StageIcon stage={s} done={i <= currentIdx} />
                </div>
                <span className={`text-[11px] font-medium ${i <= currentIdx ? 'text-ink' : 'text-ink-soft'}`}>{statusMeta[s].label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-danger/5 border border-danger/20 p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={18} className="text-danger" />
            <h3 className="font-display text-lg tracking-wide text-danger">Report Rejected</h3>
          </div>
          <p className="text-sm text-ink-soft">{report.rejectionReason}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        {/* AI prediction card */}
        <div className="rounded-3xl bg-navy-950 bg-noise text-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} className="text-orange-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">AI Prediction</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white/70">Confidence</span>
            <span className="font-display text-xl tracking-wide text-orange-500">{report.confidence}%</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white/70">Severity</span>
            <span className="font-display text-xl tracking-wide" style={{ color: severityMeta[report.severity].color }}>{severityMeta[report.severity].label}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">Est. Resolution</span>
            <span className="text-sm font-semibold">{report.estResolution ? new Date(report.estResolution).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</span>
          </div>
          {report.officer && (
            <div className="mt-4 pt-4 border-t border-white/10 text-sm text-white/70">
              Assigned to <span className="text-white font-medium">{report.officer}</span>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="card p-4">
          <CityMap reports={[report]} single height={220} />
        </div>
      </div>

      {report.images?.length > 0 && (
        <div className="card p-6 mb-6">
          <h3 className="font-display text-lg tracking-wide text-ink mb-4">Uploaded Images</h3>
          <div className="grid grid-cols-3 gap-3">
            {report.images.map((n) => (
              <div key={n} className="aspect-square rounded-xl overflow-hidden bg-surface-alt flex items-center justify-center">
                <CategoryIcon category={report.category} size={40} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline / comments */}
      <div className="card p-6">
        <h3 className="font-display text-lg tracking-wide text-ink mb-5">Timeline</h3>
        <div className="flex flex-col gap-0">
          {report.timeline.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`h-3 w-3 rounded-full ${t.stage === 'rejected' ? 'bg-danger' : t.stage === 'resolved' ? 'bg-success' : 'bg-orange-500'}`} />
                {i < report.timeline.length - 1 && <div className="w-px flex-1 bg-line my-1" />}
              </div>
              <div className="pb-6">
                <p className="text-sm font-semibold text-ink">{t.label}</p>
                <p className="text-xs text-ink-soft mt-0.5">{new Date(t.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                {t.note && <p className="text-sm text-ink-soft mt-1.5 bg-surface-alt rounded-xl px-3 py-2">{t.note}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
