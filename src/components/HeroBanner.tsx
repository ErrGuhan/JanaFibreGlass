import React from 'react'
import { Sparkles, Box, ArrowRight, ShieldCheck } from 'lucide-react'

export interface HeroBannerProps {
  onOpenConfigurator?: () => void
}

/**
 * HeroBanner - Prominent Dark Gradient Hero Section
 * Features h1 headline, product description, high-contrast action button,
 * and a stylized container on the right for 3D door rendering/imagery.
 */
export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenConfigurator,
}) => {
  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800/80 shadow-2xl overflow-hidden p-8 sm:p-12 mb-8">
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headline, Description & CTA */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Parametric Door Engineering</span>
          </div>

          {/* Bold White H1 Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Custom Door Solutions <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Built for Architecture
            </span>
          </h1>

          {/* Product Description Paragraph in Lighter Gray */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
            Configure precision-built door frames, custom skewed geometries, and
            high-performance composite finishes in real-time. Designed to withstand
            extreme environmental conditions with 50+ years of structural service life.
          </p>

          {/* Prominent High-Contrast Action Button */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                if (onOpenConfigurator) onOpenConfigurator()
                else alert('Launching 3D Door Configurator Studio...')
              }}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all transform active:scale-95 cursor-pointer border border-blue-400/30"
            >
              <Box className="w-4 h-4" />
              <span>Open 3D Configurator</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ISO 9001 & ASTM Certified</span>
            </div>
          </div>
        </div>

        {/* Right Column: Empty / Stylized Container for 3D Render / Image */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-sm rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center shadow-inner group hover:border-slate-600 transition-colors">
            {/* Visual Glassmorphic Frame Backdrop */}
            <div className="w-48 h-64 rounded-xl border-2 border-dashed border-cyan-500/30 bg-slate-900/80 flex flex-col items-center justify-center p-4 relative shadow-2xl">
              <div className="w-36 h-48 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Box className="w-12 h-12 text-cyan-400 animate-pulse" />
              </div>
              <div className="absolute bottom-2 text-[10px] font-mono text-cyan-300/80 uppercase">
                Interactive 3D Viewport
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-400 font-mono">
              [ Static 3D Rendering / Asset Placeholder ]
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner
