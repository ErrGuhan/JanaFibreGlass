import React, { useState } from 'react'
import {
  LayoutDashboard,
  Box,
  FolderKanban,
  BarChart3,
  Settings,
  LogOut,
  Moon,
  Sun,
  Bell,
  Layers,
  Sparkles,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  badge?: string
}

export interface DashboardLayoutProps {
  children?: React.ReactNode
  activeNavId?: string
  onNavSelect?: (id: string) => void
  title?: string
  user?: {
    name: string
    role: string
    initials: string
  }
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeNavId = 'saved-configs',
  onNavSelect,
  title = 'Saved Configurations',
  user = {
    name: 'Marcus Guha',
    role: 'Lead Architect',
    initials: 'MG',
  },
}) => {
  const [currentNav, setCurrentNav] = useState(activeNavId)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: '3d-configurator',
      label: '3D Door Studio',
      icon: <Box className="w-5 h-5" />,
      badge: 'Live',
    },
    {
      id: 'saved-configs',
      label: 'Saved Configurations',
      icon: <FolderKanban className="w-5 h-5" />,
      badge: '6',
    },
    {
      id: 'analytics',
      label: 'Quotes & Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ]

  const handleNavClick = (id: string) => {
    setCurrentNav(id)
    if (onNavSelect) onNavSelect(id)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans antialiased">
      {/* ========================================================= */}
      {/* 1. FIXED LEFT SIDEBAR (w-64, white bg, border-gray-100)  */}
      {/* ========================================================= */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col justify-between z-20 shadow-sm">
        <div>
          {/* Top Logo Area */}
          <div className="h-16 px-6 flex items-center gap-3 border-b border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
                JANA <span className="text-blue-600 font-extrabold">STUDIO</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                Enterprise SaaS Portal
              </div>
            </div>
          </div>

          {/* Navigation List */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Main Menu
            </div>
            {navItems.map((item) => {
              const isActive = currentNav === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        isActive ? 'text-blue-600' : 'text-slate-400'
                      }
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-500'
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

        {/* Bottom Profile Block */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-gray-100">
            <div className="flex items-center gap-3 min-w-0">
              {/* Circular Avatar with Initials */}
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-blue-500/25 flex-shrink-0">
                {user.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {user.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {user.role}
                </div>
              </div>
            </div>
          </div>

          {/* Prominent Red Logout Button */}
          <button
            onClick={() => alert('User logged out successfully.')}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow-md shadow-red-500/20 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT AREA (bg-slate-50, remaining width)       */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-50">
        
        {/* Top Header */}
        <header className="h-16 px-8 bg-white border-b border-gray-100 flex items-center justify-between flex-shrink-0 z-10">
          {/* Left: Page Title */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Sparkles className="w-3 h-3" />
              Active Workspace
            </span>
          </div>

          {/* Right: Dark Mode Toggle & Notification Bell */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Icon */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-500" />
              )}
            </button>

            {/* Notification Bell with Red Dot */}
            <div className="relative">
              <button
                onClick={() => alert('You have 3 unread notifications.')}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-slate-500" />
                {/* Small Red Notification Dot */}
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Children Body Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
