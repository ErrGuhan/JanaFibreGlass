import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import {
  ShoppingBag,
  User,
  MapPin,
  Building,
  Ruler,
  Palette,
  FileText,
  Save,
  AlertTriangle,
  CheckCircle2,
  WifiOff,
  Plus,
  Minus,
} from 'lucide-react'
import { useAdminStore } from '../../store/useAdminStore'
import { saveOfflineOrder } from '../../utils/offlineStore'
import type { OrderPayload } from '../../utils/offlineStore'
import { ParametricDoor } from '../../components/ParametricDoor'

const FINISH_SWATCHES = [
  { name: 'Light Oak', hex: '#d4a373' },
  { name: 'Dark Walnut', hex: '#3f2e21' },
  { name: 'Matte Black', hex: '#18181b' },
  { name: 'Pearl White', hex: '#f8fafc' },
]

export const AdminPOS: React.FC = () => {
  const store = useAdminStore()

  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'offline_warning' | 'error'
    text: string
  } | null>(null)

  const handleStepDimension = (
    field: 'bottomWidth' | 'leftHeight' | 'rightHeight' | 'thickness',
    delta: number
  ) => {
    const currentValue = store.doorConfig[field]
    const newValue = Math.max(1, parseFloat((currentValue + delta).toFixed(1)))
    if (field === 'bottomWidth') {
      store.setDoorConfig({ topWidth: newValue, bottomWidth: newValue })
    } else {
      store.setDoorConfig({ [field]: newValue })
    }
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setStatusMessage(null)

    const payload: OrderPayload = {
      customerName: store.customerCRM.customerName,
      customerPhone: store.customerCRM.customerPhone,
      width: store.doorConfig.bottomWidth,
      leftHeight: store.doorConfig.leftHeight,
      rightHeight: store.doorConfig.rightHeight,
      thickness: store.doorConfig.thickness,
      colorName: store.doorConfig.colorName,
      colorHex: store.doorConfig.colorHex,
      notes: `Address: ${store.customerCRM.address}, ${store.customerCRM.city}. Notes: ${store.customerCRM.notes}`,
    }

    try {
      if (!navigator.onLine) {
        throw new Error('Device is offline')
      }

      const token = localStorage.getItem('adminToken')
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: 'Order saved directly to PostgreSQL database!',
        })
        store.resetPOS()
      } else {
        throw new Error('Server returned non-200 status')
      }
    } catch (err) {
      console.warn('Offline mode or server error, writing to IndexedDB localforage:', err)

      try {
        await saveOfflineOrder(payload)
        setStatusMessage({
          type: 'offline_warning',
          text: 'No Connection: Order saved securely to device.',
        })
        store.resetPOS()
      } catch (saveErr) {
        console.error('Failed to save to localforage:', saveErr)
        setStatusMessage({
          type: 'error',
          text: 'Critical error saving to local device storage.',
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Isolated 3D POS (Point of Sale)
          </h1>
          <p className="text-xs text-slate-500">
            On-site order taking tool (Isolated from public configurator store, with localforage caching).
          </p>
        </div>

        {!navigator.onLine && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold shadow-2xs">
            <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
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

      {/* Two-Column Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: STICKY 3D CANVAS (Isolated POS Instance) */}
        <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3 sticky top-20">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              <span>Isolated 3D POS Viewport</span>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">
              useAdminStore
            </span>
          </div>

          <div className="h-64 sm:h-[380px] bg-slate-900 rounded-xl relative overflow-hidden shadow-inner">
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 1.2, 3.5]} fov={45} />
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
              <pointLight position={[-5, -5, -5]} intensity={0.3} />
              
              {/* Isolated ParametricDoor reading useAdminStore */}
              <group position={[0, -0.9, 0]}>
                <ParametricDoor />
              </group>

              <OrbitControls makeDefault enablePan={true} maxPolarAngle={Math.PI / 2 + 0.1} />
            </Canvas>

            {/* Quick Sizing Overlay */}
            <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white text-[11px] font-mono flex justify-between">
              <span>{store.doorConfig.bottomWidth.toFixed(1)}W × {store.doorConfig.leftHeight.toFixed(1)}H cm</span>
              <span className="text-amber-400 font-bold">{store.doorConfig.colorName}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CRM ORDER FORM */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            
            {/* CARD 1: CUSTOMER CRM DETAILS */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-slate-900 font-bold text-sm">
                <User className="w-4 h-4 text-blue-600" />
                <h2>Customer CRM Profile</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    value={store.customerCRM.customerName}
                    onChange={(e) => store.setCustomerCRM({ customerName: e.target.value })}
                    placeholder="e.g. K. Rajesh"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={store.customerCRM.customerPhone}
                    onChange={(e) => store.setCustomerCRM({ customerPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono font-semibold text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Site Address</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={store.customerCRM.address}
                    onChange={(e) => store.setCustomerCRM({ address: e.target.value })}
                    placeholder="Door No / Street Address"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    <span>City / Town</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={store.customerCRM.city}
                    onChange={(e) => store.setCustomerCRM({ city: e.target.value })}
                    placeholder="e.g. Chennai"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* CARD 2: DIMENSION STEPPERS */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-slate-900 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-blue-600" />
                  <h2>Door Sizing & Specifications (Float Precision)</h2>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Step: 0.5 cm</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Width */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Width (cm)</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStepDimension('bottomWidth', -0.5)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95 shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      step="0.1"
                      value={store.doorConfig.bottomWidth}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 1
                        store.setDoorConfig({ topWidth: val, bottomWidth: val })
                      }}
                      className="w-full text-center py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleStepDimension('bottomWidth', 0.5)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Left Height */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Height Left (cm)</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStepDimension('leftHeight', -0.5)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95 shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      step="0.1"
                      value={store.doorConfig.leftHeight}
                      onChange={(e) => store.setDoorConfig({ leftHeight: parseFloat(e.target.value) || 1 })}
                      className="w-full text-center py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleStepDimension('leftHeight', 0.5)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right Height */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Height Right (cm)</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStepDimension('rightHeight', -0.5)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95 shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      step="0.1"
                      value={store.doorConfig.rightHeight}
                      onChange={(e) => store.setDoorConfig({ rightHeight: parseFloat(e.target.value) || 1 })}
                      className="w-full text-center py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleStepDimension('rightHeight', 0.5)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Thickness */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Thickness (cm)</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStepDimension('thickness', -0.5)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95 shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      step="0.1"
                      value={store.doorConfig.thickness}
                      onChange={(e) => store.setDoorConfig({ thickness: parseFloat(e.target.value) || 1 })}
                      className="w-full text-center py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleStepDimension('thickness', 0.5)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold active:scale-95 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: FINISH SWATCHES */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-slate-900 font-bold text-sm">
                <Palette className="w-4 h-4 text-blue-600" />
                <h2>Color / Finish Swatch</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FINISH_SWATCHES.map((swatch) => {
                  const isSelected = store.doorConfig.colorName === swatch.name
                  return (
                    <button
                      type="button"
                      key={swatch.name}
                      onClick={() =>
                        store.setDoorConfig({
                          colorName: swatch.name,
                          colorHex: swatch.hex,
                        })
                      }
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

            {/* CARD 4: NOTES */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-slate-900 font-bold text-sm">
                <FileText className="w-4 h-4 text-blue-600" />
                <h2>Special Instructions / Site Notes</h2>
              </div>

              <textarea
                rows={3}
                value={store.customerCRM.notes}
                onChange={(e) => store.setCustomerCRM({ notes: e.target.value })}
                placeholder="Enter opening site conditions, hardware specifications, delivery notes..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium text-slate-800"
              />
            </div>

            {/* LARGE SAVE OFFLINE ORDER BUTTON */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{isSaving ? 'Processing POS Order...' : 'Save Offline Order'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminPOS
