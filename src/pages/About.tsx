import React, { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, MessageCircle, ShieldCheck, Factory, Award, HelpCircle } from 'lucide-react'
import { fetchSiteContent, DEFAULT_SITE_CONTENT } from '../utils/api'
import type { SiteContentData } from '../utils/api'

export const About: React.FC = () => {
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

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent('Hello JANA FIBRE GLASS! I have an inquiry about custom FRP doors.')
    const phoneClean = (content.contactPhone || '+916383236623').replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${phoneClean}?text=${text}`, '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10 text-left font-sans">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
          <Factory className="w-3.5 h-3.5" />
          <span>About & Contact</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          JANA FIBRE GLASS
        </h1>
        <p className="text-sm text-slate-500">
          Pioneering high-performance composite fiberglass doors and custom parametric architectural solutions.
        </p>
      </div>

      {/* SECTION 1: CONTACT US CARD */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Direct Contact & Inquiry</h2>
            <p className="text-xs text-slate-500">Get in touch with our engineering & sales team</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-700">
          {/* Address */}
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-gray-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Factory & Office</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              JANA FIBRE GLASS<br />
              Industrial Estate, Outer Ring Road<br />
              Tamil Nadu, India - 600001
            </p>
          </div>

          {/* Dynamic Phone Number with Skeleton */}
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-gray-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Phone className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Phone / Call</span>
            </div>
            {isLoading ? (
              <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse" />
            ) : (
              <p className="text-slate-600 font-mono text-sm font-semibold">
                {content.contactPhone}
              </p>
            )}
            <p className="text-[11px] text-slate-400">Mon - Sat: 9:00 AM - 7:00 PM</p>
          </div>

          {/* Dynamic Email Address with Skeleton */}
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-gray-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Email Address</span>
            </div>
            {isLoading ? (
              <div className="h-5 bg-slate-200 rounded w-full animate-pulse" />
            ) : (
              <p className="text-slate-600 font-mono text-xs">
                {content.contactEmail}
              </p>
            )}
            <p className="text-[11px] text-slate-400">Response within 24 hours</p>
          </div>
        </div>

        {/* Green "Chat on WhatsApp" Button */}
        <button
          onClick={handleWhatsAppChat}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-5 rounded-xl shadow-sm flex items-center justify-center gap-2.5 w-full transition-all active:scale-[0.98] text-sm"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span>Chat on WhatsApp ({content.contactPhone})</span>
        </button>
      </div>

      {/* SECTION 2: ABOUT THE COMPANY (Dynamic Text with Skeleton) */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">About the Company</h2>
        </div>

        {isLoading ? (
          <div className="space-y-2.5 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-11/12" />
            <div className="h-4 bg-slate-200 rounded w-4/5" />
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 whitespace-pre-line">
            <p>{content.aboutUsText}</p>
          </div>
        )}
      </div>

      {/* SECTION 3: DISCLAIMERS & TERMS */}
      <div className="bg-slate-100/70 border border-gray-200/80 rounded-2xl p-6 space-y-3 text-slate-500 text-sm">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <span>Manufacturing Tolerances, Warranty & Policies</span>
        </div>
        <div className="text-xs leading-relaxed space-y-2 text-slate-600">
          <p>
            • <strong>Dimensional Tolerances:</strong> Due to custom parametric hand-layup and molding processes, final manufactured dimensions carry a standard tolerance of ±0.5 cm (5 mm).
          </p>
          <p>
            • <strong>Return Policy for Custom Orders:</strong> All custom-sized door configurations are built to order based on customer-provided dimensions. Custom parametric orders cannot be returned or refunded once manufacturing has commenced, unless a material structural defect is verified.
          </p>
          <p>
            • <strong>Warranty Limitations:</strong> JANA FIBRE GLASS provides a 10-year limited warranty against warping, swelling, and termite damage under normal usage conditions. Improper installation, unauthorized structural modifications, or physical abuse void warranty coverage.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
