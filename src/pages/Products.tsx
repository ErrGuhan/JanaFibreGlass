import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sliders, ShieldCheck, Check } from 'lucide-react'

export interface ProductItem {
  id: string
  name: string
  description: string
  badge: string
  colorHex: string
  specs: string[]
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'solid-core',
    name: 'FRP Solid Core Entrance Door',
    description: 'Heavy-duty solid composite core with premium woodgrain finish. Superior acoustic dampening and high security.',
    badge: 'Best Seller',
    colorHex: '#d4a373',
    specs: ['Solid FRP Core', 'Waterproof', 'Woodgrain Finish'],
  },
  {
    id: 'parametric-frame',
    name: 'Parametric Door & Frame Assembly',
    description: 'Fully customizable door and frame set engineered to fit irregular or non-standard wall openings seamlessly.',
    badge: 'Custom Sized',
    colorHex: '#3f2e21',
    specs: ['Custom Dimensions', 'Integrated Frame', 'High Precision'],
  },
  {
    id: 'industrial-weatherproof',
    name: 'Industrial Weatherproof FRP Door',
    description: 'Designed for high-traffic chemical plants, hospitals, and coastal environments. Maximum corrosion resistance.',
    badge: 'Industrial Grade',
    colorHex: '#18181b',
    specs: ['Chemical Resistant', 'Zero Rust', 'Heavy Duty'],
  },
  {
    id: 'modern-pearl-white',
    name: 'Pearl White Modern Composite Door',
    description: 'Sleek architectural minimalist door with smooth UV-stable pearl finish. Ideal for modern apartments & offices.',
    badge: 'Modern',
    colorHex: '#f8fafc',
    specs: ['UV Stable', 'Smooth Finish', 'Minimalist Design'],
  },
  {
    id: 'marine-ocean-blue',
    name: 'Marine Ocean Blue Utility Door',
    description: 'Vibrant composite door designed for wet areas, bathrooms, coastal villas, and high-moisture rooms.',
    badge: 'Moisture Proof',
    colorHex: '#0284c7',
    specs: ['100% Moisture Proof', 'Vibrant Shade', 'Easy Clean'],
  },
  {
    id: 'emerald-composite',
    name: 'Emerald Composite Designer Door',
    description: 'Premium architectural green composite door featuring reinforced structural ribs and sound dampening core.',
    badge: 'Architectural',
    colorHex: '#059669',
    specs: ['Reinforced Ribs', 'Sound Proof', 'Designer Shade'],
  },
]

export const ProductCard: React.FC<{ product: ProductItem }> = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Visual Header / Banner */}
        <div
          className="h-44 w-full relative p-4 flex flex-col justify-between"
          style={{ backgroundColor: product.colorHex === '#f8fafc' ? '#e2e8f0' : product.colorHex }}
        >
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
              {product.badge}
            </span>
            <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="bg-black/40 backdrop-blur-md p-2.5 rounded-xl border border-white/20 text-white">
            <span className="text-[11px] font-bold block">{product.name}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3 text-left">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {product.description}
          </p>

          <div className="pt-2 flex flex-wrap gap-1.5">
            {product.specs.map((spec) => (
              <span
                key={spec}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600"
              >
                <Check className="w-3 h-3 text-emerald-600" />
                <span>{spec}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer Link */}
      <div className="p-5 pt-0">
        <Link
          to="/studio"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors pt-3 border-t border-gray-100 w-full justify-between"
        >
          <span>Customize in 3D</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}

export const Products: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Page Header */}
      <div className="text-left space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
          <Sliders className="w-3.5 h-3.5" />
          <span>Product Catalog</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          FRP Composite Door Collection
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Browse our range of waterproof, custom-engineered doors. Select any product to customize its dimensions and finishes in real-time inside the 3D Studio.
        </p>
      </div>

      {/* 3-Column Responsive Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Products
