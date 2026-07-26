import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { X, RefreshCw, Camera as CameraIcon, AlertTriangle, UploadCloud } from 'lucide-react'

export default function CameraCapture({ onCapture, onClose, onFallbackUpload }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [facingMode, setFacingMode] = useState('environment') // 'environment' = back, 'user' = front
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  const startStream = useCallback(async (mode) => {
    setError(null)
    setReady(false)
    stopStream()

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera access is not supported in this browser.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setReady(true)
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Camera permission was denied. Allow camera access in your browser settings, or upload a photo instead.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera was found on this device. Upload a photo instead.')
      } else if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        setError('Camera access needs a secure (HTTPS) connection. Upload a photo instead.')
      } else {
        setError('Could not access the camera. Upload a photo instead.')
      }
    }
  }, [stopStream])

  useEffect(() => {
    startStream(facingMode)
    return () => stopStream()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode])

  function switchCamera() {
    setFacingMode((m) => (m === 'environment' ? 'user' : 'environment'))
  }

  function capture() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !ready) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    // Mirror the preview back if using the front camera, so the captured photo matches what was framed.
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
      onCapture(file)
      handleClose()
    }, 'image/jpeg', 0.92)
  }

  function handleClose() {
    stopStream()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={handleClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg rounded-3xl bg-navy-950 border border-white/10 overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <p className="text-sm font-semibold text-white flex items-center gap-2"><CameraIcon size={16} className="text-orange-500" /> Camera</p>
          <button onClick={handleClose} className="text-white/60 hover:text-white p-1"><X size={18} /></button>
        </div>

        <div className="relative aspect-[4/3] bg-black flex items-center justify-center">
          {error ? (
            <div className="flex flex-col items-center text-center gap-3 px-8">
              <AlertTriangle size={28} className="text-orange-500" />
              <p className="text-sm text-white/70">{error}</p>
              {onFallbackUpload && (
                <button type="button" onClick={() => { handleClose(); onFallbackUpload() }} className="btn-primary text-sm px-4 py-2.5 mt-2">
                  <UploadCloud size={15} /> Upload instead
                </button>
              )}
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
              style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
            />
          )}
          {!error && (
            <div className="viewfinder absolute inset-6 rounded-2xl pointer-events-none" />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {!error && (
          <div className="flex items-center justify-center gap-6 px-5 py-5">
            <button
              type="button"
              onClick={switchCamera}
              className="h-11 w-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              title="Switch camera"
            >
              <RefreshCw size={17} />
            </button>
            <button
              type="button"
              onClick={capture}
              disabled={!ready}
              className="h-16 w-16 rounded-full bg-white ring-4 ring-white/25 flex items-center justify-center disabled:opacity-50"
              aria-label="Capture photo"
            >
              <span className="h-12 w-12 rounded-full bg-orange-500" />
            </button>
            <span className="h-11 w-11 rounded-full flex items-center justify-center text-[10px] font-semibold text-white/50 uppercase tracking-wide">
              {facingMode === 'environment' ? 'Back' : 'Front'}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  )
}
