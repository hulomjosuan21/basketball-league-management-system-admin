import { create } from "zustand"

type SheetStore<T> = {
  open: boolean
  data: T | null
  openSheet: (data: T) => void
  closeSheet: () => void
}

export function createSheetStore<T>() {
  return create<SheetStore<T>>((set) => ({
    open: false,
    data: null,
    openSheet: (data) => set({ open: true, data }),
    closeSheet: () => set({ open: false, data: null }),
  }))
}
