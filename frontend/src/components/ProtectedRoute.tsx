import { Navigate } from 'react-router-dom'
import { auth } from '../services/auth'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  return auth.isAuthenticated() ? children : <Navigate to="/admin/login" replace />
}
