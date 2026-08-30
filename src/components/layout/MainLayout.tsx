import React, { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import { Box, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react'
import { Footer } from './Footer'

export const MainLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/studio', label: '3D Studio' },
    { path: '/about', label: 'About' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand on Left */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight block leading-tight">
                JANA FIBRE GLASS
              </span>
              <div className="flex items-center gap-1 text-[10px] text-blue-600 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                <span>Enterprise Custom Doors</span>
              </div>
            </div>
          </Link>

          {/* Desktop Links on Right */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <Link
              to="/studio"
              className="ml-3 inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
            >
              <span>Launch 3D Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 md:hidden transition-colors border border-gray-200"
            title="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown / Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-2">
              <Link
                to="/studio"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-sm"
              >
                <span>Launch 3D Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  )
}

export default MainLayout
