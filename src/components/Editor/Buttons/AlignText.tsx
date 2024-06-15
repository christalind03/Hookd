"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
} from "@radix-ui/react-icons"

type Props = {
  value: string
  onChange: (newValue: string) => void
}

const textAlignments = [
  {
    type: "left",
    icon: <TextAlignLeftIcon className="size-4" />,
  },
  {
    type: "center",
    icon: <TextAlignCenterIcon className="size-4" />,
  },
  {
    type: "right",
    icon: <TextAlignRightIcon className="size-4" />,
  },
  {
    type: "justify",
    icon: <TextAlignJustifyIcon className="size-4" />,
  },
]

export function AlignText({ value, onChange }: Props) {
  return (
    <Popover>
      <PopoverContent className="flex items-center justify-between p-1 w-[150px]">
        {textAlignments.map((textAlignment) => (
          <div
            key={textAlignment.type}
            className="hover:bg-accent p-2 rounded"
            onClick={() => onChange(textAlignment.type)}
          >
            {textAlignment.icon}
          </div>
        ))}
      </PopoverContent>

      <PopoverTrigger>
        <div className="px-2">
          {
            textAlignments.find((textAlignment) => textAlignment.type === value)
              ?.icon
          }
        </div>
      </PopoverTrigger>
    </Popover>
  )
}
