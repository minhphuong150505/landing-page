import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'

interface RouteMapModalProps {
  open: boolean
  onClose: () => void
}

const thuThiemRoute: [number, number][] = [
  [10.8040, 106.7500], [10.8057, 106.7516], [10.8072, 106.7538], [10.8083, 106.7564],
  [10.8090, 106.7592], [10.8093, 106.7622], [10.8091, 106.7652], [10.8084, 106.7680],
  [10.8073, 106.7705], [10.8057, 106.7726], [10.8038, 106.7740], [10.8019, 106.7746],
  [10.7999, 106.7744], [10.7981, 106.7734], [10.7966, 106.7717], [10.7954, 106.7694],
  [10.7948, 106.7668], [10.7947, 106.7641], [10.7952, 106.7613], [10.7963, 106.7588],
  [10.7979, 106.7567], [10.7999, 106.7552], [10.8020, 106.7545], [10.8040, 106.7545],
  [10.8059, 106.7552], [10.8076, 106.7565], [10.8089, 106.7583], [10.8097, 106.7604],
  [10.8099, 106.7627], [10.8096, 106.7650], [10.8087, 106.7671], [10.8074, 106.7688],
  [10.8057, 106.7499], [10.8040, 106.7500],
]

const DEFAULT_CENTER: [number, number] = [10.8040, 106.7622]
const DEFAULT_ZOOM = 15
const TOTAL_KM = 6.0
const TOTAL_MIN = 35
const DEMO_DURATION_MS = 90 * 1000

const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const ESRI_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

const clampProgress = (value: number) => Math.min(Math.max(value, 0), 1)

const routeSegments = thuThiemRoute.slice(0, -1).map((start, index) => {
  const end = thuThiemRoute[index + 1]
  return {
    start,
    end,
    distance: L.latLng(start).distanceTo(L.latLng(end)),
  }
})

const routeSegmentsWithDistance = routeSegments.map((segment, index) => {
  const startDistance = routeSegments
    .slice(0, index)
    .reduce((total, item) => total + item.distance, 0)

  return {
    ...segment,
    startDistance,
    endDistance: startDistance + segment.distance,
  }
})

const totalRouteDistance = routeSegments.reduce((total, segment) => total + segment.distance, 0)

export default function RouteMapModal({ open, onClose }: RouteMapModalProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const polylineRef = useRef<L.Polyline | null>(null)
  const animMarkerRef = useRef<L.CircleMarker | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)

  const [style, setStyle] = useState<'normal' | 'satellite'>('normal')
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const animFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const progressRef = useRef(0)

  useEffect(() => {
    if (!open || !mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    })
    mapInstance.current = map

    tileLayerRef.current = L.tileLayer(OSM_URL, {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: 'topleft' }).addTo(map)

    const polyline = L.polyline(thuThiemRoute, {
      color: '#6FA234',
      weight: 5,
      opacity: 0.9,
      dashArray: '6,6',
    }).addTo(map)
    polylineRef.current = polyline

    L.circleMarker(thuThiemRoute[0], {
      radius: 9,
      fillColor: '#6FA234',
      color: '#fff',
      weight: 3,
      fillOpacity: 1,
    })
      .addTo(map)
      .bindPopup('Start / Finish<br>Sala Thủ Thiêm')

    animMarkerRef.current = L.circleMarker(thuThiemRoute[0], {
      radius: 11,
      fillColor: '#6FA234',
      color: '#fff',
      weight: 3,
      fillOpacity: 1,
    }).addTo(map)

    map.fitBounds(polyline.getBounds(), { padding: [50, 50] })

    setTimeout(() => map.invalidateSize(), 150)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      map.remove()
      mapInstance.current = null
      polylineRef.current = null
      animMarkerRef.current = null
      tileLayerRef.current = null
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      setIsPlaying(false)
      setProgress(0)
      progressRef.current = 0
      setStyle('normal')
    }
  }, [open])

  useEffect(() => {
    const map = mapInstance.current
    if (!map || !tileLayerRef.current) return
    map.removeLayer(tileLayerRef.current)
    tileLayerRef.current = L.tileLayer(style === 'satellite' ? ESRI_URL : OSM_URL, {
      attribution: style === 'satellite' ? '© Esri' : '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)
  }, [style])

  const updateMarker = (p: number) => {
    const marker = animMarkerRef.current
    if (!marker) return

    const clampedProgress = clampProgress(p)
    const targetDistance = clampedProgress * totalRouteDistance
    const segment =
      routeSegmentsWithDistance.find((item) => targetDistance <= item.endDistance) ??
      routeSegmentsWithDistance[routeSegmentsWithDistance.length - 1]
    const segmentProgress =
      segment.distance === 0 ? 0 : (targetDistance - segment.startDistance) / segment.distance
    const lat = segment.start[0] + (segment.end[0] - segment.start[0]) * segmentProgress
    const lng = segment.start[1] + (segment.end[1] - segment.start[1]) * segmentProgress

    marker.setLatLng([lat, lng])
    marker.bringToFront()
  }

  const play = () => {
    if (!mapInstance.current) return
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)

    if (progressRef.current >= 1) {
      progressRef.current = 0
      setProgress(0)
      updateMarker(0)
    }

    setIsPlaying(true)
    startTimeRef.current = performance.now() - progressRef.current * DEMO_DURATION_MS

    const step = (ts: number) => {
      const elapsed = ts - startTimeRef.current
      const p = clampProgress(elapsed / DEMO_DURATION_MS)
      progressRef.current = p
      setProgress(p)
      updateMarker(p)
      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(step)
      } else {
        animFrameRef.current = null
        setIsPlaying(false)
      }
    }

    animFrameRef.current = requestAnimationFrame(step)
  }

  const pause = () => {
    setIsPlaying(false)
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
  }

  const togglePlay = () => (isPlaying ? pause() : play())

  const reset = () => {
    pause()
    progressRef.current = 0
    setProgress(0)
    updateMarker(0)
  }

  const refreshMap = () => {
    mapInstance.current?.setView(DEFAULT_CENTER, DEFAULT_ZOOM)
  }

  const centerRoute = () => {
    const map = mapInstance.current
    const polyline = polylineRef.current
    if (map && polyline) map.fitBounds(polyline.getBounds(), { padding: [50, 50] })
  }

  if (!open) return null

  const displayProgress = clampProgress(progress)
  const km = (displayProgress * TOTAL_KM).toFixed(1)
  const totalSec = Math.floor(displayProgress * TOTAL_MIN * 60)
  const mins = Math.floor(totalSec / 60)
  const secs = totalSec % 60
  const timeLabel =
    displayProgress === 0
      ? 'Chưa bắt đầu'
      : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} / 35:00`

  const ctrlBtn = (active: boolean): React.CSSProperties => ({
    background: active ? 'var(--g700)' : 'rgba(111,162,52,0.1)',
    border: `1px solid ${active ? 'var(--g700)' : 'rgba(111,162,52,0.3)'}`,
    color: active ? '#fff' : 'var(--g83)',
  })

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
            🗺️ Lộ trình <span className="text-[var(--g700)]">Thủ Thiêm</span> — The Running Babes
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
          onClick={() => setStyle('normal')}
          className="px-[18px] py-2 rounded-lg text-[13px] font-bold transition-all duration-200"
          style={ctrlBtn(style === 'normal')}
        >
          Bình thường
        </button>
        <button
          onClick={() => setStyle('satellite')}
          className="px-[18px] py-2 rounded-lg text-[13px] font-bold transition-all duration-200"
          style={ctrlBtn(style === 'satellite')}
        >
          Vệ tinh
        </button>
        <button
          onClick={refreshMap}
          className="px-[18px] py-2 rounded-lg text-[13px] font-bold transition-all duration-200"
          style={ctrlBtn(false)}
        >
          🏠 Làm mới bản đồ
        </button>
        <button
          onClick={centerRoute}
          className="px-[18px] py-2 rounded-lg text-[13px] font-bold transition-all duration-200"
          style={ctrlBtn(false)}
        >
          🎯 Căn giữa lộ trình
        </button>
      </div>

      {/* Player */}
      <div className="flex-shrink-0" style={{ padding: '18px 32px', background: '#111' }}>
        <div className="flex items-center justify-between gap-5 max-w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--g700)] animate-pulse" />
            <div>
              <div className="text-[15px] font-extrabold text-white">
                <strong className="text-[var(--g700)]">{km}</strong> / 6.0 km
              </div>
              <div className="text-xs text-white/40 mt-0.5">{timeLabel}</div>
            </div>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={togglePlay}
              className="px-[22px] py-2.5 rounded-lg text-[13px] font-extrabold transition-colors duration-200"
              style={{ background: 'var(--g700)', color: '#fff' }}
            >
              {isPlaying ? '⏸ Tạm dừng' : '▶ Phát'}
            </button>
            <button
              onClick={reset}
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
            style={{ width: `${displayProgress * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
