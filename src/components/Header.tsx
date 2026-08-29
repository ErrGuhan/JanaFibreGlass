import React from 'react'
import { useConfigStore } from '../store/useConfigStore'
import { Sparkles, Download, Layers } from 'lucide-react'

export const Header: React.FC = () => {
  const { productType, colorName, finish, dimensions } = useConfigStore()

  const exportSpecSheet = () => {
    const specData = {
      brand: 'JANA FIBRE GLASS - Realtime Configurator',
      product: productType,
      color: colorName,
      finish: finish,
      dimensions: {
        height: `${dimensions.height} m`,
        diameter: `${dimensions.diameter} m`,
        thickness: `${dimensions.thickness} mm`,
      },
      date: new Date().toISOString(),
      standards: ['ASTM D3299', 'BS 4994', 'ISO 9001:2015 FRP Compliant'],
    }

    const blob = new Blob([JSON.stringify(specData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jana-fibreglass-${productType}-spec.json`
    a.click()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-6 py-3.5 flex items-center justify-between glass-panel border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      {/* Brand & Logo (Left Side Only) */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-300/30">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
            JANA <span className="text-cyan-400 font-extrabold">FIBRE GLASS</span>
          </h1>
          <span className="hidden sm:inline-block text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            3D Studio
          </span>
        </div>
      </div>

      {/* Right Action CTAs */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={exportSpecSheet}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-card text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition active:scale-95 border border-white/10"
          title="Export CAD JSON Specification"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          Export Specs
        </button>

        <a
          href="#quote"
          onClick={(e) => {
            e.preventDefault()
            alert(`Quote request initiated for configuration. Our sales team will contact you shortly.`)
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 transition active:scale-95 border border-cyan-300/30"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Request Quote
        </a>
      </div>
    </header>
  )
}
