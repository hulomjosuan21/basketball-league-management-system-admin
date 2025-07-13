import { createSheetStore } from "@/lib/stores/useSheetStore"

export type PaymentSheetData = {
  id: string
  description: string
}

export const usePaymentSheetStore = createSheetStore<PaymentSheetData>()