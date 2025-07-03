// components/ui/location-input.tsx
"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface LocationSelectorProps {
    value?: string
    onChange?: (value: string) => void
    label?: string
    placeholder?: string
    options?: string[]
}

const defaultOptions = [
    "Cebu City",
    "Mandaue",
    "Lapu-Lapu",
    "Danao",
    "Bogo",
    "Toledo",
    "Carcar",
    "Tabogon"
]

export default function LocationSelector({
    value,
    onChange,
    label = "Location",
    placeholder = "Select a location...",
    options = defaultOptions
}: LocationSelectorProps) {
    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                            {loc}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
