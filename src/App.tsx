import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { StudioPage } from './pages/StudioPage'
import { About } from './pages/About'

/**
 * App - Multi-Page Routing Setup with React Router DOM
 * Routes:
 * - /         -> Home (Landing page with Hero, benefits, CTA)
 * - /products -> Products (Product Catalog Grid)
 * - /studio   -> 3D Studio (Interactive 3D Configurator Studio)
 * - /about    -> About (Company info, Contact Us, Disclaimers)
 */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="studio" element={<StudioPage />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
