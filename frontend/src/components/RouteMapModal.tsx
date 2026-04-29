import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'

interface RouteMapModalProps {
  open: boolean
  onClose: () => void
}

export default function RouteMapModal({ open, onClose }: RouteMapModalProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const polylineRef = useRef<L.Polyline | null>(null)
  const markerRef = useRef<L.CircleMarker | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const animRef = useRef<number | null>(null)

  const routeCoords: L.LatLngExpression[] = [
    [10.7743, 106.7208],
    [10.7750, 106.7215],
    [10.7760, 106.7220],
    [10.7770, 106.7218],
    [10.7775, 106.7210],
    [10.7780, 106.7200],
    [10.7775, 106.7190],
    [10.7765, 106.7185],
    [10.7755, 106.7188],
    [10.7748, 106.7195],
    [10.7743, 106.7208],
  ]

  useEffect(() => {
    if (!open || !mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current, {
      center: [10.7762, 106.7202],
      zoom: 15,
      zoomControl: false,
    })
    mapInstance.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    const polyline = L.polyline(routeCoords, {
      color: '#6FA234',
      weight: 4,
      opacity: 0.9,
    }).addTo(map)
    polylineRef.current = polyline

    const marker = L.circleMarker(routeCoords[0], {
      radius: 8,
      fillColor: '#6FA234',
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 1,
    }).addTo(map)
    markerRef.current = marker

    map.fitBounds(polyline.getBounds(), { padding: [20, 20] })

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      map.remove()
      mapInstance.current = null
      polylineRef.current = null
      markerRef.current = null
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      setIsPlaying(false)
      setProgress(0)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [open])

  const toggleAnim = () => {
    if (isPlaying) {
      setIsPlaying(false)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    } else {
      setIsPlaying(true)
      animateRoute()
    }
  }

  const animateRoute = () => {
    if (!polylineRef.current || !markerRef.current) return
    const totalPoints = routeCoords.length
    let currentIdx = Math.floor((progress / 100) * (totalPoints - 1))
    let startTime: number | null = null
    const segmentDuration = 800

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const segProgress = Math.min(elapsed / segmentDuration, 1)

      const from = routeCoords[currentIdx] as L.LatLngExpression
      const to = routeCoords[Math.min(currentIdx + 1, totalPoints - 1)] as L.LatLngExpression
      const lat =
        (from as L.LatLng).lat +
        ((to as L.LatLng).lat - (from as L.LatLng).lat) * segProgress
      const lng =
        (from as L.LatLng).lng +
        ((to as L.LatLng).lng - (from as L.LatLng).lng) * segProgress

      markerRef.current?.setLatLng([lat, lng])

      const overallProgress = ((currentIdx + segProgress) / (totalPoints - 1)) * 100
      setProgress(overallProgress)

      if (segProgress < 1) {
        animRef.current = requestAnimationFrame(step)
      } else {
        currentIdx++
        if (currentIdx < totalPoints - 1) {
          startTime = null
          animRef.current = requestAnimationFrame(step)
        } else {
          setIsPlaying(false)
        }
      }
    }
    animRef.current = requestAnimationFrame(step)
  }

  const resetAnim = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setIsPlaying(false)
    setProgress(0)
    markerRef.current?.setLatLng(routeCoords[0])
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[500] flex flex-col overflow-hidden"
      style={{ background: 'rgba(8,8,8,0.96)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{
          padding: '16px 32px',
          background: '#111',
          borderBottom: '1px solid rgba(111,162,52,0.18)',
        }}
      >
        <div>
          <div className="text-lg font-extrabold text-white">
            🗺️ Lộ trình <span className="text-[var(--g700)]">Thủ Thiêm</span> — The Running
            Babes
          </div>
          <div className="text-xs text-white/40 mt-1">
            Vòng tròn ~6 km · Sala, Thủ Thiêm, Q2
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-center">
            <div className="text-xl font-black text-[var(--g700)] leading-none">~6</div>
            <div className="text-[10px] text-white/40 tracking-[0.1em] uppercase mt-0.5">km</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-[var(--g700)] leading-none">35'</div>
            <div className="text-[10px] text-white/40 tracking-[0.1em] uppercase mt-0.5">
              Thời gian
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-[var(--g700)] leading-none">Flat</div>
            <div className="text-[10px] text-white/40 tracking-[0.1em] uppercase mt-0.5">
              Địa hình
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg transition-colors duration-200 hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
        >
          ✕
        </button>
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Controls */}
      <div
        className="flex gap-2.5 flex-shrink-0 flex-wrap"
        style={{
          padding: '14px 32px',
          background: '#141414',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button
          className="px-[18px] py-2 rounded-lg text-[13px] font-bold transition-all duration-200"
          style={{
            background: 'rgba(111,162,52,0.1)',
            border: '1px solid rgba(111,162,52,0.3)',
            color: 'var(--g83)',
          }}
        >
          Bình thường
        </button>
        <button
          className="px-[18px] py-2 rounded-lg text-[13px] font-bold transition-all duration-200"
          style={{
            background: 'rgba(111,162,52,0.1)',
            border: '1px solid rgba(111,162,52,0.3)',
            color: 'var(--g83)',
          }}
        >
          Vệ tinh
        </button>
        <button
          onClick={resetAnim}
          className="px-[18px] py-2 rounded-lg text-[13px] font-bold transition-all duration-200"
          style={{
            background: 'rgba(111,162,52,0.1)',
            border: '1px solid rgba(111,162,52,0.3)',
            color: 'var(--g83)',
          }}
        >
          🏠 Làm mới bản đồ
        </button>
        <button
          className="px-[18px] py-2 rounded-lg text-[13px] font-bold transition-all duration-200"
          style={{
            background: 'rgba(111,162,52,0.1)',
            border: '1px solid rgba(111,162,52,0.3)',
            color: 'var(--g83)',
          }}
        >
          🎯 Căn giữa lộ trình
        </button>
      </div>

      {/* Player */}
      <div
        className="flex-shrink-0"
        style={{ padding: '18px 32px', background: '#111' }}
      >
        <div className="flex items-center justify-between gap-5 max-w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--g700)] animate-pulse" />
            <div>
              <div className="text-[15px] font-extrabold text-white">
                <strong className="text-[var(--g700)]">{(progress / 100 * 6).toFixed(1)}</strong>{' '}
                / 6.0 km
              </div>
              <div className="text-xs text-white/40 mt-0.5">
                {isPlaying ? 'Đang phát...' : 'Chưa bắt đầu'}
              </div>
            </div>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={toggleAnim}
              className="px-[22px] py-2.5 rounded-lg text-[13px] font-extrabold transition-colors duration-200"
              style={{ background: 'var(--g700)', color: '#fff' }}
            >
              {isPlaying ? '⏸ Tạm dừng' : '▶ Phát'}
            </button>
            <button
              onClick={resetAnim}
              className="px-[22px] py-2.5 rounded-lg text-[13px] font-extrabold transition-colors duration-200"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
            >
              ↻ Reset
            </button>
          </div>
        </div>
        <div
          className="mt-3 w-full h-1 rounded-sm overflow-hidden"
          style={{ background: 'rgba(111,162,52,0.18)' }}
        >
          <div
            className="h-full bg-[var(--g700)] rounded-sm transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
