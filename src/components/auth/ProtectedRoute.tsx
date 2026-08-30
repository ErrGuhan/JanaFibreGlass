import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export interface ProtectedRouteProps {
  children?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('adminToken')

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
