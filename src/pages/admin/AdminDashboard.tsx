import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Save,
  LogOut,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  Type,
  Layout,
  RefreshCw,
  WifiOff,
  ShoppingBag,
  Database,
  CloudUpload,
} from 'lucide-react'
import { fetchSiteContent, updateSiteContent } from '../../utils/api'
import type { SiteContentData } from '../../utils/api'
import {
  syncOfflineOrders,
  getUnsyncedCount,
  getOfflineOrders,
} from '../../utils/offlineStore'
import type { OrderPayload } from '../../utils/offlineStore'
import { AdminOrderStudio } from './AdminOrderStudio'

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'order' | 'cached'>('content')

  // Form State
  const [formData, setFormData] = useState<SiteContentData>({
    heroHeadline: '',
    heroSubtext: '',
    aboutUsText: '',
    contactPhone: '',
    contactEmail: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')

  // Sync Engine & Connectivity State
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [unsyncedCount, setUnsyncedCount] = useState<number>(0)
  const [cachedOrders, setCachedOrders] = useState<OrderPayload[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    loadContent()
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

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadContent = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await fetchSiteContent()
      setFormData(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load site content.')
    } finally {
      setIsLoading(false)
    }
  }

  const checkSyncStatus = async () => {
    const count = await getUnsyncedCount()
    setUnsyncedCount(count)
    const list = await getOfflineOrders()
    setCachedOrders(list)
  }

  const handleManualSync = async () => {
    setIsSyncing(true)
    await syncOfflineOrders()
    await checkSyncStatus()
    setIsSyncing(false)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSaveSuccess(false)

    try {
      await updateSiteContent(formData)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error(err)
      setError('Failed to save changes to database.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top SaaS Header Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                JANA Admin Studio
              </h1>
              <p className="text-xs text-slate-500">
                PWA Offline Studio & Content Management
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Visual Sync Status Indicator */}
            {!isOnline ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold shadow-2xs">
                <WifiOff className="w-4 h-4 text-amber-600" />
                <span>Offline Mode</span>
              </div>
            ) : isSyncing ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold shadow-2xs">
                <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                <span>Syncing...</span>
              </div>
            ) : unsyncedCount > 0 ? (
              <button
                onClick={handleManualSync}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-800 border border-orange-300 text-xs font-bold transition-all shadow-2xs"
                title="Click to sync offline orders to PostgreSQL"
              >
                <CloudUpload className="w-4 h-4 text-orange-600" />
                <span>{unsyncedCount} Offline Orders (Sync Now)</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>System Synced</span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 py-2 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs transition-colors border border-red-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Sub-Navigation */}
        <div className="flex bg-white border border-gray-100 rounded-2xl p-1.5 shadow-xs">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'content'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Site Content Manager</span>
          </button>
          <button
            onClick={() => setActiveTab('order')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'order'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Order Studio</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('cached')
              checkSyncStatus()
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'cached'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Cached Offline Orders ({unsyncedCount})</span>
          </button>
        </div>

        {/* TAB 1: SITE CONTENT MANAGER */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {saveSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Site content updated successfully! Public website updated.</span>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 shadow-xs">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <Layout className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Homepage Hero Section
                  </h2>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-blue-600" />
                    <span>Hero Headline (h1)</span>
                  </label>
                  <input
                    type="text"
                    name="heroHeadline"
                    required
                    value={formData.heroHeadline}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Hero Subtext Paragraph</span>
                  </label>
                  <textarea
                    name="heroSubtext"
                    rows={3}
                    required
                    value={formData.heroSubtext}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium text-slate-800 leading-relaxed"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    About Us & Company Text
                  </h2>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Company Profile & Technical Description
                  </label>
                  <textarea
                    name="aboutUsText"
                    rows={4}
                    required
                    value={formData.aboutUsText}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium text-slate-800 leading-relaxed"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Contact Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="text"
                      name="contactPhone"
                      required
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono font-semibold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      required
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono font-semibold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving || isLoading}
                  className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 active:scale-[0.98] disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: CUSTOMER ORDER STUDIO */}
        {activeTab === 'order' && (
          <AdminOrderStudio onOrderChange={checkSyncStatus} />
        )}

        {/* TAB 3: CACHED OFFLINE ORDERS LIST */}
        {activeTab === 'cached' && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  IndexedDB Cached Orders ({cachedOrders.length})
                </h2>
              </div>

              {isOnline && cachedOrders.length > 0 && (
                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
                >
                  <CloudUpload className="w-4 h-4" />
                  <span>{isSyncing ? 'Syncing...' : 'Sync All Orders Now'}</span>
                </button>
              )}
            </div>

            {cachedOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-80" />
                <p className="font-semibold text-slate-600">No unsynced offline orders.</p>
                <p>All device orders are fully synced to the PostgreSQL server.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cachedOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-xl bg-slate-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <span>{ord.customerName}</span>
                        <span className="font-mono text-slate-500 font-normal">({ord.customerPhone})</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Width: {ord.width}cm × Height: {ord.leftHeight}cm × Thickness: {ord.thickness}cm ({ord.colorName})
                      </p>
                      {ord.notes && (
                        <p className="text-[11px] text-slate-400 italic">Notes: "{ord.notes}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">
                        Pending Sync
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminDashboard
