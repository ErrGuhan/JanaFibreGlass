import React, { useState } from 'react'
import {
  Sliders,
  ChevronDown,
  ChevronUp,
  Ruler,
  Palette,
  Check,
  RotateCw,
  Home,
  Zap,
  Play,
  Minus,
  Plus,
  MessageSquare,
  Bookmark,
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
  { name: 'Pearl White', hex: '#f8fafc', borderClass: 'border-slate-300' },
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
 * ConfigPanel - Mobile-First Glassmorphic Door Configuration Panel
 * Upgraded features:
 * 1. High-contrast "Stepper" [ - ] [ Value ] [ + ] controls (44x44px min touch target).
 * 2. Mobile fixed bottom bar with "Inquire on WhatsApp" wa.me link & "Save Design".
 * 3. Lucide icons next to all section headers for universal accessibility.
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
    <div
      className={`fixed z-40 transition-all duration-300 select-none ${
        // Mobile-first layout: bottom floating card on small screens (leaving space for fixed action bar), right panel on desktop
        'bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:top-20 sm:bottom-auto sm:w-96'
      } ${className}`}
    >
      {/* Main Glassmorphic Panel Container */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900/75 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-950/50 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 tracking-wide">
                Door Configurator
              </h2>
              <p className="text-[11px] text-slate-400">
                Parametric 3D Studio
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={isCollapsed ? 'Expand Configuration' : 'Collapse Configuration'}
          >
            {isCollapsed ? (
              <ChevronUp className="w-6 h-6" />
            ) : (
              <ChevronDown className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Collapsible Content Area */}
        {!isCollapsed && (
          <div className="p-4 sm:p-5 space-y-5 max-h-[60vh] sm:max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
            
            {/* SECTION 1: INTERACTION & HINGE PHYSICS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400 tracking-wider uppercase">
                <div className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-amber-400" />
                  <span>Interaction</span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isDoorOpen ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-400'}`}>
                  {isDoorOpen ? `Open (${openAngle}°)` : 'Closed'}
                </span>
              </div>

              {/* Glassmorphic "Open Door" Toggle Switch */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm min-h-[50px]">
                <span className="text-xs font-semibold text-slate-200">
                  Open Door
                </span>
                <button
                  onClick={() => store.toggleDoorOpen()}
                  className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isDoorOpen ? 'bg-blue-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isDoorOpen ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Animation Mode Segmented Controls */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-950/60 border border-white/10">
                <button
                  onClick={() => store.setAnimationMode('smooth')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                    animationMode === 'smooth'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  Smooth Glide
                </button>
                <button
                  onClick={() => store.setAnimationMode('instant')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                    animationMode === 'instant'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  Instant Snap
                </button>
              </div>

              {/* Secondary Swing Angle Stepper */}
              {isDoorOpen && (
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-blue-300">Swing Angle</span>
                    <span className="font-mono font-bold text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-md border border-cyan-500/30">
                      {openAngle}°
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => store.setDoorConfig({ openAngle: Math.max(10, openAngle - 15) })}
                      className="w-11 h-11 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-cyan-400 font-bold border border-white/10 flex items-center justify-center"
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
                      className="flex-1 accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <button
                      onClick={() => store.setDoorConfig({ openAngle: Math.min(180, openAngle + 15) })}
                      className="w-11 h-11 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-cyan-400 font-bold border border-white/10 flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: DIMENSIONS (cm) WITH HIGH-CONTRAST STEPPERS */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400 tracking-wider uppercase">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-amber-400" />
                  <span>Dimensions (cm)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal lowercase">
                  stepper controls
                </span>
              </div>

              {/* 1. Width Stepper */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200">Width</span>
                  <span className="text-[10px] text-slate-400 font-mono">Min 70 – Max 120 cm</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleWidthChange(width - 1)}
                    className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 font-bold border border-white/10 flex items-center justify-center transition-all shadow-md min-w-[44px] min-h-[44px]"
                    title="Decrease Width"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 flex items-center justify-center bg-slate-950/80 rounded-xl border border-amber-500/30 px-3 py-2">
                    <input
                      type="number"
                      min="70"
                      max="120"
                      value={width}
                      onChange={(e) => handleWidthChange(parseFloat(e.target.value))}
                      onBlur={(e) => handleWidthChange(parseFloat(e.target.value))}
                      className="w-16 bg-transparent text-center font-mono font-bold text-amber-400 text-sm focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="font-mono text-amber-400 text-xs font-bold">cm</span>
                  </div>
                  <button
                    onClick={() => handleWidthChange(width + 1)}
                    className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 font-bold border border-white/10 flex items-center justify-center transition-all shadow-md min-w-[44px] min-h-[44px]"
                    title="Increase Width"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2. Height (Left) Stepper */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200">Height (Left)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Min 180 – Max 250 cm</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleHeightLeftChange(heightLeft - 1)}
                    className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 font-bold border border-white/10 flex items-center justify-center transition-all shadow-md min-w-[44px] min-h-[44px]"
                    title="Decrease Left Height"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 flex items-center justify-center bg-slate-950/80 rounded-xl border border-amber-500/30 px-3 py-2">
                    <input
                      type="number"
                      min="180"
                      max="250"
                      value={heightLeft}
                      onChange={(e) => handleHeightLeftChange(parseFloat(e.target.value))}
                      onBlur={(e) => handleHeightLeftChange(parseFloat(e.target.value))}
                      className="w-16 bg-transparent text-center font-mono font-bold text-amber-400 text-sm focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="font-mono text-amber-400 text-xs font-bold">cm</span>
                  </div>
                  <button
                    onClick={() => handleHeightLeftChange(heightLeft + 1)}
                    className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 font-bold border border-white/10 flex items-center justify-center transition-all shadow-md min-w-[44px] min-h-[44px]"
                    title="Increase Left Height"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3. Height (Right) Stepper */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200">Height (Right)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Min 180 – Max 250 cm</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleHeightRightChange(heightRight - 1)}
                    className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 font-bold border border-white/10 flex items-center justify-center transition-all shadow-md min-w-[44px] min-h-[44px]"
                    title="Decrease Right Height"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 flex items-center justify-center bg-slate-950/80 rounded-xl border border-amber-500/30 px-3 py-2">
                    <input
                      type="number"
                      min="180"
                      max="250"
                      value={heightRight}
                      onChange={(e) => handleHeightRightChange(parseFloat(e.target.value))}
                      onBlur={(e) => handleHeightRightChange(parseFloat(e.target.value))}
                      className="w-16 bg-transparent text-center font-mono font-bold text-amber-400 text-sm focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="font-mono text-amber-400 text-xs font-bold">cm</span>
                  </div>
                  <button
                    onClick={() => handleHeightRightChange(heightRight + 1)}
                    className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 font-bold border border-white/10 flex items-center justify-center transition-all shadow-md min-w-[44px] min-h-[44px]"
                    title="Increase Right Height"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4. Thickness Stepper */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200">Thickness</span>
                  <span className="text-[10px] text-slate-400 font-mono">Min 3.0 – Max 8.0 cm</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleThicknessChange(thickness - 0.5)}
                    className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 font-bold border border-white/10 flex items-center justify-center transition-all shadow-md min-w-[44px] min-h-[44px]"
                    title="Decrease Thickness"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 flex items-center justify-center bg-slate-950/80 rounded-xl border border-amber-500/30 px-3 py-2">
                    <input
                      type="number"
                      min="3.0"
                      max="8.0"
                      step="0.5"
                      value={thickness}
                      onChange={(e) => handleThicknessChange(parseFloat(e.target.value))}
                      onBlur={(e) => handleThicknessChange(parseFloat(e.target.value))}
                      className="w-16 bg-transparent text-center font-mono font-bold text-amber-400 text-sm focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="font-mono text-amber-400 text-xs font-bold">cm</span>
                  </div>
                  <button
                    onClick={() => handleThicknessChange(thickness + 0.5)}
                    className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 font-bold border border-white/10 flex items-center justify-center transition-all shadow-md min-w-[44px] min-h-[44px]"
                    title="Increase Thickness"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 3: FINISH SWATCHES */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider uppercase">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>Finish</span>
                </div>
                <span className="text-xs font-medium text-slate-300">
                  {activeFinishObj.name}
                </span>
              </div>

              {/* Round Color Swatches */}
              <div className="flex items-center justify-around p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                {FINISH_SWATCHES.map((swatch) => {
                  const isSelected =
                    currentColor.toLowerCase() === swatch.hex.toLowerCase()

                  return (
                    <button
                      key={swatch.name}
                      onClick={() => handleFinishSelect(swatch)}
                      className="group relative flex flex-col items-center gap-1.5 transition-all transform active:scale-95 min-w-[44px] min-h-[44px] justify-center"
                      title={swatch.name}
                    >
                      <div
                        className={`w-10 h-10 rounded-full shadow-lg transition-all flex items-center justify-center border-2 ${
                          isSelected
                            ? 'ring-4 ring-amber-500/40 scale-110 border-white'
                            : `${swatch.borderClass || 'border-white/20'} hover:scale-105`
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {isSelected && (
                          <Check
                            className={`w-4 h-4 ${
                              swatch.hex === '#f8fafc'
                                ? 'text-slate-900'
                                : 'text-white'
                            }`}
                          />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium group-hover:text-slate-200">
                        {swatch.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* SECTION 4: ENVIRONMENT CONTEXT */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider uppercase">
                  <Home className="w-4 h-4 text-amber-400" />
                  <span>Environment Context</span>
                </div>
                <span className="text-xs font-medium text-slate-300">
                  {store.wallColorName}
                </span>
              </div>

              {/* Wall Color Swatches */}
              <div className="flex items-center justify-around p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                {WALL_COLORS.map((wSwatch) => {
                  const isSelected =
                    wallColor.toLowerCase() === wSwatch.hex.toLowerCase()

                  return (
                    <button
                      key={wSwatch.name}
                      onClick={() => store.setWallColor(wSwatch.hex, wSwatch.name)}
                      className="group relative flex flex-col items-center gap-1 transition-all transform active:scale-95 min-w-[44px] min-h-[44px] justify-center"
                      title={wSwatch.name}
                    >
                      <div
                        className={`w-8 h-8 rounded-full shadow-md transition-all flex items-center justify-center border-2 ${
                          isSelected
                            ? 'ring-4 ring-cyan-500/40 scale-110 border-white'
                            : 'border-white/20 hover:scale-105'
                        }`}
                        style={{ backgroundColor: wSwatch.hex }}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium group-hover:text-slate-200">
                        {wSwatch.name.split(' ')[0]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* MOBILE FIXED BOTTOM PRIMARY ACTION BAR (Prompt 1) */}
      <div className="fixed bottom-0 left-0 right-0 p-3 sm:relative sm:p-0 sm:mt-3 bg-slate-950/90 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none border-t border-white/10 sm:border-0 z-50 flex items-center gap-2.5">
        {/* Primary Green WhatsApp Inquiry Button */}
        <button
          onClick={handleWhatsAppInquiry}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 transition-all active:scale-[0.98] border border-emerald-400/30 min-h-[48px]"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>Inquire on WhatsApp</span>
        </button>

        {/* Secondary Save Design Button */}
        <button
          onClick={handleSaveDesign}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-sm shadow-md transition-all active:scale-[0.98] border border-white/10 min-h-[48px]"
          title="Save Design"
        >
          {isSaved ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Bookmark className="w-4 h-4 text-slate-300" />
          )}
          <span className="hidden xs:inline">{isSaved ? 'Saved!' : 'Save Design'}</span>
        </button>
      </div>
    </div>
  )
}

export default ConfigPanel
