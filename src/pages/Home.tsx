import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  Maximize,
  Smartphone,
  Sparkles,
  Sliders,
  CheckCircle2,
} from 'lucide-react'
import { fetchSiteContent, DEFAULT_SITE_CONTENT } from '../utils/api'
import type { SiteContentData } from '../utils/api'

export const Home: React.FC = () => {
  const [content, setContent] = useState<SiteContentData>(DEFAULT_SITE_CONTENT)
  const [isLoading, setIsLoading] = useState<boolean>(true)

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
    <div className="font-sans text-slate-800 space-y-8">
      
      {/* PROMPT 1: PREMIUM HERO SECTION REDESIGN */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column (Copy) */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-extrabold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Parametric Architectural Doors</span>
            </div>

            {/* Main Headline with gradient on "Custom" */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Premium Fiberglass Doors,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Custom
              </span>{' '}
              Built for You.
            </h1>

            {/* Subtext */}
            {isLoading ? (
              <div className="h-12 bg-slate-200 rounded-xl animate-pulse w-full mt-6" />
            ) : (
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-normal mt-6">
                {content.heroSubtext ||
                  'Design your exact dimensions, choose your finish, and preview your custom door in full 3D. Durable, stylish, and completely maintenance-free.'}
              </p>
            )}

            {/* CTA Buttons in a flex container */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/studio"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full px-8 py-4 font-semibold text-sm shadow-lg shadow-blue-500/30 transition-transform hover:-translate-y-1 flex items-center gap-2 active:scale-95"
              >
                <span>Open 3D Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/products"
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full px-8 py-4 font-semibold text-sm shadow-xs transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Browse Products</span>
              </Link>
            </div>

            {/* Quick trust checklist */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-gray-200/80 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Waterproof</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Warp & Swell</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Termite Proof</span>
              </div>
            </div>
          </div>

          {/* Right Column (Visual: Glassmorphic 3D Showcase Container) */}
          <div className="relative">
            <div className="bg-white/50 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-2xl text-left relative overflow-hidden space-y-6">
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-slate-900 text-[10px] font-mono font-bold tracking-wider text-blue-300 uppercase">
                  Interactive 3D Preview
                </span>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="relative z-10 h-64 bg-slate-900 rounded-2xl overflow-hidden p-6 flex flex-col justify-between text-white shadow-inner border border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block font-bold">MODEL</span>
                  <h3 className="text-lg font-bold text-white">Parametric FRP Door & Frame</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                    <span className="text-slate-400 block text-[9px]">Sizing</span>
                    <span className="font-bold text-white">84.0W × 210.0H cm</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                    <span className="text-slate-400 block text-[9px]">Finish</span>
                    <span className="font-bold text-amber-300">Light Oak</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <Link
                  to="/studio"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3.5 px-4 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <span>Customize in 3D Configurator</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PROMPT 2: CLEAN BENEFIT ICONS (BUILDING TRUST BANNER) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Block 1 */}
          <div className="flex flex-col items-center text-center space-y-3 p-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Built to Last</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              100% immune to rot, rust, and moisture.
            </p>
          </div>

          {/* Block 2 */}
          <div className="flex flex-col items-center text-center space-y-3 p-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <Maximize className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Exact Dimensions</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Custom manufactured to your frame's precise measurements.
            </p>
          </div>

          {/* Block 3 */}
          <div className="flex flex-col items-center text-center space-y-3 p-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Instant Quotes</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Configure your door online and inquire directly via WhatsApp.
            </p>
          </div>

        </div>
      </section>

    </div>
  )
}

export default Home
