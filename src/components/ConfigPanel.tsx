import React, { useState } from 'react'
import {
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Ruler,
  Palette,
  Check,
} from 'lucide-react'
import { useConfigStore } from '../store/useConfigStore'

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
 * Built with React and Tailwind CSS featuring strong frosted glass backdrop-blur-xl,
 * seamless canvas float, dynamic dimension sliders, color finish swatches, and quote CTA.
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

  const handleWidthChange = (val: number) => {
    if (onWidthChange) onWidthChange(val)
    else store.setDoorConfig({ topWidth: val, bottomWidth: val })
  }

  const handleHeightLeftChange = (val: number) => {
    if (onHeightLeftChange) onHeightLeftChange(val)
    else store.setDoorConfig({ leftHeight: val })
  }

  const handleHeightRightChange = (val: number) => {
    if (onHeightRightChange) onHeightRightChange(val)
    else store.setDoorConfig({ rightHeight: val })
  }

  const handleThicknessChange = (val: number) => {
    if (onThicknessChange) onThicknessChange(val)
    else store.setDoorConfig({ thickness: val })
  }

  const handleFinishSelect = (swatch: ColorFinishOption) => {
    if (onColorChange) {
      onColorChange(swatch.hex, swatch.name)
    }
    // Update global store color so meshStandardMaterial is updated reactively
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
            
            {/* SECTION 1: DIMENSIONS (cm) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider uppercase">
                <Ruler className="w-3.5 h-3.5" />
                <span>Dimensions (cm)</span>
              </div>

              {/* 1. Width Slider */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-300">Width</span>
                  <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {width} cm
                  </span>
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

              {/* 2. Height (Left) Slider */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-300">Height (Left)</span>
                  <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {heightLeft} cm
                  </span>
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

              {/* 3. Height (Right) Slider */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-300">Height (Right)</span>
                  <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {heightRight} cm
                  </span>
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

              {/* 4. Thickness Slider */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-300">Thickness</span>
                  <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {thickness} cm
                  </span>
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

            {/* SECTION 2: FINISH */}
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
                      className={`group relative flex flex-col items-center gap-1.5 transition-all transform active:scale-95`}
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

            {/* SECTION 3: FLOATING ACTION BUTTON */}
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
