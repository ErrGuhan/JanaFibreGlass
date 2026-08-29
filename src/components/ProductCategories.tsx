import React from 'react'
import {
  Trees,
  Maximize,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

export interface CategoryOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
}

export interface ProductCategoriesProps {
  onSelectCategory?: (id: string) => void
}

/**
 * ProductCategories - Base Model Selector Section
 * Displays category cards with glassmorphic aesthetic, hover scale effects,
 * door icons, titles, and subtle "Customize ->" links in blue.
 */
export const ProductCategories: React.FC<ProductCategoriesProps> = ({
  onSelectCategory,
}) => {
  const categories: CategoryOption[] = [
    {
      id: 'solid-wood',
      title: 'Solid Wood Core',
      description: 'Premium natural hardwood timber with acoustic insulation.',
      icon: <Trees className="w-6 h-6" />,
      iconBg: 'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-700',
    },
    {
      id: 'glass-panel',
      title: 'Glass Panel Portal',
      description: 'Tempered double-glazed architectural glass inserts.',
      icon: <Maximize className="w-6 h-6" />,
      iconBg: 'bg-sky-50 border-sky-200',
      iconColor: 'text-sky-600',
    },
    {
      id: 'steel-reinforced',
      title: 'Steel Reinforced',
      description: 'Heavy-duty armored perimeter frame for high security.',
      icon: <ShieldCheck className="w-6 h-6" />,
      iconBg: 'bg-slate-100 border-slate-200',
      iconColor: 'text-slate-700',
    },
    {
      id: 'fiberglass-composite',
      title: 'Fiberglass Composite',
      description: '100% anti-corrosive FRP resin engineered for longevity.',
      icon: <Sparkles className="w-6 h-6" />,
      iconBg: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
    },
  ]

  return (
    <section className="mb-12">
      {/* Section Title */}
      <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
        Select a Base Model
      </h2>

      {/* Responsive Horizontal Flexbox/Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => {
              if (onSelectCategory) onSelectCategory(cat.id)
              else alert(`Selected base model: ${cat.title}`)
            }}
            className="group bg-white shadow-sm rounded-xl border border-gray-100 p-5 flex flex-col justify-between hover:scale-105 hover:shadow-md hover:border-gray-200 transition-all duration-300 cursor-pointer"
          >
            <div>
              {/* Door Type Icon */}
              <div
                className={`w-12 h-12 rounded-xl border ${cat.iconBg} ${cat.iconColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
              >
                {cat.icon}
              </div>

              {/* Strong Title */}
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
                {cat.title}
              </h3>

              {/* Sub-description */}
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {cat.description}
              </p>
            </div>

            {/* Subtle "Customize ->" Link in Blue */}
            <div className="pt-2 border-t border-gray-50 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">
              <span>Customize</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProductCategories
