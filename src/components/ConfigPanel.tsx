import React, { useState } from 'react'
import {
  Sliders,
  ChevronDown,
  ChevronUp,
  Ruler,
  Palette,
  RotateCw,
  Home,
  Minus,
  Plus,
  MessageCircle,
  Bookmark,
  Check,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { useConfigStore, WALL_COLORS } from '../store/useConfigStore'
import { sendWhatsAppInquiry } from '../utils/whatsapp'

export interface ColorFinishOption {
  name: string
  hex: string
  borderClass?: string
}

export const FINISH_SWATCHES: ColorFinishOption[] = [
  { name: 'Light Oak', hex: '#d4a373' },
  { name: 'Dark Walnut', hex: '#3f2e21' },
  { name: 'Matte Black', hex: '#18181b' },
  { name: 'Pearl White', hex: '#f8fafc', borderClass: 'border-gray-300' },
]

export interface ConfigPanelProps {
  topWidth?: number
  onTopWidthChange?: (val: number) => void
  bottomWidth?: number
  onBottomWidthChange?: (val: number) => void
  heightLeft?: number
  onHeightLeftChange?: (val: number) => void
  heightRight?: number
  onHeightRightChange?: (val: number) => void
  thickness?: number
  onThicknessChange?: (val: number) => void
  openSide?: 'left' | 'right'
  onOpenSideChange?: (side: 'left' | 'right') => void
  selectedColor?: string
  onColorChange?: (colorHex: string, colorName: string) => void
  onRequestQuote?: () => void
  className?: string
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  topWidth: propTopWidth,
  onTopWidthChange,
  bottomWidth: propBottomWidth,
  onBottomWidthChange,
  heightLeft: propHeightLeft,
  onHeightLeftChange,
  heightRight: propHeightRight,
  onHeightRightChange,
  thickness: propThickness,
  onThicknessChange,
  openSide: propOpenSide,
  onOpenSideChange,
  selectedColor: propSelectedColor,
  onColorChange,
  onRequestQuote,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<'size' | 'finish'>('size')
  const [isSaved, setIsSaved] = useState(false)

  const store = useConfigStore()

  const topWidth = propTopWidth ?? store.doorConfig.topWidth
  const bottomWidth = propBottomWidth ?? store.doorConfig.bottomWidth
  const heightLeft = propHeightLeft ?? store.doorConfig.leftHeight
  const heightRight = propHeightRight ?? store.doorConfig.rightHeight
  const thickness = propThickness ?? store.doorConfig.thickness
  const openSide = propOpenSide ?? store.doorConfig.openSide
  const currentColor = propSelectedColor ?? store.color
  const isDoorOpen = store.doorConfig.isDoorOpen
  const wallColor = store.wallColor

  const clamp = (val: number, min: number, max: number) => {
    if (isNaN(val)) return min
    const clamped = Math.max(min, Math.min(max, val))
    return Math.round(clamped * 10) / 10
  }

  const handleTopWidthChange = (val: number) => {
    const clamped = clamp(val, 70, 120)
    if (onTopWidthChange) onTopWidthChange(clamped)
    else store.setDoorConfig({ topWidth: clamped })
  }

  const handleBottomWidthChange = (val: number) => {
    const clamped = clamp(val, 70, 120)
    if (onBottomWidthChange) onBottomWidthChange(clamped)
    else store.setDoorConfig({ bottomWidth: clamped })
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

  const handleOpenSideChange = (side: 'left' | 'right') => {
    if (onOpenSideChange) onOpenSideChange(side)
    else store.setDoorConfig({ openSide: side })
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

  const handleWhatsAppInquiry = () => {
    sendWhatsAppInquiry({
      topWidth,
      bottomWidth,
      leftHeight: heightLeft,
      rightHeight: heightRight,
      thickness,
      openSide,
      colorName: activeFinishObj.name,
      colorHex: activeFinishObj.hex,
    })
  }

  const handleSaveDesign = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
    if (onRequestQuote) onRequestQuote()
  }

  return (
    <div className={`w-full transition-all duration-300 select-none pb-24 md:pb-0 ${className}`}>
      <div className="bg-white border-l border-gray-100 shadow-2xl rounded-2xl overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Door Configurator
            </h2>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {/* Tab Navigation */}
        {!isCollapsed && (
          <div className="p-3 border-b border-gray-100 bg-slate-50/50 flex justify-center">
            <div className="bg-slate-200/70 p-1 rounded-full flex gap-1 w-full max-w-xs">
              <button
                onClick={() => setActiveTab('size')}
                className={`flex-1 py-2 px-6 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'size'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 font-semibold'
                }`}
              >
                1. Size
              </button>
              <button
                onClick={() => setActiveTab('finish')}
                className={`flex-1 py-2 px-6 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'finish'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 font-semibold'
                }`}
              >
                2. Finish
              </button>
            </div>
          </div>
        )}

        {!isCollapsed && (
          <div className="p-5 space-y-6">
            
            {/* TAB 1: SIZE */}
            {activeTab === 'size' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Ruler className="w-4 h-4 text-blue-600" />
                  <span>Dimensions & Opening Side</span>
                </div>

                {/* 1. Width (Top) Stepper */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-gray-100 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Width (Top)</span>
                    <span className="text-[11px] text-slate-400 font-mono">70.0 - 120.0 cm</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleTopWidthChange(topWidth - 0.5)}
                      className="p-3 min-h-[44px] min-w-[44px] w-[44px] h-[44px] rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-bold border border-slate-200 flex items-center justify-center transition-all shadow-xs shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <div className="flex-1 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 px-4 py-2.5 shadow-xs">
                      <input
                        type="number"
                        min="70"
                        max="120"
                        step="0.1"
                        value={topWidth}
                        onChange={(e) => handleTopWidthChange(parseFloat(e.target.value))}
                        className="w-16 bg-transparent text-center font-mono font-bold text-slate-900 text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="font-mono text-slate-400 text-xs font-bold">cm</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTopWidthChange(topWidth + 0.5)}
                      className="p-3 min-h-[44px] min-w-[44px] w-[44px] h-[44px] rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-bold border border-slate-200 flex items-center justify-center transition-all shadow-xs shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2. Width (Bottom) Stepper */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-gray-100 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Width (Bottom)</span>
                    <span className="text-[11px] text-slate-400 font-mono">70.0 - 120.0 cm</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleBottomWidthChange(bottomWidth - 0.5)}
                      className="p-3 min-h-[44px] min-w-[44px] w-[44px] h-[44px] rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-bold border border-slate-200 flex items-center justify-center transition-all shadow-xs shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <div className="flex-1 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 px-4 py-2.5 shadow-xs">
                      <input
                        type="number"
                        min="70"
                        max="120"
                        step="0.1"
                        value={bottomWidth}
                        onChange={(e) => handleBottomWidthChange(parseFloat(e.target.value))}
                        className="w-16 bg-transparent text-center font-mono font-bold text-slate-900 text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="font-mono text-slate-400 text-xs font-bold">cm</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBottomWidthChange(bottomWidth + 0.5)}
                      className="p-3 min-h-[44px] min-w-[44px] w-[44px] h-[44px] rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-bold border border-slate-200 flex items-center justify-center transition-all shadow-xs shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3. Height (Left) Stepper */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-gray-100 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Height (Left)</span>
                    <span className="text-[11px] text-slate-400 font-mono">180.0 - 250.0 cm</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleHeightLeftChange(heightLeft - 0.5)}
                      className="p-3 min-h-[44px] min-w-[44px] w-[44px] h-[44px] rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-bold border border-slate-200 flex items-center justify-center transition-all shadow-xs shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <div className="flex-1 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 px-4 py-2.5 shadow-xs">
                      <input
                        type="number"
                        min="180"
                        max="250"
                        step="0.1"
                        value={heightLeft}
                        onChange={(e) => handleHeightLeftChange(parseFloat(e.target.value))}
                        className="w-16 bg-transparent text-center font-mono font-bold text-slate-900 text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="font-mono text-slate-400 text-xs font-bold">cm</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleHeightLeftChange(heightLeft + 0.5)}
                      className="p-3 min-h-[44px] min-w-[44px] w-[44px] h-[44px] rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-bold border border-slate-200 flex items-center justify-center transition-all shadow-xs shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 4. Height (Right) Stepper */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-gray-100 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Height (Right)</span>
                    <span className="text-[11px] text-slate-400 font-mono">180.0 - 250.0 cm</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleHeightRightChange(heightRight - 0.5)}
                      className="p-3 min-h-[44px] min-w-[44px] w-[44px] h-[44px] rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-bold border border-slate-200 flex items-center justify-center transition-all shadow-xs shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <div className="flex-1 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 px-4 py-2.5 shadow-xs">
                      <input
                        type="number"
                        min="180"
                        max="250"
                        step="0.1"
                        value={heightRight}
                        onChange={(e) => handleHeightRightChange(parseFloat(e.target.value))}
                        className="w-16 bg-transparent text-center font-mono font-bold text-slate-900 text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="font-mono text-slate-400 text-xs font-bold">cm</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleHeightRightChange(heightRight + 0.5)}
                      className="p-3 min-h-[44px] min-w-[44px] w-[44px] h-[44px] rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-bold border border-slate-200 flex items-center justify-center transition-all shadow-xs shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 5. Thickness Stepper */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-gray-100 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Thickness</span>
                    <span className="text-[11px] text-slate-400 font-mono">3.0 - 8.0 cm</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleThicknessChange(thickness - 0.5)}
                      className="p-3 min-h-[44px] min-w-[44px] w-[44px] h-[44px] rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-bold border border-slate-200 flex items-center justify-center transition-all shadow-xs shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <div className="flex-1 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 px-4 py-2.5 shadow-xs">
                      <input
                        type="number"
                        min="3.0"
                        max="8.0"
                        step="0.1"
                        value={thickness}
                        onChange={(e) => handleThicknessChange(parseFloat(e.target.value))}
                        className="w-16 bg-transparent text-center font-mono font-bold text-slate-900 text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="font-mono text-slate-400 text-xs font-bold">cm</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleThicknessChange(thickness + 0.5)}
                      className="p-3 min-h-[44px] min-w-[44px] w-[44px] h-[44px] rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-bold border border-slate-200 flex items-center justify-center transition-all shadow-xs shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 6. Door Opening Side Selector (Dual Pill Button Toggle) */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-gray-100 space-y-2.5">
                  <span className="text-xs font-bold text-slate-800 block">Door Opening Side</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenSideChange('left')}
                      className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        openSide === 'left'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Left Open</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenSideChange('right')}
                      className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        openSide === 'right'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>Right Open</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: FINISH */}
            {activeTab === 'finish' && (
              <div className="space-y-6">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                      <Palette className="w-4 h-4 text-blue-600" />
                      <span>Door Finish</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {activeFinishObj.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-around p-4 rounded-2xl bg-slate-50/80 border border-gray-100">
                    {FINISH_SWATCHES.map((swatch) => {
                      const isSelected =
                        currentColor.toLowerCase() === swatch.hex.toLowerCase()

                      return (
                        <button
                          key={swatch.name}
                          type="button"
                          onClick={() => handleFinishSelect(swatch)}
                          className="group flex flex-col items-center gap-1.5 transition-all transform active:scale-95"
                        >
                          <div
                            className={`w-9 h-9 rounded-full shadow-xs transition-all flex items-center justify-center ${
                              isSelected
                                ? 'ring-2 ring-offset-2 ring-slate-900 scale-105'
                                : `${swatch.borderClass || 'border border-gray-300'} hover:scale-105`
                            }`}
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span
                            className={`text-[11px] font-semibold ${
                              isSelected ? 'text-slate-900 font-bold' : 'text-slate-500'
                            }`}
                          >
                            {swatch.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3.5 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                      <Home className="w-4 h-4 text-blue-600" />
                      <span>Environment Context</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {store.wallColorName}
                    </span>
                  </div>

                  <div className="flex items-center justify-around p-4 rounded-2xl bg-slate-50/80 border border-gray-100">
                    {WALL_COLORS.map((wSwatch) => {
                      const isSelected =
                        wallColor.toLowerCase() === wSwatch.hex.toLowerCase()

                      return (
                        <button
                          key={wSwatch.name}
                          type="button"
                          onClick={() => store.setWallColor(wSwatch.hex, wSwatch.name)}
                          className="group flex flex-col items-center gap-1 transition-all transform active:scale-95"
                        >
                          <div
                            className={`w-8 h-8 rounded-full shadow-xs transition-all flex items-center justify-center ${
                              isSelected
                                ? 'ring-2 ring-offset-2 ring-slate-900 scale-105'
                                : 'border border-gray-300 hover:scale-105'
                            }`}
                            style={{ backgroundColor: wSwatch.hex }}
                          />
                          <span
                            className={`text-[10px] font-semibold ${
                              isSelected ? 'text-slate-900 font-bold' : 'text-slate-500'
                            }`}
                          >
                            {wSwatch.name.split(' ')[0]}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <RotateCw className="w-4 h-4 text-blue-600" />
                    <span>Door Panel Swing</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-gray-100">
                    <span className="text-xs font-bold text-slate-800">
                      Open Door Panel
                    </span>
                    <button
                      type="button"
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
                </div>
              </div>
            )}

            {/* Save Design Button */}
            <button
              type="button"
              onClick={handleSaveDesign}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all border border-gray-200 shadow-xs"
            >
              {isSaved ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Bookmark className="w-4 h-4 text-slate-500" />
              )}
              <span>{isSaved ? 'Design Saved!' : 'Save Design Specs'}</span>
            </button>

          </div>
        )}

      </div>

      {/* STICKY GLASSMORPHIC FOOTER CONTAINER FOR WHATSAPP BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 w-full p-4 bg-white/80 backdrop-blur-lg border-t border-gray-100 md:relative md:bg-transparent md:border-none md:p-0 z-40 shadow-lg md:shadow-none">
        <button
          type="button"
          onClick={handleWhatsAppInquiry}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2.5 w-full transition-all active:scale-[0.98] text-sm"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span>Inquire on WhatsApp</span>
        </button>
      </div>

    </div>
  )
}

export default ConfigPanel
