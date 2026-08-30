import React, { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { supabase } from '../../utils/supabaseClient'

export interface ProtectedRouteProps {
  children?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      // 1. Check active Supabase Auth Session
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          if (mounted) setIsAuthenticated(true)
          return
        }
      } catch (err) {
        console.warn('Supabase getSession warning:', err)
      }

      // 2. Fallback check for adminToken in localStorage
      const localToken = localStorage.getItem('adminToken')
      if (localToken) {
        if (mounted) setIsAuthenticated(true)
        return
      }

      if (mounted) setIsAuthenticated(false)
    }

    checkAuth()

    // 3. Listen to active Supabase Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        if (mounted) setIsAuthenticated(true)
      } else {
        const localToken = localStorage.getItem('adminToken')
        if (mounted) setIsAuthenticated(!!localToken)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Render clean loading spinner while checking session state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-md flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-xs font-bold font-mono text-slate-700">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    )
  }

  // Redirect to /admin/login if unauthenticated
  if (!isAuthenticated) {
    return <Navigate replace to="/admin/login" />
  }

  // Render nested admin child routes or children layout
  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
