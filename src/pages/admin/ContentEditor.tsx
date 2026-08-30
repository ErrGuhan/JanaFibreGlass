import React, { useState, useEffect } from 'react'
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Type,
  Phone,
  Mail,
  MessageCircle,
  Info,
  WifiOff,
} from 'lucide-react'
import { fetchSiteContent, updateSiteContent } from '../../utils/api'
import type { SiteContentData } from '../../utils/api'

export const ContentEditor: React.FC = () => {
  const [formData, setFormData] = useState<SiteContentData>({
    heroHeadline: '',
    heroSubtext: '',
    aboutUsText: '',
    contactPhone: '',
    contactEmail: '',
  })
  const [whatsappNumber, setWhatsappNumber] = useState<string>('+916383236623')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [statusAlert, setStatusAlert] = useState<{
    type: 'success' | '503_warning' | 'error'
    message: string
  } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    setStatusAlert(null)
    try {
      const data = await fetchSiteContent()
      setFormData(data)
      setWhatsappNumber(data.contactPhone || '+916383236623')

      if (data.isFallback) {
        setStatusAlert({
          type: '503_warning',
          message: 'Database Connection Issue: Displaying locally cached website content.',
        })
      }
    } catch (err) {
      console.error(err)
      setStatusAlert({
        type: 'error',
        message: 'Failed to load website content.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setStatusAlert(null)

    try {
      const result = await updateSiteContent(formData)

      if (result.is503) {
        setStatusAlert({
          type: '503_warning',
          message: 'Experiencing connection issues. Saved website changes locally to this device.',
        })
      } else {
        setStatusAlert({
          type: 'success',
          message: 'Website changes saved successfully! Public website updated.',
        })
        setTimeout(() => setStatusAlert(null), 4000)
      }
    } catch (err) {
      console.error(err)
      setStatusAlert({
        type: 'error',
        message: 'Failed to save website content.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 animate-pulse text-left">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-40 bg-white rounded-xl border border-gray-100" />
        <div className="h-40 bg-white rounded-xl border border-gray-100" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left relative pb-20">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Website Content Editor
        </h1>
        <p className="text-xs text-slate-500">
          Manage dynamic text, hero headlines, about section, and contact details for the public site.
        </p>
      </div>

      {/* Status Alerts (Success / 503 Warning / Error) */}
      {statusAlert && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-2xs ${
            statusAlert.type === '503_warning'
              ? 'bg-amber-50 border border-amber-200 text-amber-800'
              : statusAlert.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {statusAlert.type === '503_warning' ? (
            <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
          ) : statusAlert.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{statusAlert.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* CARD 1: HERO SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-slate-900 font-bold text-sm">
            <Type className="w-4 h-4 text-blue-600" />
            <h2>Hero Section</h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Main Headline</label>
            <input
              type="text"
              name="heroHeadline"
              required
              value={formData.heroHeadline}
              onChange={handleChange}
              placeholder="e.g. Precision Engineered Custom Doors"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Subtext Paragraph</label>
            <textarea
              name="heroSubtext"
              rows={3}
              required
              value={formData.heroSubtext}
              onChange={handleChange}
              placeholder="Enter hero paragraph subtext..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium text-slate-800 leading-relaxed"
            />
          </div>
        </div>

        {/* CARD 2: ABOUT US SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-slate-900 font-bold text-sm">
            <Info className="w-4 h-4 text-blue-600" />
            <h2>About Us Section</h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Company Description</label>
            <textarea
              name="aboutUsText"
              rows={5}
              required
              value={formData.aboutUsText}
              onChange={handleChange}
              placeholder="Enter full company profile description..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium text-slate-800 leading-relaxed"
            />
          </div>
        </div>

        {/* CARD 3: CONTACT DETAILS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-slate-900 font-bold text-sm">
            <Phone className="w-4 h-4 text-blue-600" />
            <h2>Contact Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Support Phone</span>
              </label>
              <input
                type="text"
                name="contactPhone"
                required
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono font-semibold text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                name="contactEmail"
                required
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono font-semibold text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Number</span>
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => {
                  setWhatsappNumber(e.target.value)
                  setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono font-semibold text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* FIXED BOTTOM RIGHT SAVE BUTTON */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2.5 active:scale-[0.97] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Website Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContentEditor
