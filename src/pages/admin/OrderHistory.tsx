import React, { useState, useEffect } from 'react'
import {
  Database,
  CloudUpload,
  CheckCircle2,
  Clock,
  RefreshCw,
  ShoppingBag,
  User,
} from 'lucide-react'
import {
  getOfflineOrders,
  syncOfflineOrders,
} from '../../utils/offlineStore'
import type { OrderPayload } from '../../utils/offlineStore'

export const OrderHistory: React.FC = () => {
  const [serverOrders, setServerOrders] = useState<any[]>([])
  const [cachedOrders, setCachedOrders] = useState<OrderPayload[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const cached = await getOfflineOrders()
      setCachedOrders(cached)

      const token = localStorage.getItem('adminToken')
      const res = await fetch('/api/admin/orders', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (res.ok) {
        const json = await res.json()
        setServerOrders(json.data || [])
      }
    } catch (err) {
      console.warn('Could not fetch server orders:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualSync = async () => {
    setIsSyncing(true)
    await syncOfflineOrders()
    await loadOrders()
    setIsSyncing(false)
  }

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Order History & Sync Status
          </h1>
          <p className="text-xs text-slate-500">
            View orders synced to PostgreSQL and orders pending offline synchronization.
          </p>
        </div>

        {cachedOrders.length > 0 && navigator.onLine && (
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <CloudUpload className="w-4 h-4" />
            <span>{isSyncing ? 'Syncing...' : `Sync ${cachedOrders.length} Offline Orders`}</span>
          </button>
        )}
      </div>

      {/* SECTION 1: INDEXEDDB UNBALANCED OFFLINE ORDERS */}
      {cachedOrders.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Clock className="w-4 h-4 text-amber-600" />
              <h2>Pending Offline Cached Orders ({cachedOrders.length})</h2>
            </div>
            <span className="text-[11px] font-mono font-bold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">
              IndexedDB Storage
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cachedOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl bg-white border border-amber-200/80 shadow-2xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>{ord.customerName}</span>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px] font-normal">{ord.customerPhone}</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Sizing: {ord.width}cm × {ord.leftHeight}cm × {ord.thickness}cm ({ord.colorName})
                </p>
                {ord.notes && (
                  <p className="text-slate-400 italic text-[10px] truncate">{ord.notes}</p>
                )}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                  <span className="text-amber-700 font-semibold">Status: Offline Cached</span>
                  <span className="text-slate-400 font-mono">{new Date(ord.createdAt || '').toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: POSTGRESQL SYNCED SERVER ORDERS */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Database className="w-4 h-4 text-blue-600" />
            <h2>PostgreSQL Synced Server Orders ({serverOrders.length})</h2>
          </div>
          <button
            onClick={loadOrders}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 text-xs font-semibold flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {serverOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs space-y-2">
            <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-600">No synced orders found in PostgreSQL database.</p>
            <p>Orders saved in Offline 3D POS will automatically populate here when synced.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {serverOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl bg-slate-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span>Order #{ord.id}</span>
                    <span className="font-mono text-slate-500 text-[11px] font-normal">
                      ({ord.topWidth}cm × {ord.leftHeight}cm × {ord.thickness}cm)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Finish: <span className="font-semibold">{ord.hexColor}</span> | Status: <span className="font-semibold text-blue-600">{ord.status}</span>
                  </p>
                  {ord.documents && ord.documents.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      {ord.documents.map((doc: any, i: number) => (
                        <a
                          key={i}
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-blue-600 underline font-mono"
                        >
                          View Attachment #{i + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Synced to PostgreSQL</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderHistory
