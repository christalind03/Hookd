"use client"

// Business Logic
// ...

// UI Components
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command"
import { CaretDownIcon, CheckIcon } from "@radix-ui/react-icons"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"

type Props = {
  filterName: string
  optionList: string[]
  selectedOptions: string[]
  onSelect: (selectedOptions: string[]) => void
}

export function FilterOption({
  filterName,
  optionList,
  selectedOptions,
  onSelect,
}: Props) {
  return (
    <Popover>
      <PopoverContent align="start" className="p-0">
        <Command>
          <CommandInput placeholder="Search..." />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup>
              {optionList.map((currentOption) => {
                const isSelected = selectedOptions.includes(currentOption)

                return (
                  <CommandItem
                    key={currentOption}
                    className="flex items-center justify-between"
                    onSelect={() => {
                      isSelected
                        ? onSelect(
                            selectedOptions.filter(
                              (selectedOption) =>
                                selectedOption !== currentOption
                            )
                          )
                        : onSelect([...selectedOptions, currentOption])
                    }}
                  >
                    {currentOption}
                    {isSelected && <CheckIcon />}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>

      <PopoverTrigger asChild>
        <div className="flex gap-1 items-center justify-center text-xs">
          <p>{filterName}</p>
          <CaretDownIcon />
        </div>
      </PopoverTrigger>
    </Popover>
  )
}
