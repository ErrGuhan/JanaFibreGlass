import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export interface ProtectedRouteProps {
  children?: React.ReactNode
}

/**
 * ProtectedRoute - Authentication Guard & Scoped PWA Service Worker Registration
 * 1. Checks localStorage for adminToken. If missing, redirects to /admin/login.
 * 2. Manually registers PWA Service Worker ONLY for authenticated admins.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('adminToken')

  useEffect(() => {
    if (token && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/admin/' })
        .then((reg) => {
          console.log('JANA Admin PWA Service Worker registered:', reg.scope)
        })
        .catch((err) => {
          console.warn('PWA Service Worker registration skipped/failed:', err)
        })
    }
  }, [token])

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
