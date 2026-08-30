import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Save,
  LogOut,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  Type,
  Layout,
  RefreshCw,
} from 'lucide-react'
import { fetchSiteContent, updateSiteContent } from '../../utils/api'
import type { SiteContentData } from '../../utils/api'

export const AdminDashboard: React.FC = () => {
  const [formData, setFormData] = useState<SiteContentData>({
    heroHeadline: '',
    heroSubtext: '',
    aboutUsText: '',
    contactPhone: '',
    contactEmail: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await fetchSiteContent()
      setFormData(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load site content.')
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
    setError('')
    setSaveSuccess(false)

    try {
      await updateSiteContent(formData)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error(err)
      setError('Failed to save changes to database.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top SaaS Header Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Admin Content Dashboard
              </h1>
              <p className="text-xs text-slate-500">
                Manage dynamic content, headlines, contact info & company text
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadContent}
              className="p-2.5 rounded-xl border border-gray-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Refresh Content"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 py-2 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs transition-colors border border-red-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Site content updated successfully! Public pages will reflect your changes immediately.</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 shadow-xs">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container Card */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
          
          {/* SECTION 1: HOMEPAGE HERO CONTENT */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Layout className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Homepage Hero Section
              </h2>
            </div>

            {/* Hero Headline Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-blue-600" />
                <span>Hero Headline (h1)</span>
              </label>
              <input
                type="text"
                name="heroHeadline"
                required
                value={formData.heroHeadline}
                onChange={handleChange}
                placeholder="e.g. Precision Engineered Custom Doors"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-900"
              />
            </div>

            {/* Hero Subtext Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Hero Subtext Paragraph</span>
              </label>
              <textarea
                name="heroSubtext"
                rows={3}
                required
                value={formData.heroSubtext}
                onChange={handleChange}
                placeholder="Enter supportive hero paragraph text..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium text-slate-800 leading-relaxed"
              />
            </div>
          </div>

          {/* SECTION 2: ABOUT US & COMPANY DESCRIPTION */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <FileText className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                About Us & Manufacturing Profile
              </h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Company Profile & Technical Expertise
              </label>
              <textarea
                name="aboutUsText"
                rows={4}
                required
                value={formData.aboutUsText}
                onChange={handleChange}
                placeholder="Detail company manufacturing expertise, quality commitment, and composite technology..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium text-slate-800 leading-relaxed"
              />
            </div>
          </div>

          {/* SECTION 3: CONTACT INFORMATION */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Phone className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Contact Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Contact Phone Number</span>
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  required
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="+91 6383236623"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>Contact Email Address</span>
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  required
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="info@janafibreglass.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono font-semibold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving || isLoading}
              className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving to Database...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminDashboard
