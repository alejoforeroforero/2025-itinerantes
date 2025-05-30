import { create } from 'zustand'

type ShippingType = 'bogota' | 'nacional'

interface ShippingState {
  shippingType: ShippingType
  setShippingType: (type: ShippingType) => void
  getShippingCost: () => number
}

export const useShippingStore = create<ShippingState>((set, get) => ({
  shippingType: 'bogota',
  setShippingType: (type) => set({ shippingType: type }),
  getShippingCost: () => {
    const { shippingType } = get()
    return shippingType === 'bogota' ? 12000 : 15000
  }
})) 