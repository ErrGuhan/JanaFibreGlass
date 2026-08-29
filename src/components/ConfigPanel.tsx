import React, { useState } from 'react'
import {
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Ruler,
  Palette,
  Check,
  RotateCw,
  Home,
  Zap,
  Play,
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
 * ConfigPanel - Mobile-first Glassmorphic Door Configuration Panel
 * Upgraded with:
 * 1. Interaction sub-section: "Open Door" toggle & Framer Motion 3D physics mode ("Smooth Glide" vs "Instant Snap").
 * 2. Conditional "Swing Angle" slider (10° to 180°) visible when door is open.
 * 3. Editable number input fields with value clamping & two-way slider binding.
 * 4. Environment Context wall color swatches.
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

  const handleQuoteClick = () => {
    if (onRequestQuote) {
      onRequestQuote()
    } else {
      alert(
        `Quote requested for Custom Door:\n- Width: ${width} cm\n- Height (Left): ${heightLeft} cm\n- Height (Right): ${heightRight} cm\n- Thickness: ${thickness} cm\n- Finish: ${activeFinishObj.name}`
      )
    }
  }

  return (
    <div
      className={`fixed z-40 transition-all duration-300 select-none ${
        'bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:top-20 sm:bottom-auto sm:w-96'
      } ${className}`}
    >
      {/* Main Glassmorphic Container (bg-slate-900/60 backdrop-blur-xl border border-white/10) */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-950/40 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-sm">
              <Sliders className="w-4 h-4" />
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
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
            title={isCollapsed ? 'Expand Configuration' : 'Collapse Configuration'}
          >
            {isCollapsed ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Collapsible Content Area */}
        {!isCollapsed && (
          <div className="p-5 space-y-6 max-h-[70vh] sm:max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
            
            {/* SECTION 1: INTERACTION & HINGE PHYSICS (Prompt 2) */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400 tracking-wider uppercase">
                <div className="flex items-center gap-2">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Interaction</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDoorOpen ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-400'}`}>
                  {isDoorOpen ? `Open (${openAngle}°)` : 'Closed'}
                </span>
              </div>

              {/* Glassmorphic "Open Door" Toggle Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <span className="text-xs font-semibold text-slate-200">
                  Open Door
                </span>
                <button
                  onClick={() => store.toggleDoorOpen()}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isDoorOpen ? 'bg-blue-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isDoorOpen ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Animation Mode Segmented Controls: Smooth Glide vs Instant Snap */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-950/60 border border-white/10">
                <button
                  onClick={() => store.setAnimationMode('smooth')}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    animationMode === 'smooth'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  Smooth Glide
                </button>
                <button
                  onClick={() => store.setAnimationMode('instant')}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    animationMode === 'instant'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  Instant Snap
                </button>
              </div>

              {/* Secondary Slider: Swing Angle (Appears ONLY when isDoorOpen is true) */}
              {isDoorOpen && (
                <div className="space-y-1.5 p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm transition-all">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-blue-300">Swing Angle</span>
                    <span className="font-mono font-bold text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-md border border-cyan-500/30">
                      {openAngle}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="180"
                    step="1"
                    value={openAngle}
                    onChange={(e) =>
                      store.setDoorConfig({ openAngle: parseInt(e.target.value) })
                    }
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>10°</span>
                    <span>180° (Wide)</span>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: DIMENSIONS (cm) WITH EDITABLE INPUTS & SLIDERS */}
            <div className="space-y-4 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400 tracking-wider uppercase">
                <div className="flex items-center gap-2">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Dimensions (cm)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal lowercase">
                  type or drag
                </span>
              </div>

              {/* 1. Width */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-300">Width</span>
                  <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <input
                      type="number"
                      min="70"
                      max="120"
                      value={width}
                      onChange={(e) => handleWidthChange(parseFloat(e.target.value))}
                      onBlur={(e) => handleWidthChange(parseFloat(e.target.value))}
                      className="w-12 bg-transparent text-right font-mono font-bold text-amber-400 focus:outline-none focus:ring-0 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="font-mono text-amber-400 text-xs">cm</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="70"
                  max="120"
                  step="1"
                  value={width}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>70 cm</span>
                  <span>120 cm</span>
                </div>
              </div>

              {/* 2. Height (Left) */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-300">Height (Left)</span>
                  <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <input
                      type="number"
                      min="180"
                      max="250"
                      value={heightLeft}
                      onChange={(e) => handleHeightLeftChange(parseFloat(e.target.value))}
                      onBlur={(e) => handleHeightLeftChange(parseFloat(e.target.value))}
                      className="w-12 bg-transparent text-right font-mono font-bold text-amber-400 focus:outline-none focus:ring-0 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="font-mono text-amber-400 text-xs">cm</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="180"
                  max="250"
                  step="1"
                  value={heightLeft}
                  onChange={(e) => handleHeightLeftChange(parseInt(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>180 cm</span>
                  <span>250 cm</span>
                </div>
              </div>

              {/* 3. Height (Right) */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-300">Height (Right)</span>
                  <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <input
                      type="number"
                      min="180"
                      max="250"
                      value={heightRight}
                      onChange={(e) => handleHeightRightChange(parseFloat(e.target.value))}
                      onBlur={(e) => handleHeightRightChange(parseFloat(e.target.value))}
                      className="w-12 bg-transparent text-right font-mono font-bold text-amber-400 focus:outline-none focus:ring-0 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="font-mono text-amber-400 text-xs">cm</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="180"
                  max="250"
                  step="1"
                  value={heightRight}
                  onChange={(e) => handleHeightRightChange(parseInt(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>180 cm</span>
                  <span>250 cm</span>
                </div>
              </div>

              {/* 4. Thickness */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-300">Thickness</span>
                  <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <input
                      type="number"
                      min="3.0"
                      max="8.0"
                      step="0.5"
                      value={thickness}
                      onChange={(e) => handleThicknessChange(parseFloat(e.target.value))}
                      onBlur={(e) => handleThicknessChange(parseFloat(e.target.value))}
                      className="w-12 bg-transparent text-right font-mono font-bold text-amber-400 focus:outline-none focus:ring-0 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="font-mono text-amber-400 text-xs">cm</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="8.0"
                  step="0.5"
                  value={thickness}
                  onChange={(e) => handleThicknessChange(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>3.0 cm</span>
                  <span>8.0 cm</span>
                </div>
              </div>
            </div>

            {/* SECTION 3: FINISH SWATCHES */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider uppercase">
                  <Palette className="w-3.5 h-3.5" />
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
                      className="group relative flex flex-col items-center gap-1.5 transition-all transform active:scale-95"
                      title={swatch.name}
                    >
                      <div
                        className={`w-9 h-9 rounded-full shadow-lg transition-all flex items-center justify-center border-2 ${
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
                  <Home className="w-3.5 h-3.5" />
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
                      className="group relative flex flex-col items-center gap-1 transition-all transform active:scale-95"
                      title={wSwatch.name}
                    >
                      <div
                        className={`w-7 h-7 rounded-full shadow-md transition-all flex items-center justify-center border-2 ${
                          isSelected
                            ? 'ring-4 ring-cyan-500/40 scale-110 border-white'
                            : 'border-white/20 hover:scale-105'
                        }`}
                        style={{ backgroundColor: wSwatch.hex }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium group-hover:text-slate-200">
                        {wSwatch.name.split(' ')[0]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* SECTION 5: FLOATING ACTION BUTTON */}
            <div className="pt-2">
              <button
                onClick={handleQuoteClick}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition-all active:scale-[0.98] border border-amber-300/40"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                Request Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConfigPanel
