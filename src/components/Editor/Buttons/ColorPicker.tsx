"use client"

import { Input } from "@/components/ui/Input"
import { OpacityIcon } from "@radix-ui/react-icons"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"

type Props = {
  value: string
  onChange: (newColor: string) => void
}

const defaultColors = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#a855f7", // Purple
  "#000000", // Black
]

export function ColorPicker({ value, onChange }: Props) {
  return (
    <Popover>
      <PopoverContent align="end" className="p-3 space-y-3 w-60">
        <div className="flex items-center justify-between">
          {defaultColors.map((currentColor) => (
            <div
              key={currentColor}
              className="cursor-pointer rounded size-6"
              style={{ background: currentColor }}
              onClick={() => onChange(currentColor)}
            />
          ))}
        </div>

        <Input
          placeholder={value}
          onBlur={(event) => {
            if (event.target.value) {
              onChange(event.target.value)
            }
          }}
        />
      </PopoverContent>

      <PopoverTrigger asChild>
        <div className="px-2">
          <OpacityIcon className="size-4" style={{ color: value }} />
        </div>
      </PopoverTrigger>
    </Popover>
  )
}
