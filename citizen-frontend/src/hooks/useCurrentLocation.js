import { useCallback, useState } from 'react'

export function useCurrentLocation() {
  const [status, setStatus] = useState('idle') // idle | locating | done | error
  const [location, setLocation] = useState(null) // { lat, lng, address }
  const [error, setError] = useState(null)

  const detect = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error')
      setError('Geolocation is not supported by this browser.')
      return
    }

    setStatus('locating')
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        let address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { headers: { Accept: 'application/json' } }
          )
          if (res.ok) {
            const data = await res.json()
            if (data?.display_name) address = data.display_name
          }
        } catch {
          // Reverse geocoding failed (offline / rate-limited) — fall back to raw coordinates.
        }
        setLocation({ lat, lng, address })
        setStatus('done')
      },
      (err) => {
        setStatus('error')
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location permission was denied. Enable it in your browser settings and try again.')
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError('Your location could not be determined right now.')
        } else if (err.code === err.TIMEOUT) {
          setError('Locating you took too long. Try again.')
        } else {
          setError('Could not detect your location.')
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    )
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setLocation(null)
    setError(null)
  }, [])

  return { status, location, error, detect, reset }
}
