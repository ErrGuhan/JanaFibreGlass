import { create } from 'zustand'

export interface AdminDoorConfig {
  topWidth: number
  bottomWidth: number
  leftHeight: number
  rightHeight: number
  thickness: number
  colorName: string
  colorHex: string
}

export interface AdminCustomerCRM {
  customerName: string
  customerPhone: string
  address: string
  city: string
  notes: string
}

export interface AdminStoreState {
  doorConfig: AdminDoorConfig
  customerCRM: AdminCustomerCRM
  setDoorConfig: (config: Partial<AdminDoorConfig>) => void
  setCustomerCRM: (crm: Partial<AdminCustomerCRM>) => void
  resetPOS: () => void
}

const DEFAULT_ADMIN_DOOR: AdminDoorConfig = {
  topWidth: 84.0,
  bottomWidth: 84.0,
  leftHeight: 210.0,
  rightHeight: 210.0,
  thickness: 4.5,
  colorName: 'Light Oak',
  colorHex: '#d4a373',
}

const DEFAULT_ADMIN_CRM: AdminCustomerCRM = {
  customerName: '',
  customerPhone: '',
  address: '',
  city: '',
  notes: '',
}

export const useAdminStore = create<AdminStoreState>((set) => ({
  doorConfig: { ...DEFAULT_ADMIN_DOOR },
  customerCRM: { ...DEFAULT_ADMIN_CRM },

  setDoorConfig: (newConfig) =>
    set((state) => ({
      doorConfig: { ...state.doorConfig, ...newConfig },
    })),

  setCustomerCRM: (newCRM) =>
    set((state) => ({
      customerCRM: { ...state.customerCRM, ...newCRM },
    })),

  resetPOS: () =>
    set({
      doorConfig: { ...DEFAULT_ADMIN_DOOR },
      customerCRM: { ...DEFAULT_ADMIN_CRM },
    }),
}))

export default useAdminStore
