'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from '@/components/ui/command'
import { Command as CommandPrimitive } from 'cmdk'

export type MultiSelectOption = {
  value: string
  label: string
}

type MultiSelectProps = {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  maxSelected?: number
  heading?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  maxSelected = Infinity,
  heading
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  const selectedOptions = options.filter((opt) => value.includes(opt.value))
  const unselectedOptions = options.filter((opt) => !value.includes(opt.value))

  const handleUnselect = (val: string) => {
    onChange(value.filter((v) => v !== val))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && inputValue === '') {
      onChange(value.slice(0, -1))
    }
    if (e.key === 'Escape') {
      inputRef.current?.blur()
    }
  }

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((opt) => (
            <Badge key={opt.value} variant="secondary">
              {opt.label}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleUnselect(opt.value)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && unselectedOptions.length > 0 && value.length < maxSelected && (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto" heading={heading}>
                {unselectedOptions.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    onMouseDown={(e) => e.preventDefault()}
                    onSelect={() => {
                      onChange([...value, opt.value])
                      setInputValue('')
                    }}
                    className="cursor-pointer"
                  >
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          )}
        </CommandList>
      </div>
    </Command>
  )
}
