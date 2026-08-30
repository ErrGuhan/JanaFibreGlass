import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Sparkles, Sliders, CheckCircle2, Droplets, Wrench, Clock } from 'lucide-react'
import { fetchSiteContent, DEFAULT_SITE_CONTENT } from '../utils/api'
import type { SiteContentData } from '../utils/api'

export const Home: React.FC = () => {
  const [content, setContent] = useState<SiteContentData>(DEFAULT_SITE_CONTENT)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      const data = await fetchSiteContent()
      setContent(data)
      setIsLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-16 py-8 md:py-16 font-sans">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Dynamic Headline & Action Buttons */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Parametric FRP Door Manufacturing</span>
            </div>

            {/* Dynamic Hero Headline with Tailwind Skeleton Loading */}
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-10 bg-slate-200 rounded-xl w-3/4" />
                <div className="h-10 bg-slate-200 rounded-xl w-1/2" />
              </div>
            ) : (
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                {content.heroHeadline}
              </h1>
            )}

            {/* Dynamic Hero Subtext with Skeleton */}
            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
              </div>
            ) : (
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                {content.heroSubtext}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/studio"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]"
              >
                <span>Design Your Door</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm border border-gray-200 shadow-xs transition-all"
              >
                <span>View Catalog</span>
              </Link>
            </div>

            {/* Key Benefits Pills */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-gray-200/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Waterproof</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Custom Dimensions</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Maintenance</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Card Showcase */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 p-8 shadow-xl border border-slate-700 text-white overflow-hidden min-h-[420px] flex flex-col justify-between">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl" />

              <div className="relative z-10 space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-mono font-bold tracking-wider text-blue-300 border border-white/10">
                    REAL-TIME 3D PREVIEW
                  </span>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Custom Parametric FRP Door & Frame
                </h3>
                <p className="text-xs text-slate-300">
                  Interactive real-time dimensional rendering with instant WhatsApp price inquiry.
                </p>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-3 pt-8">
                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Material</span>
                  <span className="text-xs font-bold text-white">Fiberglass Reinforced Polymer</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Precision</span>
                  <span className="text-xs font-bold text-emerald-400">± 0.1 cm Accuracy</span>
                </div>
              </div>

              <div className="relative z-10 pt-6">
                <Link
                  to="/studio"
                  className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Launch Interactive 3D Configurator</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. WHY CHOOSE JANA FIBRE GLASS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Choose FRP Composite Doors?
          </h2>
          <p className="text-sm text-slate-600">
            Engineered for extreme durability, moisture resistance, and architectural elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">100% Water & Weather Proof</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              FRP composite material never swells, warps, or rots when exposed to heavy rain, moisture, or coastal humidity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Custom Parametric Sizing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No need to compromise with standard factory sizes. Configure custom height, width, and frame depth to your exact opening.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Long Life & Zero Maintenance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Immune to termite attacks and chemical corrosion. Requires no painting or polishing over decades of heavy use.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
