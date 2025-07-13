// components/sheet.tsx
"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { usePaymentSheetStore } from "./store"

export function PaymentSheet() {
  const { open, data, closeSheet } = usePaymentSheetStore()
  return (
    <Sheet open={open} onOpenChange={closeSheet}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Set Manual Payment</SheetTitle>
          <SheetDescription>
            {data?.description || "No description provided."}
          </SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" defaultValue="0" />
          </div>
        </div>

        <SheetFooter>
          <Button type="submit">Submit</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
