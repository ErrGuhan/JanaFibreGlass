import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { StudioPage } from './pages/StudioPage'
import { About } from './pages/About'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

/**
 * App - Multi-Page Routing Setup with React Router DOM & Admin Portal
 * Routes:
 * Public:
 * - /         -> Home (Landing page with Hero, benefits, CTA)
 * - /products -> Products (Product Catalog Grid)
 * - /studio   -> 3D Studio (Interactive 3D Configurator Studio)
 * - /about    -> About (Company info, Contact Us, Disclaimers)
 * Protected Admin:
 * - /admin/login     -> Admin Login Page
 * - /admin/dashboard -> Admin Dashboard (Protected content editor)
 */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes Wrapped in MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="studio" element={<StudioPage />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* Admin Authentication & Hidden Dashboard Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
