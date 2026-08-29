import React, { useState } from 'react'
import {
  Box,
  Layers,
  ShoppingBag,
  Grid,
  Settings,
  LogOut,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

export interface DashboardLayoutProps {
  children?: React.ReactNode
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

const NAV_ITEMS: NavItem[] = [
  { id: 'configurator', label: '3D Configurator', icon: Box },
  { id: 'saved', label: 'Saved Designs', icon: Layers, badge: '4' },
  { id: 'catalog', label: 'Product Catalog', icon: ShoppingBag },
  { id: 'gallery', label: 'Past Work Gallery', icon: Grid },
  { id: 'settings', label: 'Studio Settings', icon: Settings },
]

/**
 * DashboardLayout - Light-Theme SaaS Portal Shell
 * Features:
 * 1. Screen background bg-slate-50.
 * 2. Fixed left sidebar (w-64, bg-white, border-r border-gray-200).
 * 3. Navigation items styled with active state (bg-blue-50, text-blue-600, font-semibold).
 * 4. Profile block with circular avatar (bg-indigo-400), user info, and square red logout button (bg-red-500 rounded-lg).
 * 5. Top header (bg-white, border-b border-gray-100), breadcrumbs on left, dark mode & bell with red notification dot on right.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab: propActiveTab,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(propActiveTab || 'configurator')
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId)
    if (onTabChange) onTabChange(tabId)
  }

  const currentNav = NAV_ITEMS.find((item) => item.id === activeTab) || NAV_ITEMS[0]

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
      {/* 1. FIXED LEFT SIDEBAR (w-64, bg-white, border-r border-gray-200) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between fixed top-0 bottom-0 left-0 z-30 hidden md:flex">
        
        {/* Top Logo & Brand Area */}
        <div>
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                JANA FIBRE GLASS
              </h1>
              <div className="flex items-center gap-1 text-[11px] text-blue-600 font-medium">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span>Enterprise Studio</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Main Menu
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[11px] rounded-full font-semibold ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom Profile Section */}
        <div className="p-4 border-t border-gray-200 bg-slate-50/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-gray-100 shadow-xs">
            <div className="flex items-center gap-3">
              {/* Circular Avatar (bg-indigo-400) */}
              <div className="w-9 h-9 rounded-full bg-indigo-400 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                MG
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">
                  M. Guhan
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  Senior Architect
                </p>
              </div>
            </div>

            {/* Square Red Logout Button (bg-red-500 rounded-lg) */}
            <button
              onClick={() => alert('Logged out successfully.')}
              className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors shadow-xs"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA (bg-slate-50) */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Top Header (bg-white, border-b border-gray-100) */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-xs">
          
          {/* Breadcrumbs & Title on Left */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Portal</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              {currentNav.label}
            </h2>
          </div>

          {/* Controls on Right: Dark mode toggle & Notification bell */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Icon */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-gray-200"
              title="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Notification Bell with Red Dot */}
            <div className="relative">
              <button
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-gray-200"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-600" />
              </button>
              {/* Red notification dot */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </div>
          </div>
        </header>

        {/* Main Content View Slot */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
