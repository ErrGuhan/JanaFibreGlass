import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { StudioPage } from './pages/StudioPage'
import { About } from './pages/About'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminLayout } from './components/layout/AdminLayout'
import { ContentEditor } from './pages/admin/ContentEditor'
import { AdminPOS } from './pages/admin/AdminPOS'
import { OrderHistory } from './pages/admin/OrderHistory'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

/**
 * App - Multi-Page Routing Setup with React Router DOM & Enterprise Admin Portal
 * Routes:
 * Public:
 * - /         -> Home (Landing page with Hero, benefits, CTA)
 * - /products -> Products (Product Catalog Grid)
 * - /studio   -> 3D Studio (Interactive 3D Configurator Studio)
 * - /about    -> About (Company info, Contact Us, Disclaimers)
 * Protected Admin Portal (Nested inside AdminLayout):
 * - /admin/login     -> Admin Login Page
 * - /admin/content   -> Website Content Editor
 * - /admin/pos       -> Standalone Isolated 3D Point of Sale Studio
 * - /admin/orders    -> Order History & Offline Sync Status
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

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Enterprise Admin Portal (AdminLayout Shell) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="content" replace />} />
          <Route path="content" element={<ContentEditor />} />
          <Route path="pos" element={<AdminPOS />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="dashboard" element={<Navigate to="/admin/content" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
