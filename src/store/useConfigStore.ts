import { create } from 'zustand'

export type ProductType = 'tank' | 'dome' | 'pipe' | 'enclosure' | 'door'
export type MaterialFinish = 'glossy' | 'matte' | 'translucent' | 'metallic' | 'carbon'
export type EnvPreset = 'city' | 'studio' | 'sunset' | 'forest' | 'apartment'

export interface ColorOption {
  name: string
  hex: string
  category: string
}

export const PRESET_COLORS: ColorOption[] = [
  { name: 'Marine Ocean Blue', hex: '#0284c7', category: 'Standard' },
  { name: 'Industrial Cyan', hex: '#06b6d4', category: 'Standard' },
  { name: 'Emerald Composite', hex: '#059669', category: 'Standard' },
  { name: 'Safety Signal Yellow', hex: '#eab308', category: 'Industrial' },
  { name: 'Solaris Flame Orange', hex: '#ea580c', category: 'Industrial' },
  { name: 'Signal Hazard Red', hex: '#dc2626', category: 'Industrial' },
  { name: 'Cleanroom Arctic White', hex: '#f8fafc', category: 'Pure' },
  { name: 'Stealth Carbon Slate', hex: '#334155', category: 'Dark' },
  { name: 'Midnight Onyx Black', hex: '#0f172a', category: 'Dark' },
  { name: 'Refined Amber Resin', hex: '#d97706', category: 'Resin' },
]

export interface DoorConfig {
  topWidth: number
  bottomWidth: number
  leftHeight: number
  rightHeight: number
  thickness: number
  doorColor: string
  openAngle: number
}

export interface ProductConfigState {
  productType: ProductType
  color: string
  colorName: string
  finish: MaterialFinish
  roughness: number
  metalness: number
  clearcoat: number
  transmission: number
  opacity: number
  wireframe: boolean
  autoRotate: boolean
  rotationSpeed: number
  envPreset: EnvPreset
  showGrid: boolean
  showDimensions: boolean
  reinforcementRibs: boolean
  flangeAccessory: boolean
  dimensions: {
    height: number
    diameter: number
    thickness: number
  }
  doorConfig: DoorConfig
  
  // Actions
  setProductType: (type: ProductType) => void
  setColor: (hex: string, name?: string) => void
  setFinish: (finish: MaterialFinish) => void
  setRoughness: (roughness: number) => void
  setMetalness: (metalness: number) => void
  setClearcoat: (clearcoat: number) => void
  setTransmission: (transmission: number) => void
  setWireframe: (wireframe: boolean) => void
  setAutoRotate: (autoRotate: boolean) => void
  setRotationSpeed: (speed: number) => void
  setEnvPreset: (preset: EnvPreset) => void
  setShowGrid: (show: boolean) => void
  setShowDimensions: (show: boolean) => void
  setReinforcementRibs: (ribs: boolean) => void
  setFlangeAccessory: (flange: boolean) => void
  setDimensions: (dims: Partial<{ height: number; diameter: number; thickness: number }>) => void
  setDoorConfig: (config: Partial<DoorConfig>) => void
  resetDefaults: () => void
}

const DEFAULT_STATE = {
  productType: 'door' as ProductType,
  color: '#0284c7',
  colorName: 'Marine Ocean Blue',
  finish: 'glossy' as MaterialFinish,
  roughness: 0.15,
  metalness: 0.05,
  clearcoat: 0.9,
  transmission: 0.0,
  opacity: 1.0,
  wireframe: false,
  autoRotate: false,
  rotationSpeed: 1.0,
  envPreset: 'city' as EnvPreset,
  showGrid: true,
  showDimensions: true,
  reinforcementRibs: true,
  flangeAccessory: true,
  dimensions: {
    height: 3.2,
    diameter: 2.2,
    thickness: 12, // in mm
  },
  doorConfig: {
    topWidth: 90,
    bottomWidth: 90,
    leftHeight: 210,
    rightHeight: 210,
    thickness: 4.5,
    doorColor: '#0284c7',
    openAngle: 0,
  },
}

export const useConfigStore = create<ProductConfigState>((set) => ({
  ...DEFAULT_STATE,

  setProductType: (productType) => {
    set((state) => {
      let dims = state.dimensions
      if (productType === 'tank') dims = { height: 3.2, diameter: 2.2, thickness: 12 }
      if (productType === 'dome') dims = { height: 1.8, diameter: 3.6, thickness: 8 }
      if (productType === 'pipe') dims = { height: 4.5, diameter: 1.2, thickness: 15 }
      if (productType === 'enclosure') dims = { height: 2.4, diameter: 2.0, thickness: 10 }
      return { productType, dimensions: dims }
    })
  },

  setColor: (color, name) => {
    const found = PRESET_COLORS.find((c) => c.hex.toLowerCase() === color.toLowerCase())
    set((state) => ({
      color,
      colorName: name || (found ? found.name : 'Custom Shade'),
      doorConfig: { ...state.doorConfig, doorColor: color },
    }))
  },

  setFinish: (finish) => {
    if (finish === 'glossy') {
      set({ finish, roughness: 0.12, metalness: 0.05, clearcoat: 0.95, transmission: 0.0, opacity: 1.0 })
    } else if (finish === 'matte') {
      set({ finish, roughness: 0.75, metalness: 0.02, clearcoat: 0.0, transmission: 0.0, opacity: 1.0 })
    } else if (finish === 'translucent') {
      set({ finish, roughness: 0.25, metalness: 0.1, clearcoat: 0.8, transmission: 0.75, opacity: 0.85 })
    } else if (finish === 'metallic') {
      set({ finish, roughness: 0.25, metalness: 0.85, clearcoat: 0.7, transmission: 0.0, opacity: 1.0 })
    } else if (finish === 'carbon') {
      set({ finish, roughness: 0.35, metalness: 0.4, clearcoat: 0.6, transmission: 0.0, opacity: 1.0 })
    }
  },

  setRoughness: (roughness) => set({ roughness }),
  setMetalness: (metalness) => set({ metalness }),
  setClearcoat: (clearcoat) => set({ clearcoat }),
  setTransmission: (transmission) => set({ transmission }),
  setWireframe: (wireframe) => set({ wireframe }),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setRotationSpeed: (rotationSpeed) => set({ rotationSpeed }),
  setEnvPreset: (envPreset) => set({ envPreset }),
  setShowGrid: (showGrid) => set({ showGrid }),
  setShowDimensions: (showDimensions) => set({ showDimensions }),
  setReinforcementRibs: (reinforcementRibs) => set({ reinforcementRibs }),
  setFlangeAccessory: (flangeAccessory) => set({ flangeAccessory }),
  setDimensions: (dims) =>
    set((state) => ({ dimensions: { ...state.dimensions, ...dims } })),
  setDoorConfig: (config) =>
    set((state) => ({
      doorConfig: { ...state.doorConfig, ...config },
      color: config.doorColor ?? state.color,
    })),
  resetDefaults: () => set(DEFAULT_STATE),
}))
