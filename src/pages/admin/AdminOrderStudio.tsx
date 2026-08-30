import React, { useState } from 'react'
import {
  ShoppingBag,
  User,
  Phone,
  Ruler,
  Palette,
  FileText,
  Save,
  AlertTriangle,
  CheckCircle2,
  WifiOff,
} from 'lucide-react'
import { useConfigStore } from '../../store/useConfigStore'
import { saveOfflineOrder } from '../../utils/offlineStore'
import type { OrderPayload } from '../../utils/offlineStore'
import type { ColorFinishOption } from '../../components/ConfigPanel'

const FINISH_SWATCHES: ColorFinishOption[] = [
  { name: 'Light Oak', hex: '#d4a373' },
  { name: 'Dark Walnut', hex: '#3f2e21' },
  { name: 'Matte Black', hex: '#18181b' },
  { name: 'Pearl White', hex: '#f8fafc' },
]

export const AdminOrderStudio: React.FC<{ onOrderChange?: () => void }> = ({
  onOrderChange,
}) => {
  const store = useConfigStore()

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedFinish, setSelectedFinish] = useState(FINISH_SWATCHES[0])

  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'offline_warning' | 'error'
    text: string
  } | null>(null)

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setStatusMessage(null)

    const payload: OrderPayload = {
      customerName,
      customerPhone,
      width: store.doorConfig.bottomWidth,
      leftHeight: store.doorConfig.leftHeight,
      rightHeight: store.doorConfig.rightHeight,
      thickness: store.doorConfig.thickness,
      colorName: selectedFinish.name,
      colorHex: selectedFinish.hex,
      notes,
    }

    try {
      if (!navigator.onLine) {
        throw new Error('Device is offline')
      }

      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: 'Order saved directly to server database!',
        })
        resetForm()
      } else {
        throw new Error('Server returned non-200 status')
      }
    } catch (err) {
      console.warn('Network or server error, falling back to localforage IndexedDB:', err)
      
      try {
        await saveOfflineOrder(payload)
        setStatusMessage({
          type: 'offline_warning',
          text: 'No Connection: Order saved securely to device.',
        })
        resetForm()
      } catch (saveErr) {
        console.error('Failed to save to localforage:', saveErr)
        setStatusMessage({
          type: 'error',
          text: 'Critical: Failed to cache order to local storage.',
        })
      }
    } finally {
      setIsSaving(false)
      if (onOrderChange) onOrderChange()
    }
  }

  const resetForm = () => {
    setCustomerName('')
    setCustomerPhone('')
    setNotes('')
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Customer Order Studio
            </h2>
            <p className="text-xs text-slate-500">
              Create on-site door quotes & orders (Offline IndexedDB Caching Enabled)
            </p>
          </div>
        </div>

        {!navigator.onLine && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline Mode Active</span>
          </div>
        )}
      </div>

      {/* Status Alert Badge */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-2xs ${
            statusMessage.type === 'offline_warning'
              ? 'bg-amber-50 border border-amber-200 text-amber-800'
              : statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {statusMessage.type === 'offline_warning' ? (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          ) : statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmitOrder} className="space-y-6">
        
        {/* Customer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Customer Full Name</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. R. Sundaram"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>Customer Mobile Number</span>
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono font-semibold text-slate-900"
            />
          </div>
        </div>

        {/* Current Active Config Summary */}
        <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Ruler className="w-4 h-4 text-blue-600" />
              <span>Active Door Sizing</span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-slate-500">
              Auto-synced from 3D Configurator
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-gray-100">
              <span className="text-[10px] text-slate-400 block font-bold">WIDTH</span>
              <span className="font-mono font-bold text-slate-900">{store.doorConfig.bottomWidth.toFixed(1)} cm</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-gray-100">
              <span className="text-[10px] text-slate-400 block font-bold">HEIGHT (LEFT)</span>
              <span className="font-mono font-bold text-slate-900">{store.doorConfig.leftHeight.toFixed(1)} cm</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-gray-100">
              <span className="text-[10px] text-slate-400 block font-bold">HEIGHT (RIGHT)</span>
              <span className="font-mono font-bold text-slate-900">{store.doorConfig.rightHeight.toFixed(1)} cm</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-gray-100">
              <span className="text-[10px] text-slate-400 block font-bold">THICKNESS</span>
              <span className="font-mono font-bold text-slate-900">{store.doorConfig.thickness.toFixed(1)} cm</span>
            </div>
          </div>
        </div>

        {/* Finish Selection Swatches */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-blue-600" />
            <span>Select Door Finish</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FINISH_SWATCHES.map((swatch) => {
              const isSelected = selectedFinish.name === swatch.name
              return (
                <button
                  type="button"
                  key={swatch.name}
                  onClick={() => setSelectedFinish(swatch)}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-xs ring-1 ring-blue-500'
                      : 'border-gray-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border border-gray-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span>{swatch.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Notes / Site Instructions */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Special Instructions / Site Notes</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter opening site conditions, hardware specifications, delivery notes..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium text-slate-800"
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Processing Order...' : 'Save Customer Order'}</span>
        </button>
      </form>
    </div>
  )
}

export default AdminOrderStudio
