import React, { useState } from 'react'
import {
  Sliders,
  ChevronDown,
  ChevronUp,
  Ruler,
  Palette,
  RotateCw,
  Home,
  Zap,
  Play,
  Minus,
  Plus,
  MessageSquare,
  Bookmark,
  Check,
} from 'lucide-react'
import { useConfigStore, WALL_COLORS } from '../store/useConfigStore'

export interface ColorFinishOption {
  name: string
  hex: string
  borderClass?: string
}

export const FINISH_SWATCHES: ColorFinishOption[] = [
  { name: 'Light Oak', hex: '#d4a373' }, // Default
  { name: 'Dark Walnut', hex: '#3f2e21' },
  { name: 'Matte Black', hex: '#18181b' },
  { name: 'Pearl White', hex: '#f8fafc', borderClass: 'border-gray-300' },
]

export interface ConfigPanelProps {
  width?: number
  onWidthChange?: (val: number) => void
  heightLeft?: number
  onHeightLeftChange?: (val: number) => void
  heightRight?: number
  onHeightRightChange?: (val: number) => void
  thickness?: number
  onThicknessChange?: (val: number) => void
  selectedColor?: string
  onColorChange?: (colorHex: string, colorName: string) => void
  onRequestQuote?: () => void
  className?: string
}

/**
 * ConfigPanel - Light-Theme Enterprise White Card Design
 * Features:
 * 1. Clean structured white card (bg-white border border-gray-100 rounded-2xl shadow-sm).
 * 2. Primary labels: text-slate-800 font-semibold, secondary labels: text-slate-500 text-sm.
 * 3. Light gray stepper inputs (bg-slate-50 border border-gray-200) with text-slate-600 hover:bg-gray-100 steppers.
 * 4. Finish swatches with ring-2 ring-offset-2 ring-blue-500 on active selection.
 */
export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  width: propWidth,
  onWidthChange,
  heightLeft: propHeightLeft,
  onHeightLeftChange,
  heightRight: propHeightRight,
  onHeightRightChange,
  thickness: propThickness,
  onThicknessChange,
  selectedColor: propSelectedColor,
  onColorChange,
  onRequestQuote,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Sync with global Zustand store
  const store = useConfigStore()

  const width = propWidth ?? store.doorConfig.bottomWidth
  const heightLeft = propHeightLeft ?? store.doorConfig.leftHeight
  const heightRight = propHeightRight ?? store.doorConfig.rightHeight
  const thickness = propThickness ?? store.doorConfig.thickness
  const currentColor = propSelectedColor ?? store.color
  const isDoorOpen = store.doorConfig.isDoorOpen
  const openAngle = store.doorConfig.openAngle
  const animationMode = store.doorConfig.animationMode
  const wallColor = store.wallColor

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, isNaN(val) ? min : val))

  // Stepper handlers
  const handleWidthChange = (val: number) => {
    const clamped = clamp(val, 70, 120)
    if (onWidthChange) onWidthChange(clamped)
    else store.setDoorConfig({ topWidth: clamped, bottomWidth: clamped })
  }

  const handleHeightLeftChange = (val: number) => {
    const clamped = clamp(val, 180, 250)
    if (onHeightLeftChange) onHeightLeftChange(clamped)
    else store.setDoorConfig({ leftHeight: clamped })
  }

  const handleHeightRightChange = (val: number) => {
    const clamped = clamp(val, 180, 250)
    if (onHeightRightChange) onHeightRightChange(clamped)
    else store.setDoorConfig({ rightHeight: clamped })
  }

  const handleThicknessChange = (val: number) => {
    const clamped = clamp(val, 3.0, 8.0)
    if (onThicknessChange) onThicknessChange(clamped)
    else store.setDoorConfig({ thickness: clamped })
  }

  const handleFinishSelect = (swatch: ColorFinishOption) => {
    if (onColorChange) {
      onColorChange(swatch.hex, swatch.name)
    }
    store.setColor(swatch.hex, swatch.name)
  }

  const activeFinishObj =
    FINISH_SWATCHES.find((s) => s.hex.toLowerCase() === currentColor.toLowerCase()) ||
    FINISH_SWATCHES[0]

  // WhatsApp Inquiry URL Formatter
  const handleWhatsAppInquiry = () => {
    const message =
      `Hello JANA FIBRE GLASS! 👋\n` +
      `I am inquiring about a Custom Parametric FRP Door configuration:\n\n` +
      `📏 *DIMENSIONS*\n` +
      `• Width: ${width} cm\n` +
      `• Height (Left): ${heightLeft} cm\n` +
      `• Height (Right): ${heightRight} cm\n` +
      `• Thickness: ${thickness} cm\n\n` +
      `🎨 *FINISH & ENVIRONMENT*\n` +
      `• Door Finish: ${activeFinishObj.name}\n` +
      `• Environment Wall: ${store.wallColorName}\n` +
      `• Door Swing Status: ${isDoorOpen ? `Open (${openAngle}°)` : 'Closed'}\n\n` +
      `Please provide a price estimate and lead time for delivery. Thank you!`

    const encodedMsg = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMsg}`, '_blank')
  }

  const handleSaveDesign = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
    if (onRequestQuote) onRequestQuote()
  }

  return (
    <div className={`w-full transition-all duration-300 select-none ${className}`}>
      {/* 1. Main White Card Container (bg-white border border-gray-100 rounded-2xl shadow-sm) */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden text-slate-800">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                Door Configurator
              </h2>
              <p className="text-xs text-slate-500">
                Parametric Studio Specifications
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? 'Expand Configuration' : 'Collapse Configuration'}
          >
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Collapsible Content Area */}
        {!isCollapsed && (
          <div className="p-5 space-y-6">
            
            {/* SECTION 1: INTERACTION & HINGE PHYSICS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-blue-600" />
                  <span>Interaction & Door Swing</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isDoorOpen
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isDoorOpen ? `Open (${openAngle}°)` : 'Closed'}
                </span>
              </div>

              {/* White Card "Open Door" Toggle Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-gray-200">
                <span className="text-xs font-semibold text-slate-800">
                  Open Door Panel
                </span>
                <button
                  onClick={() => store.toggleDoorOpen()}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isDoorOpen ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isDoorOpen ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Animation Mode Segmented Controls */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 border border-gray-200">
                <button
                  onClick={() => store.setAnimationMode('smooth')}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    animationMode === 'smooth'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  Smooth Glide
                </button>
                <button
                  onClick={() => store.setAnimationMode('instant')}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    animationMode === 'instant'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  Instant Snap
                </button>
              </div>

              {/* Secondary Swing Angle Stepper */}
              {isDoorOpen && (
                <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-blue-900">Swing Angle</span>
                    <span className="font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                      {openAngle}°
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => store.setDoorConfig({ openAngle: Math.max(10, openAngle - 15) })}
                      className="w-9 h-9 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold border border-gray-200 flex items-center justify-center shadow-xs"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="range"
                      min="10"
                      max="180"
                      step="5"
                      value={openAngle}
                      onChange={(e) =>
                        store.setDoorConfig({ openAngle: parseInt(e.target.value) })
                      }
                      className="flex-1 accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <button
                      onClick={() => store.setDoorConfig({ openAngle: Math.min(180, openAngle + 15) })}
                      className="w-9 h-9 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold border border-gray-200 flex items-center justify-center shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: DIMENSIONS (cm) WITH LIGHT GRAY STEPPER INPUTS */}
            <div className="space-y-3.5 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-blue-600" />
                  <span>Dimensions (cm)</span>
                </div>
                <span className="text-xs font-normal text-slate-500">
                  Interactive Steppers
                </span>
              </div>

              {/* 1. Width Stepper */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Width</span>
                  <span className="text-xs text-slate-500 font-mono">70 - 120 cm</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleWidthChange(width - 1)}
                    className="w-10 h-10 rounded-lg bg-white hover:bg-gray-100 active:scale-95 text-slate-600 font-bold border border-gray-200 flex items-center justify-center transition-all shadow-xs"
                    title="Decrease Width"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 flex items-center justify-center bg-white rounded-lg border border-gray-200 px-3 py-1.5 shadow-xs">
                    <input
                      type="number"
                      min="70"
                      max="120"
                      value={width}
                      onChange={(e) => handleWidthChange(parseFloat(e.target.value))}
                      onBlur={(e) => handleWidthChange(parseFloat(e.target.value))}
                      className="w-16 bg-transparent text-center font-mono font-bold text-slate-900 text-sm focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="font-mono text-slate-500 text-xs font-bold">cm</span>
                  </div>
                  <button
                    onClick={() => handleWidthChange(width + 1)}
                    className="w-10 h-10 rounded-lg bg-white hover:bg-gray-100 active:scale-95 text-slate-600 font-bold border border-gray-200 flex items-center justify-center transition-all shadow-xs"
                    title="Increase Width"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2. Height (Left) Stepper */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Height (Left)</span>
                  <span className="text-xs text-slate-500 font-mono">180 - 250 cm</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleHeightLeftChange(heightLeft - 1)}
                    className="w-10 h-10 rounded-lg bg-white hover:bg-gray-100 active:scale-95 text-slate-600 font-bold border border-gray-200 flex items-center justify-center transition-all shadow-xs"
                    title="Decrease Left Height"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 flex items-center justify-center bg-white rounded-lg border border-gray-200 px-3 py-1.5 shadow-xs">
                    <input
                      type="number"
                      min="180"
                      max="250"
                      value={heightLeft}
                      onChange={(e) => handleHeightLeftChange(parseFloat(e.target.value))}
                      onBlur={(e) => handleHeightLeftChange(parseFloat(e.target.value))}
                      className="w-16 bg-transparent text-center font-mono font-bold text-slate-900 text-sm focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="font-mono text-slate-500 text-xs font-bold">cm</span>
                  </div>
                  <button
                    onClick={() => handleHeightLeftChange(heightLeft + 1)}
                    className="w-10 h-10 rounded-lg bg-white hover:bg-gray-100 active:scale-95 text-slate-600 font-bold border border-gray-200 flex items-center justify-center transition-all shadow-xs"
                    title="Increase Left Height"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3. Height (Right) Stepper */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Height (Right)</span>
                  <span className="text-xs text-slate-500 font-mono">180 - 250 cm</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleHeightRightChange(heightRight - 1)}
                    className="w-10 h-10 rounded-lg bg-white hover:bg-gray-100 active:scale-95 text-slate-600 font-bold border border-gray-200 flex items-center justify-center transition-all shadow-xs"
                    title="Decrease Right Height"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 flex items-center justify-center bg-white rounded-lg border border-gray-200 px-3 py-1.5 shadow-xs">
                    <input
                      type="number"
                      min="180"
                      max="250"
                      value={heightRight}
                      onChange={(e) => handleHeightRightChange(parseFloat(e.target.value))}
                      onBlur={(e) => handleHeightRightChange(parseFloat(e.target.value))}
                      className="w-16 bg-transparent text-center font-mono font-bold text-slate-900 text-sm focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="font-mono text-slate-500 text-xs font-bold">cm</span>
                  </div>
                  <button
                    onClick={() => handleHeightRightChange(heightRight + 1)}
                    className="w-10 h-10 rounded-lg bg-white hover:bg-gray-100 active:scale-95 text-slate-600 font-bold border border-gray-200 flex items-center justify-center transition-all shadow-xs"
                    title="Increase Right Height"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4. Thickness Stepper */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-gray-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Thickness</span>
                  <span className="text-xs text-slate-500 font-mono">3.0 - 8.0 cm</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleThicknessChange(thickness - 0.5)}
                    className="w-10 h-10 rounded-lg bg-white hover:bg-gray-100 active:scale-95 text-slate-600 font-bold border border-gray-200 flex items-center justify-center transition-all shadow-xs"
                    title="Decrease Thickness"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 flex items-center justify-center bg-white rounded-lg border border-gray-200 px-3 py-1.5 shadow-xs">
                    <input
                      type="number"
                      min="3.0"
                      max="8.0"
                      step="0.5"
                      value={thickness}
                      onChange={(e) => handleThicknessChange(parseFloat(e.target.value))}
                      onBlur={(e) => handleThicknessChange(parseFloat(e.target.value))}
                      className="w-16 bg-transparent text-center font-mono font-bold text-slate-900 text-sm focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="font-mono text-slate-500 text-xs font-bold">cm</span>
                  </div>
                  <button
                    onClick={() => handleThicknessChange(thickness + 0.5)}
                    className="w-10 h-10 rounded-lg bg-white hover:bg-gray-100 active:scale-95 text-slate-600 font-bold border border-gray-200 flex items-center justify-center transition-all shadow-xs"
                    title="Increase Thickness"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 3: FINISH SWATCHES WITH RING-2 RING-OFFSET-2 RING-BLUE-500 */}
            <div className="space-y-3.5 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Palette className="w-4 h-4 text-blue-600" />
                  <span>Finish</span>
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  {activeFinishObj.name}
                </span>
              </div>

              {/* Round Color Swatches */}
              <div className="flex items-center justify-around p-3.5 rounded-xl bg-slate-50 border border-gray-200">
                {FINISH_SWATCHES.map((swatch) => {
                  const isSelected =
                    currentColor.toLowerCase() === swatch.hex.toLowerCase()

                  return (
                    <button
                      key={swatch.name}
                      onClick={() => handleFinishSelect(swatch)}
                      className="group flex flex-col items-center gap-1.5 transition-all transform active:scale-95"
                      title={swatch.name}
                    >
                      <div
                        className={`w-9 h-9 rounded-full shadow-xs transition-all flex items-center justify-center ${
                          isSelected
                            ? 'ring-2 ring-offset-2 ring-blue-500 scale-105'
                            : `${swatch.borderClass || 'border border-gray-300'} hover:scale-105`
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span
                        className={`text-[11px] font-medium ${
                          isSelected ? 'text-blue-600 font-bold' : 'text-slate-500'
                        }`}
                      >
                        {swatch.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* SECTION 4: ENVIRONMENT CONTEXT */}
            <div className="space-y-3.5 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Home className="w-4 h-4 text-blue-600" />
                  <span>Environment Context</span>
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  {store.wallColorName}
                </span>
              </div>

              {/* Wall Color Swatches */}
              <div className="flex items-center justify-around p-3.5 rounded-xl bg-slate-50 border border-gray-200">
                {WALL_COLORS.map((wSwatch) => {
                  const isSelected =
                    wallColor.toLowerCase() === wSwatch.hex.toLowerCase()

                  return (
                    <button
                      key={wSwatch.name}
                      onClick={() => store.setWallColor(wSwatch.hex, wSwatch.name)}
                      className="group flex flex-col items-center gap-1 transition-all transform active:scale-95"
                      title={wSwatch.name}
                    >
                      <div
                        className={`w-8 h-8 rounded-full shadow-xs transition-all flex items-center justify-center ${
                          isSelected
                            ? 'ring-2 ring-offset-2 ring-blue-500 scale-105'
                            : 'border border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: wSwatch.hex }}
                      />
                      <span
                        className={`text-[10px] font-medium ${
                          isSelected ? 'text-blue-600 font-bold' : 'text-slate-500'
                        }`}
                      >
                        {wSwatch.name.split(' ')[0]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* SECTION 5: PRIMARY ACTION BUTTONS */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={handleWhatsAppInquiry}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all active:scale-[0.98]"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Inquire on WhatsApp</span>
              </button>

              <button
                onClick={handleSaveDesign}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-all border border-gray-200 shadow-xs"
              >
                {isSaved ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Bookmark className="w-4 h-4 text-slate-500" />
                )}
                <span>{isSaved ? 'Saved!' : 'Save'}</span>
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default ConfigPanel
