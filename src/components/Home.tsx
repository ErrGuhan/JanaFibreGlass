import React from 'react'
import { HeroBanner } from './HeroBanner'
import { ProductCategories } from './ProductCategories'
import { PastWorkGallery } from './PastWorkGallery'

export interface HomeProps {
  onOpenConfigurator?: () => void
  onSelectCategory?: (id: string) => void
}

/**
 * Home - Main Dashboard Home View
 * Stacks HeroBanner, ProductCategories, and PastWorkGallery vertically.
 */
export const Home: React.FC<HomeProps> = ({
  onOpenConfigurator,
  onSelectCategory,
}) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 1. Hero Banner */}
      <HeroBanner onOpenConfigurator={onOpenConfigurator} />

      {/* 2. Product Categories (Base Model Selector) */}
      <ProductCategories onSelectCategory={onSelectCategory} />

      {/* 3. Past Work Showcase Gallery */}
      <PastWorkGallery />
    </div>
  )
}

export default Home
