import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Box,
  FileText,
  ShoppingBag,
  Database,
  LogOut,
  WifiOff,
  RefreshCw,
  CloudUpload,
  CheckCircle2,
  Menu,
  X,
  Smartphone,
} from 'lucide-react'
import { registerSW } from 'virtual:pwa-register'
import {
  syncOfflineOrders,
  getUnsyncedCount,
} from '../../utils/offlineStore'

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [unsyncedCount, setUnsyncedCount] = useState<number>(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Scoped Service Worker registration for Admin route
    try {
      registerSW({ immediate: true })
    } catch (swErr) {
      console.warn('PWA Service Worker registration notice:', swErr)
    }

    checkSyncStatus()

    const handleOnline = async () => {
      setIsOnline(true)
      setIsSyncing(true)
      await syncOfflineOrders()
      await checkSyncStatus()
      setIsSyncing(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const checkSyncStatus = async () => {
    const count = await getUnsyncedCount()
    setUnsyncedCount(count)
  }

  const handleManualSync = async () => {
    setIsSyncing(true)
    await syncOfflineOrders()
    await checkSyncStatus()
    setIsSyncing(false)
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  const navLinks = [
    {
      name: 'Website Content',
      path: '/admin/content',
      icon: FileText,
    },
    {
      name: 'Offline 3D Order',
      path: '/admin/pos',
      icon: ShoppingBag,
    },
    {
      name: 'Order History',
      path: '/admin/orders',
      icon: Database,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
      {/* FIXED LEFT SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-30 shadow-xs">
        {/* Logo Section */}
        <div className="h-16 px-6 border-b border-gray-100 flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight">
              JANA Admin
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Management Studio
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 text-left">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs border border-blue-100'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-semibold'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-gray-100 text-left text-[11px] text-slate-400 space-y-1">
          <p className="font-semibold text-slate-600">JANA FIBRE GLASS</p>
          <p>Version 2.4.0 (PWA Admin)</p>
        </div>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex">
          <div className="w-64 bg-white h-full flex flex-col p-4 space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-blue-600" />
                <span className="font-extrabold text-slate-900">JANA Admin</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs border border-blue-100'
                          : 'text-slate-500 hover:text-slate-900 font-semibold'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.name}</span>
                  </NavLink>
                )
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-2 py-3 px-4 rounded-xl bg-red-50 text-red-600 font-bold text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* TOP HEADER BAR */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-slate-500 hidden sm:inline-block">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Custom PWA Install Button (Prompt 1) */}
            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>📲 Install Admin Studio</span>
              </button>
            )}

            {/* Network Status Pill */}
            {!isOnline ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold shadow-2xs">
                <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Offline Mode - Saving Locally</span>
              </div>
            ) : isSyncing ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold shadow-2xs">
                <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />
                <span>Syncing...</span>
              </div>
            ) : unsyncedCount > 0 ? (
              <button
                onClick={handleManualSync}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-800 border border-orange-300 text-xs font-bold transition-all shadow-2xs"
                title="Click to sync offline orders to PostgreSQL"
              >
                <CloudUpload className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span>{unsyncedCount} Unsynced Orders (Sync Now)</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Online & Synced</span>
              </div>
            )}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-semibold text-xs transition-colors border border-slate-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* SUB-PAGE RENDER CONTAINER (pb-20 on mobile to clear bottom navbar) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 pb-20 md:pb-8">
          <Outlet />
        </main>

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 z-40 flex items-center justify-around py-2 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold transition-all ${
                    isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{link.name.replace('Website ', '').replace('3D ', '')}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default AdminLayout
