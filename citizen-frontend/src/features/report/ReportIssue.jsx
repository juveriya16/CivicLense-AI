import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, Camera, X, MapPin, Sparkles, Loader2, CheckCircle2, AlertTriangle, ImagePlus, LocateFixed } from 'lucide-react'
import { categories } from '../../mock/categories'
import CityMap from '../../components/map/CityMap'
import CameraCapture from '../../components/common/CameraCapture'
import { useToast } from '../../context/ToastContext'
import { useLanguage } from '../../context/LanguageContext'
import { useCurrentLocation } from '../../hooks/useCurrentLocation'

export default function ReportIssue() {
  const [images, setImages] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [detection, setDetection] = useState(null)
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const inputRef = useRef(null)
  const toast = useToast()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { status: locStatus, location, error: locError, detect: detectLocation } = useCurrentLocation()

  const runAnalysis = useCallback(() => {
    setAnalyzing(true)
    setDetection(null)
    // Replace this timeout with a real call to your vision-model endpoint,
    // e.g. POST /api/reports/classify with the uploaded image.
    setTimeout(() => {
      const result = {
        type: 'Pothole',
        categoryId: 'pothole',
        confidence: 94,
        severity: 'High',
        estDays: 3,
        duplicate: true,
        duplicateId: 'CL-0475',
      }
      setDetection(result)
      setCategory(result.categoryId)
      setAnalyzing(false)
    }, 1800)
  }, [])

  function addFiles(fileList) {
    const files = Array.from(fileList).slice(0, 6 - images.length)
    if (files.length === 0) return
    const withPreview = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }))
    setImages((prev) => [...prev, ...withPreview])
    runAnalysis()
  }

  function handleCameraCapture(file) {
    addFiles([file])
    toast.push('Photo captured.', 'success')
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }

  function removeImage(idx) {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (images.length === 0) { toast.push('Add at least one photo of the issue.', 'error'); return }
    if (!category) { toast.push('Select an issue category.', 'error'); return }
    setSubmitting(true)
    // Replace with a real POST /api/reports call — send images, category,
    // description, and location.lat/lng from the useCurrentLocation hook.
    await new Promise((r) => setTimeout(r, 1400))
    setSubmitting(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card p-10 max-w-md w-full text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }} className="h-20 w-20 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} />
          </motion.div>
          <h2 className="font-display text-3xl tracking-wide mb-2">REPORT SUBMITTED</h2>
          <p className="text-sm text-ink-soft mb-7">We'll notify you as soon as this is picked up and its status changes.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate('/app/my-reports')} className="btn-secondary flex-1">{t('myReports_title')}</button>
            <button onClick={() => navigate('/app/dashboard')} className="btn-ghost flex-1">Back to dashboard</button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <h1 className="font-display text-3xl tracking-wide text-ink mb-1">{t('report_title')}</h1>
      <p className="text-sm text-ink-soft mb-6">{t('report_subtitle')}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Upload */}
        <div className="card p-6">
          <label className="label mb-3 block">{t('report_photos')}</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`viewfinder rounded-2xl border-2 border-dashed transition-colors p-8 flex flex-col items-center text-center gap-3 ${dragActive ? 'border-orange-500 bg-orange-50/50' : 'border-line'}`}
          >
            <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <UploadCloud size={22} />
            </div>
            <p className="text-sm font-medium text-ink">{t('report_dragDrop')}</p>
            <p className="text-xs text-ink-soft">{t('report_orChoose')}</p>
            <div className="flex gap-3 mt-1">
              <button type="button" onClick={() => inputRef.current?.click()} className="btn-ghost text-sm px-4 py-2.5">
                <ImagePlus size={15} /> {t('report_chooseFiles')}
              </button>
              <button type="button" onClick={() => setCameraOpen(true)} disabled={images.length >= 6} className="btn-secondary text-sm px-4 py-2.5 disabled:opacity-50">
                <Camera size={15} /> {t('report_useCamera')}
              </button>
            </div>
            {/* Plain file picker — not tied to the camera button, so desktop users
                correctly get a file browser here instead of a fake camera prompt. */}
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} />
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-navy-950/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI detection card */}
        <AnimatePresence>
          {(analyzing || detection) && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="rounded-3xl bg-navy-950 bg-noise text-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-orange-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/60">AI Detection</span>
                </div>

                {analyzing ? (
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <Loader2 size={18} className="animate-spin text-orange-500" />
                    Analysing photo for issue type and severity…
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-[11px] text-white/40 uppercase tracking-wide">Issue Type</p>
                      <p className="font-display text-xl tracking-wide mt-0.5">{detection.type}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-white/40 uppercase tracking-wide">Confidence</p>
                      <p className="font-display text-xl tracking-wide mt-0.5 text-orange-500">{detection.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-white/40 uppercase tracking-wide">Severity</p>
                      <p className="font-display text-xl tracking-wide mt-0.5">{detection.severity}</p>
                    </div>
                    <div className="sm:col-span-3">
                      <p className="text-[11px] text-white/40 uppercase tracking-wide">Estimated Resolution</p>
                      <p className="text-sm mt-0.5 text-white/80">{detection.estDays} days from assignment</p>
                    </div>
                    {detection.duplicate && (
                      <div className="sm:col-span-3 flex items-start gap-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 p-3.5 mt-1">
                        <AlertTriangle size={16} className="text-orange-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-orange-200 leading-relaxed">
                          A similar report <span className="font-mono font-semibold">{detection.duplicateId}</span> already exists within 100m. It may be merged to avoid duplication.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category */}
        <div className="card p-6">
          <label className="label mb-3 block">{t('report_category')}</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {categories.map((c) => {
              const Icon = c.icon
              const active = category === c.id
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-3.5 text-xs font-medium transition-all ${active ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-line hover:border-navy-300 text-ink-soft'}`}
                >
                  <Icon size={20} />
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Description */}
        <div className="card p-6">
          <label className="label mb-3 block">{t('report_description')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe what's wrong, how long it's been an issue, and anything officers should know…"
            className="input-field resize-none"
          />
        </div>

        {/* Location */}
        <div className="card p-6">
          <label className="label mb-3 block">{t('report_location')}</label>

          {locStatus === 'idle' && (
            <button type="button" onClick={detectLocation} className="w-full flex items-center gap-3 rounded-2xl border border-dashed border-line px-4 py-4 text-sm font-medium text-ink-soft hover:border-orange-500 hover:text-orange-600 transition-colors">
              <MapPin size={18} /> {t('report_detectLocation')}
            </button>
          )}

          {locStatus === 'locating' && (
            <div className="w-full flex items-center gap-3 rounded-2xl border border-line px-4 py-4 text-sm font-medium text-ink-soft">
              <Loader2 size={18} className="animate-spin text-orange-500" /> {t('report_locating')}
            </div>
          )}

          {locStatus === 'error' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5 rounded-2xl bg-danger/5 border border-danger/20 px-4 py-3.5 text-sm text-danger">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                {locError}
              </div>
              <button type="button" onClick={detectLocation} className="btn-ghost text-sm self-start">
                <LocateFixed size={15} /> Try again
              </button>
            </div>
          )}

          {locStatus === 'done' && location && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-ink">
                <MapPin size={16} className="text-orange-500 shrink-0" />
                {location.address}
              </div>
              <CityMap
                reports={[{ id: 'new', lat: location.lat, lng: location.lng, title: 'Your report location', address: location.address, status: 'submitted', category: category || 'others' }]}
                single
                height={240}
              />
              <button type="button" onClick={detectLocation} className="text-xs font-semibold text-orange-600 hover:text-orange-700 self-start flex items-center gap-1">
                <LocateFixed size={13} /> Re-detect location
              </button>
            </div>
          )}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-base disabled:opacity-70">
          {submitting ? <Loader2 size={19} className="animate-spin" /> : t('report_submit')}
        </button>
      </form>

      {cameraOpen && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setCameraOpen(false)}
          onFallbackUpload={() => inputRef.current?.click()}
        />
      )}
    </div>
  )
}
