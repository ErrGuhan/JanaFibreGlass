import React, { useState } from 'react'
import {
  useConfigStore,
  PRESET_COLORS,
} from '../store/useConfigStore'
import type {
  ProductType,
  MaterialFinish,
  EnvPreset,
} from '../store/useConfigStore'
import {
  Layers,
  Palette,
  Sliders,
  Sun,
  RotateCcw,
  Sparkles,
  Cylinder,
  Shield,
  Box,
  Radio,
  DoorClosed,
  Check,
  Camera,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react'

export const ConfiguratorUI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'model' | 'materials' | 'dimensions' | 'environment'>('model')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const {
    productType,
    color,
    colorName,
    finish,
    roughness,
    metalness,
    clearcoat,
    transmission,
    wireframe,
    autoRotate,
    rotationSpeed,
    envPreset,
    showGrid,
    showDimensions,
    reinforcementRibs,
    flangeAccessory,
    dimensions,
    doorConfig,
    setProductType,
    setColor,
    setFinish,
    setRoughness,
    setMetalness,
    setClearcoat,
    setTransmission,
    setWireframe,
    setAutoRotate,
    setRotationSpeed,
    setEnvPreset,
    setShowGrid,
    setShowDimensions,
    setReinforcementRibs,
    setFlangeAccessory,
    setDimensions,
    setDoorConfig,
    resetDefaults,
  } = useConfigStore()

  // Calculate estimated fiberglass volume & weight
  const surfaceArea =
    productType === 'door'
      ? ((doorConfig.topWidth + doorConfig.bottomWidth) / 200) *
        ((doorConfig.leftHeight + doorConfig.rightHeight) / 200) *
        2
      : productType === 'tank'
      ? 2 * Math.PI * (dimensions.diameter / 2) * dimensions.height + 2 * Math.PI * Math.pow(dimensions.diameter / 2, 2)
      : productType === 'pipe'
      ? 2 * Math.PI * (dimensions.diameter / 2) * dimensions.height
      : productType === 'dome'
      ? 2 * Math.PI * Math.pow(dimensions.diameter / 2, 2)
      : 2 * (dimensions.diameter * dimensions.height + dimensions.diameter * (dimensions.diameter * 0.8) + dimensions.height * (dimensions.diameter * 0.8))

  const estimatedThickness = productType === 'door' ? doorConfig.thickness * 10 : dimensions.thickness
  const estimatedWeightKg = Math.round(surfaceArea * (estimatedThickness / 1000) * 1800)

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `jana-fibreglass-${productType}-spec.png`
      link.href = url
      link.click()
    }
  }

  const products: { id: ProductType; name: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'door',
      name: 'Parametric 3D Door',
      desc: 'Dynamic skewed & custom frame panel',
      icon: <DoorClosed className="w-5 h-5" />,
    },
    {
      id: 'tank',
      name: 'Vertical FRP Tank',
      desc: 'Corrosion-proof chemical & water storage',
      icon: <Cylinder className="w-5 h-5" />,
    },
    {
      id: 'dome',
      name: 'Geodesic Dome',
      desc: 'Lightweight architectural shelter',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: 'pipe',
      name: 'Composite Piping',
      desc: 'High-pressure flanged duct line',
      icon: <Radio className="w-5 h-5" />,
    },
    {
      id: 'enclosure',
      name: 'Modular Kiosk',
      desc: 'Weatherproof electrical enclosure',
      icon: <Box className="w-5 h-5" />,
    },
  ]

  const finishes: { id: MaterialFinish; name: string; desc: string }[] = [
    { id: 'glossy', name: 'High-Gloss Gelcoat', desc: 'UV resistant shiny mirror surface' },
    { id: 'matte', name: 'Industrial Matte', desc: 'Anti-glare textured composite finish' },
    { id: 'translucent', name: 'Translucent Resin', desc: 'Visual liquid level monitoring' },
    { id: 'metallic', name: 'Sparkle Metallic', desc: 'Conductive aesthetic coating' },
    { id: 'carbon', name: 'Reinforced Carbon', desc: 'Hybrid weave structural finish' },
  ]

  const envs: { id: EnvPreset; name: string }[] = [
    { id: 'city', name: 'Urban Skylight' },
    { id: 'studio', name: 'Pure White Studio' },
    { id: 'sunset', name: 'Warm Sunset Horizon' },
    { id: 'forest', name: 'Diffuse Nature' },
    { id: 'apartment', name: 'Cleanroom Indoor' },
  ]

  return (
    <aside
      className={`fixed top-20 right-4 bottom-4 z-40 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-14' : 'w-96'
      }`}
    >
      <div className="relative flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-slate-700/50">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-sm tracking-wide text-slate-100 uppercase">
                Configuration Studio
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors ml-auto"
            title={isCollapsed ? 'Expand Panel' : 'Collapse Panel'}
          >
            {isCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        </div>

        {isCollapsed ? (
          /* Collapsed Icon Bar */
          <div className="flex flex-col items-center gap-4 py-6">
            <button
              onClick={() => {
                setIsCollapsed(false)
                setActiveTab('model')
              }}
              className={`p-2.5 rounded-xl transition-all ${
                activeTab === 'model'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Products"
            >
              <Layers className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setIsCollapsed(false)
                setActiveTab('materials')
              }}
              className={`p-2.5 rounded-xl transition-all ${
                activeTab === 'materials'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Materials & Colors"
            >
              <Palette className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setIsCollapsed(false)
                setActiveTab('dimensions')
              }}
              className={`p-2.5 rounded-xl transition-all ${
                activeTab === 'dimensions'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Dimensions & Specs"
            >
              <Sliders className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setIsCollapsed(false)
                setActiveTab('environment')
              }}
              className={`p-2.5 rounded-xl transition-all ${
                activeTab === 'environment'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Lighting & Environment"
            >
              <Sun className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 border-b border-slate-800/80 bg-slate-950/40 p-1 gap-1">
              <button
                onClick={() => setActiveTab('model')}
                className={`flex flex-col items-center py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'model'
                    ? 'bg-slate-800 text-cyan-400 shadow-sm border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Layers className="w-4 h-4 mb-1" />
                Model
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`flex flex-col items-center py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'materials'
                    ? 'bg-slate-800 text-cyan-400 shadow-sm border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Palette className="w-4 h-4 mb-1" />
                Finish
              </button>
              <button
                onClick={() => setActiveTab('dimensions')}
                className={`flex flex-col items-center py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'dimensions'
                    ? 'bg-slate-800 text-cyan-400 shadow-sm border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Sliders className="w-4 h-4 mb-1" />
                Specs
              </button>
              <button
                onClick={() => setActiveTab('environment')}
                className={`flex flex-col items-center py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'environment'
                    ? 'bg-slate-800 text-cyan-400 shadow-sm border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Sun className="w-4 h-4 mb-1" />
                Scene
              </button>
            </div>

            {/* Tab Body Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* TAB 1: PRODUCT MODEL */}
              {activeTab === 'model' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Select 3D Object
                    </label>
                    <div className="space-y-2">
                      {products.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setProductType(item.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                            productType === item.id
                              ? 'glass-card-active text-white border-cyan-500/50 shadow-md'
                              : 'glass-card text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg ${
                              productType === item.id
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm">{item.name}</div>
                            <div className="text-xs text-slate-400 truncate">{item.desc}</div>
                          </div>
                          {productType === item.id && (
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Parametric Door Presets */}
                  {productType === 'door' && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Door Geometry Presets
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() =>
                            setDoorConfig({
                              topWidth: 90,
                              bottomWidth: 90,
                              leftHeight: 210,
                              rightHeight: 210,
                            })
                          }
                          className="p-2 rounded-lg glass-card hover:bg-slate-800 text-slate-300 text-left border border-slate-700"
                        >
                          <div className="font-semibold text-cyan-400">Standard Rect</div>
                          <div className="text-[10px] text-slate-400">90×210 cm</div>
                        </button>
                        <button
                          onClick={() =>
                            setDoorConfig({
                              topWidth: 80,
                              bottomWidth: 100,
                              leftHeight: 200,
                              rightHeight: 225,
                            })
                          }
                          className="p-2 rounded-lg glass-card hover:bg-slate-800 text-slate-300 text-left border border-slate-700"
                        >
                          <div className="font-semibold text-amber-400">Skewed & Sloped</div>
                          <div className="text-[10px] text-slate-400">LH 200 / RH 225</div>
                        </button>
                        <button
                          onClick={() =>
                            setDoorConfig({
                              topWidth: 70,
                              bottomWidth: 110,
                              leftHeight: 210,
                              rightHeight: 210,
                            })
                          }
                          className="p-2 rounded-lg glass-card hover:bg-slate-800 text-slate-300 text-left border border-slate-700"
                        >
                          <div className="font-semibold text-emerald-400">Tapered Base</div>
                          <div className="text-[10px] text-slate-400">TW 70 / BW 110</div>
                        </button>
                        <button
                          onClick={() =>
                            setDoorConfig({
                              topWidth: 100,
                              bottomWidth: 80,
                              leftHeight: 230,
                              rightHeight: 195,
                            })
                          }
                          className="p-2 rounded-lg glass-card hover:bg-slate-800 text-slate-300 text-left border border-slate-700"
                        >
                          <div className="font-semibold text-purple-400">Extreme Tilt</div>
                          <div className="text-[10px] text-slate-400">Custom Polygon</div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Structural Addons for other models */}
                  {productType !== 'door' && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-3">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                        Accessories & Features
                      </label>
                      <label className="flex items-center justify-between p-2.5 rounded-xl glass-card cursor-pointer hover:bg-slate-800/60 transition">
                        <span className="text-xs font-medium text-slate-300">Reinforcement Hoop Ribs</span>
                        <input
                          type="checkbox"
                          checked={reinforcementRibs}
                          onChange={(e) => setReinforcementRibs(e.target.checked)}
                          className="w-4 h-4 rounded text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-slate-900 border-slate-700"
                        />
                      </label>
                      <label className="flex items-center justify-between p-2.5 rounded-xl glass-card cursor-pointer hover:bg-slate-800/60 transition">
                        <span className="text-xs font-medium text-slate-300">Nozzle / Flange Fittings</span>
                        <input
                          type="checkbox"
                          checked={flangeAccessory}
                          onChange={(e) => setFlangeAccessory(e.target.checked)}
                          className="w-4 h-4 rounded text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-slate-900 border-slate-700"
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MATERIALS & FINISH */}
              {activeTab === 'materials' && (
                <div className="space-y-4">
                  {/* Current Active Color Display */}
                  <div className="flex items-center justify-between p-3 rounded-xl glass-card border border-slate-700">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full shadow-inner border border-white/20"
                        style={{ backgroundColor: color }}
                      />
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{colorName}</div>
                        <div className="text-[11px] font-mono text-cyan-400">{color.toUpperCase()}</div>
                      </div>
                    </div>
                    {/* Custom Hex Picker Input */}
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      title="Choose Custom Color"
                    />
                  </div>

                  {/* Swatches Grid */}
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Door & Composite Color Palette
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => setColor(c.hex, c.name)}
                          className={`group relative aspect-square rounded-xl transition-transform transform active:scale-95 flex items-center justify-center border ${
                            color.toLowerCase() === c.hex.toLowerCase()
                              ? 'border-white ring-2 ring-cyan-500 scale-105'
                              : 'border-white/10 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={`${c.name} (${c.hex})`}
                        >
                          {color.toLowerCase() === c.hex.toLowerCase() && (
                            <Check
                              className={`w-4 h-4 ${
                                c.hex === '#f8fafc' ? 'text-slate-900' : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Material Treatment Types */}
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Surface Finish Treatment
                    </label>
                    <div className="space-y-1.5">
                      {finishes.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setFinish(f.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                            finish === f.id
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                              : 'glass-card text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div>
                            <div>{f.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{f.desc}</div>
                          </div>
                          {finish === f.id && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fine Surface Tuning Sliders */}
                  <div className="space-y-3 pt-2 border-t border-slate-800/80">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Physical PBR Properties
                    </label>

                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Roughness</span>
                        <span className="font-mono text-cyan-400">{Math.round(roughness * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={roughness}
                        onChange={(e) => setRoughness(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Metallic Reflection</span>
                        <span className="font-mono text-cyan-400">{Math.round(metalness * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={metalness}
                        onChange={(e) => setMetalness(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Clearcoat Polish</span>
                        <span className="font-mono text-cyan-400">{Math.round(clearcoat * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={clearcoat}
                        onChange={(e) => setClearcoat(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Translucency</span>
                        <span className="font-mono text-cyan-400">{Math.round(transmission * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={transmission}
                        onChange={(e) => setTransmission(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DIMENSIONS & TECHNICAL SPECS */}
              {activeTab === 'dimensions' && (
                <div className="space-y-4">
                  {productType === 'door' ? (
                    <div className="space-y-3.5">
                      <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                        Parametric Door Inputs (cm)
                      </label>

                      {/* Top Width */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Top Width (topWidth)</span>
                          <span className="font-mono text-cyan-400 font-bold">{doorConfig.topWidth} cm</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="160"
                          step="1"
                          value={doorConfig.topWidth}
                          onChange={(e) => setDoorConfig({ topWidth: parseInt(e.target.value) })}
                          className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Bottom Width */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Bottom Width (bottomWidth)</span>
                          <span className="font-mono text-cyan-400 font-bold">{doorConfig.bottomWidth} cm</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="160"
                          step="1"
                          value={doorConfig.bottomWidth}
                          onChange={(e) => setDoorConfig({ bottomWidth: parseInt(e.target.value) })}
                          className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Left Height */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Left Height (leftHeight)</span>
                          <span className="font-mono text-cyan-400 font-bold">{doorConfig.leftHeight} cm</span>
                        </div>
                        <input
                          type="range"
                          min="150"
                          max="280"
                          step="1"
                          value={doorConfig.leftHeight}
                          onChange={(e) => setDoorConfig({ leftHeight: parseInt(e.target.value) })}
                          className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Right Height */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Right Height (rightHeight)</span>
                          <span className="font-mono text-cyan-400 font-bold">{doorConfig.rightHeight} cm</span>
                        </div>
                        <input
                          type="range"
                          min="150"
                          max="280"
                          step="1"
                          value={doorConfig.rightHeight}
                          onChange={(e) => setDoorConfig({ rightHeight: parseInt(e.target.value) })}
                          className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Thickness */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Door Panel Thickness</span>
                          <span className="font-mono text-cyan-400 font-bold">{doorConfig.thickness} cm</span>
                        </div>
                        <input
                          type="range"
                          min="2.0"
                          max="10.0"
                          step="0.5"
                          value={doorConfig.thickness}
                          onChange={(e) => setDoorConfig({ thickness: parseFloat(e.target.value) })}
                          className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Open Swing Angle */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Door Swing Opening</span>
                          <span className="font-mono text-cyan-400 font-bold">
                            {Math.round((doorConfig.openAngle * 180) / Math.PI)}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1.57"
                          step="0.02"
                          value={doorConfig.openAngle}
                          onChange={(e) => setDoorConfig({ openAngle: parseFloat(e.target.value) })}
                          className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Default Product Dimensions */
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                        Geometric Scale
                      </label>

                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Height / Length</span>
                          <span className="font-mono text-cyan-400">{dimensions.height.toFixed(1)} m</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="8.0"
                          step="0.1"
                          value={dimensions.height}
                          onChange={(e) => setDimensions({ height: parseFloat(e.target.value) })}
                          className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Diameter / Base Width</span>
                          <span className="font-mono text-cyan-400">{dimensions.diameter.toFixed(1)} m</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="6.0"
                          step="0.1"
                          value={dimensions.diameter}
                          onChange={(e) => setDimensions({ diameter: parseFloat(e.target.value) })}
                          className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Composite Wall Thickness</span>
                          <span className="font-mono text-cyan-400">{dimensions.thickness} mm</span>
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="32"
                          step="1"
                          value={dimensions.thickness}
                          onChange={(e) => setDimensions({ thickness: parseInt(e.target.value) })}
                          className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* Calculated Engineering Metrics */}
                  <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                      <Info className="w-4 h-4" />
                      Engineering Estimates
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                        <div className="text-slate-400 text-[10px]">Estimated Weight</div>
                        <div className="text-slate-100 font-bold font-mono mt-0.5">{estimatedWeightKg} kg</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                        <div className="text-slate-400 text-[10px]">Geometry Mode</div>
                        <div className="text-cyan-300 font-bold font-mono mt-0.5">
                          {productType === 'door'
                            ? doorConfig.leftHeight !== doorConfig.rightHeight || doorConfig.topWidth !== doorConfig.bottomWidth
                              ? 'Skewed / Trapezoid'
                              : 'Orthogonal Rect'
                            : 'Cylindrical 3D'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ENVIRONMENT & VIEW CONTROLS */}
              {activeTab === 'environment' && (
                <div className="space-y-4">
                  {/* HDR Lighting Preset */}
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Studio HDRI Lighting
                    </label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {envs.map((env) => (
                        <button
                          key={env.id}
                          onClick={() => setEnvPreset(env.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                            envPreset === env.id
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                              : 'glass-card text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>{env.name}</span>
                          {envPreset === env.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Viewport Toggles */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Viewport Overlays
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl glass-card cursor-pointer hover:bg-slate-800/60 transition">
                      <span className="text-xs font-medium text-slate-300">Dimension Overlays</span>
                      <input
                        type="checkbox"
                        checked={showDimensions}
                        onChange={(e) => setShowDimensions(e.target.checked)}
                        className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl glass-card cursor-pointer hover:bg-slate-800/60 transition">
                      <span className="text-xs font-medium text-slate-300">Engineering Grid Floor</span>
                      <input
                        type="checkbox"
                        checked={showGrid}
                        onChange={(e) => setShowGrid(e.target.checked)}
                        className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl glass-card cursor-pointer hover:bg-slate-800/60 transition">
                      <span className="text-xs font-medium text-slate-300">Wireframe Mesh Analysis</span>
                      <input
                        type="checkbox"
                        checked={wireframe}
                        onChange={(e) => setWireframe(e.target.checked)}
                        className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl glass-card cursor-pointer hover:bg-slate-800/60 transition">
                      <span className="text-xs font-medium text-slate-300">Continuous Auto-Rotate</span>
                      <input
                        type="checkbox"
                        checked={autoRotate}
                        onChange={(e) => setAutoRotate(e.target.checked)}
                        className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
                      />
                    </label>

                    {autoRotate && (
                      <div className="px-2 pt-1">
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Turntable Speed</span>
                          <span className="font-mono text-cyan-400">{rotationSpeed.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="4.0"
                          step="0.2"
                          value={rotationSpeed}
                          onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                          className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Panel Footer Actions */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/70 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={resetDefaults}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl glass-card text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
                <button
                  onClick={handleScreenshot}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/30 transition active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Capture
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
