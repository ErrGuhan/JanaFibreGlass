import React from 'react'
import { MapPin, Image as ImageIcon, ExternalLink } from 'lucide-react'

export interface ProjectInstallation {
  id: string
  title: string
  location: string
  material: string
  imageUrl?: string
  date: string
}

export const PAST_INSTALLATIONS: ProjectInstallation[] = [
  {
    id: 'proj-1',
    title: 'Modern Oak Entryway',
    location: 'California, USA',
    material: 'Natural Light Oak',
    date: '2026',
  },
  {
    id: 'proj-2',
    title: 'Minimalist Obsidian Villa Portal',
    location: 'Zurich, Switzerland',
    material: 'Matte Black Steel',
    date: '2026',
  },
  {
    id: 'proj-3',
    title: 'Panoramic Glass Pivot Entrance',
    location: 'Tokyo, Japan',
    material: 'Tempered Acoustic Glass',
    date: '2025',
  },
  {
    id: 'proj-4',
    title: 'Executive Penthouse Suite Door',
    location: 'London, UK',
    material: 'Dark Walnut Wood',
    date: '2025',
  },
  {
    id: 'proj-5',
    title: 'Industrial Loft Partition System',
    location: 'Berlin, Germany',
    material: 'Composite Fiber',
    date: '2025',
  },
  {
    id: 'proj-6',
    title: 'Coastal Anti-Corrosive Enclosure',
    location: 'Miami, USA',
    material: 'FRP Polymer',
    date: '2025',
  },
]

export interface ProjectCardProps {
  project: ProjectInstallation
  onCardClick?: (project: ProjectInstallation) => void
}

/**
 * Reusable ProjectCard Component
 * Top half: 16:9 aspect ratio image container.
 * Bottom half: Title, location, and pill-shaped material badge.
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onCardClick,
}) => {
  return (
    <div
      onClick={() => onCardClick && onCardClick(project)}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Top Half: 16:9 Image Placeholder Container */}
      <div className="relative aspect-video bg-slate-200 object-cover rounded-t-2xl overflow-hidden flex items-center justify-center">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400 group-hover:bg-slate-200/80 transition-colors p-4">
            <ImageIcon className="w-10 h-10 mb-2 opacity-50 group-hover:scale-110 group-hover:opacity-80 transition-all" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              16:9 Installation Render
            </span>
          </div>
        )}

        {/* Hover Overlay Icon */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-white/80 backdrop-blur-md shadow-sm text-slate-700">
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>

      {/* Bottom Half: Title, Location & Pill Badge */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Project Title */}
          <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{project.location}</span>
          </div>
        </div>

        {/* Bottom Pill Badge for Primary Material */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="inline-block bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 text-xs font-medium">
            {project.material}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {project.date}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * PastWorkGallery - Showcase of Past Installations
 * Responsive CSS Grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6).
 */
export const PastWorkGallery: React.FC = () => {
  return (
    <section className="mb-8">
      {/* Section Title */}
      <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
        Our Past Installations
      </h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PAST_INSTALLATIONS.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onCardClick={(p) => alert(`Viewing details for "${p.title}"`)}
          />
        ))}
      </div>
    </section>
  )
}

export default PastWorkGallery
