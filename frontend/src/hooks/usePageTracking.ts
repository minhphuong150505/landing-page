import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackingApi } from '../services/api'

function getOrCreateSessionId(): string {
  const key = 'tracking_session_id'
  let sessionId = localStorage.getItem(key)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(key, sessionId)
  }
  return sessionId
}

export function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    const sessionId = getOrCreateSessionId()
    trackingApi
      .pageview({
        path: location.pathname,
        referrer: document.referrer || undefined,
        sessionId,
      })
      .catch(() => {/* fail silent */})
  }, [location.pathname])
}
