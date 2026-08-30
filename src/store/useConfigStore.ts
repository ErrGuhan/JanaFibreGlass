import { create } from 'zustand'

export type ProductType = 'tank' | 'dome' | 'pipe' | 'enclosure' | 'door'
export type MaterialFinish = 'glossy' | 'matte' | 'translucent' | 'metallic' | 'carbon'
export type EnvPreset = 'city' | 'studio' | 'sunset' | 'forest' | 'apartment'
export type AnimationMode = 'smooth' | 'instant'

export interface ColorOption {
  name: string
  hex: string
  category: string
}

export const PRESET_COLORS: ColorOption[] = [
  { name: 'Light Oak', hex: '#d4a373', category: 'Wood' },
  { name: 'Dark Walnut', hex: '#3f2e21', category: 'Wood' },
  { name: 'Matte Black', hex: '#18181b', category: 'Modern' },
  { name: 'Pearl White', hex: '#f8fafc', category: 'Modern' },
  { name: 'Marine Ocean Blue', hex: '#0284c7', category: 'Standard' },
  { name: 'Industrial Cyan', hex: '#06b6d4', category: 'Standard' },
  { name: 'Emerald Composite', hex: '#059669', category: 'Standard' },
  { name: 'Safety Signal Yellow', hex: '#eab308', category: 'Industrial' },
  { name: 'Stealth Carbon Slate', hex: '#334155', category: 'Dark' },
]

export const WALL_COLORS: ColorOption[] = [
  { name: 'Slate Gray', hex: '#334155', category: 'Neutral' },
  { name: 'Warm Charcoal', hex: '#1e293b', category: 'Dark' },
  { name: 'Architectural White', hex: '#e2e8f0', category: 'Light' },
  { name: 'Warm Beige', hex: '#d6c7b2', category: 'Warm' },
  { name: 'Concrete Gray', hex: '#64748b', category: 'Industrial' },
]

export interface DoorConfig {
  topWidth: number
  bottomWidth: number
  leftHeight: number
  rightHeight: number
  thickness: number
  doorColor: string
  openAngle: number // Default 90 degrees
  isDoorOpen: boolean // Default false
  animationMode: AnimationMode // Default 'smooth'
}

export interface ProductConfigState {
  productType: ProductType
  color: string
  colorName: string
  wallColor: string
  wallColorName: string
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
  setWallColor: (hex: string, name?: string) => void
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
  setIsDoorOpen: (isOpen: boolean) => void
  toggleDoorOpen: () => void
  setAnimationMode: (mode: AnimationMode) => void
  resetDefaults: () => void
}

const DEFAULT_STATE = {
  productType: 'door' as ProductType,
  color: '#d4a373',
  colorName: 'Light Oak',
  wallColor: '#334155',
  wallColorName: 'Slate Gray',
  finish: 'glossy' as MaterialFinish,
  roughness: 0.25,
  metalness: 0.08,
  clearcoat: 0.8,
  transmission: 0.0,
  opacity: 1.0,
  wireframe: false,
  autoRotate: false,
  rotationSpeed: 1.0,
  envPreset: 'city' as EnvPreset,
  showGrid: false,
  showDimensions: true,
  reinforcementRibs: true,
  flangeAccessory: true,
  dimensions: {
    height: 3.2,
    diameter: 2.2,
    thickness: 12,
  },
  doorConfig: {
    topWidth: 84.0,
    bottomWidth: 84.0,
    leftHeight: 210.0,
    rightHeight: 210.0,
    thickness: 4.5,
    doorColor: '#d4a373',
    openAngle: 90, // Default 90 degrees
    isDoorOpen: false, // Default closed
    animationMode: 'smooth' as AnimationMode,
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

  setWallColor: (wallColor, name) => {
    const found = WALL_COLORS.find((c) => c.hex.toLowerCase() === wallColor.toLowerCase())
    set({
      wallColor,
      wallColorName: name || (found ? found.name : 'Custom Wall Shade'),
    })
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
  setIsDoorOpen: (isDoorOpen) =>
    set((state) => ({
      doorConfig: { ...state.doorConfig, isDoorOpen },
    })),
  toggleDoorOpen: () =>
    set((state) => ({
      doorConfig: { ...state.doorConfig, isDoorOpen: !state.doorConfig.isDoorOpen },
    })),
  setAnimationMode: (animationMode) =>
    set((state) => ({
      doorConfig: { ...state.doorConfig, animationMode },
    })),
  resetDefaults: () => set(DEFAULT_STATE),
}))
