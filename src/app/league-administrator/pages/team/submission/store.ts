import { createSheetStore } from "@/lib/stores/useSheetStore"

export type PaymentSheetData = {
  id: string;
  description: string;
  amount_paid: number;
  payment_status: string;
}

export const usePaymentSheetStore = createSheetStore<PaymentSheetData>()