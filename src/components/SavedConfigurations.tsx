import React, { useState } from 'react'
import {
  ChevronRight,
  DoorClosed,
  Search,
  SlidersHorizontal,
  Plus,
} from 'lucide-react'

export interface ConfigurationItem {
  id: string
  title: string
  width: number
  heightLeft: number
  heightRight: number
  finish: string
  finishColor: string
  updatedAt: string
  status: 'Draft' | 'Approved' | 'In Production' | 'Quoted'
}

export const SAMPLE_CONFIGURATIONS: ConfigurationItem[] = [
  {
    id: 'cfg-1',
    title: 'Front Entry Door',
    width: 90,
    heightLeft: 210,
    heightRight: 210,
    finish: 'Dark Walnut',
    finishColor: '#3f2e21',
    updatedAt: '2 hours ago',
    status: 'Approved',
  },
  {
    id: 'cfg-2',
    title: 'Executive Suite Entrance',
    width: 100,
    heightLeft: 225,
    heightRight: 225,
    finish: 'Light Oak',
    finishColor: '#d4a373',
    updatedAt: '1 day ago',
    status: 'Quoted',
  },
  {
    id: 'cfg-3',
    title: 'Patio Sliding Partition',
    width: 115,
    heightLeft: 240,
    heightRight: 240,
    finish: 'Matte Black',
    finishColor: '#18181b',
    updatedAt: '3 days ago',
    status: 'Draft',
  },
  {
    id: 'cfg-4',
    title: 'Cleanroom Hermetic Access',
    width: 85,
    heightLeft: 200,
    heightRight: 200,
    finish: 'Pearl White',
    finishColor: '#f8fafc',
    updatedAt: '5 days ago',
    status: 'In Production',
  },
  {
    id: 'cfg-5',
    title: 'Architectural Skewed Portal',
    width: 95,
    heightLeft: 200,
    heightRight: 225,
    finish: 'Marine Ocean Blue',
    finishColor: '#0284c7',
    updatedAt: '1 week ago',
    status: 'Approved',
  },
  {
    id: 'cfg-6',
    title: 'Industrial Modular Housing Door',
    width: 110,
    heightLeft: 230,
    heightRight: 230,
    finish: 'Stealth Carbon Slate',
    finishColor: '#334155',
    updatedAt: '2 weeks ago',
    status: 'Quoted',
  },
]

export interface SavedConfigurationsProps {
  onSelectConfig?: (config: ConfigurationItem) => void
  onCreateNew?: () => void
}

/**
 * SavedConfigurations - Enterprise Responsive Grid of Configured Door Cards
 * Built with React and Tailwind CSS featuring pure white cards, rounded-2xl corners,
 * subtle shadow-sm, thumbnail icon, dimensions, finish info, and interactive chevron.
 */
export const SavedConfigurations: React.FC<SavedConfigurationsProps> = ({
  onSelectConfig,
  onCreateNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [configs] = useState<ConfigurationItem[]>(SAMPLE_CONFIGURATIONS)

  const filteredConfigs = configs.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.finish.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCardClick = (config: ConfigurationItem) => {
    if (onSelectConfig) {
      onSelectConfig(config)
    } else {
      alert(`Opening configuration "${config.title}" in 3D Studio.`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved configurations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:border-gray-300 shadow-sm transition">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span>Filter</span>
          </button>

          <button
            onClick={() => {
              if (onCreateNew) onCreateNew()
              else alert('Initiating new 3D Door project...')
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Door Config</span>
          </button>
        </div>
      </div>

      {/* Responsive Grid Layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConfigs.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all p-5 flex items-center justify-between cursor-pointer"
          >
            {/* Left: Thumbnail & Title/Specs Info */}
            <div className="flex items-center gap-4 min-w-0">
              {/* Small Placeholder Icon / Thumbnail */}
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                <DoorClosed className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
              </div>

              {/* Center Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                </div>

                {/* Muted Secondary Text showing Dimensions and Finish */}
                <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                  Width: {item.width}cm | Finish: {item.finish}
                </p>

                {/* Status & Date Sub-badge */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: item.finishColor }}
                    />
                    {item.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.updatedAt}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Right-facing Chevron Icon */}
            <div className="p-2 rounded-xl text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all flex-shrink-0 ml-2">
              <ChevronRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SavedConfigurations
