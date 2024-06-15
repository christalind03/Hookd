// Business Logic
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { projectDifficulties } from "@/constants/projectDifficulties"
import { projectTypes } from "@/constants/projectTypes"

// UI Components
import { Cross1Icon } from "@radix-ui/react-icons"
import { FilterOption } from "@/components/Feed/FilterOption"
import { Fragment } from "react"
import { Separator } from "@/components/ui/Separator"

type Props = {
  appRouter: AppRouterInstance
  selectedDifficulties: string[] | undefined
  selectedTypes: string[] | undefined
}

export function FilterBar({
  appRouter,
  selectedDifficulties,
  selectedTypes,
}: Props) {
  function updateURL() {
    const searchParams: string[] = []

    if (selectedDifficulties && 0 < selectedDifficulties.length) {
      searchParams.push(
        `projectDifficulty=${encodeURIComponent(
          selectedDifficulties.join("|")
        )}`
      )
    }

    if (selectedTypes && 0 < selectedTypes.length) {
      searchParams.push(
        `projectType=${encodeURIComponent(selectedTypes.join("|"))}`
      )
    }

    appRouter.push(`/home?${searchParams.join("&")}`)
  }

  return (
    <Fragment>
      <div className="flex h-5 items-center justify-between">
        <div className="flex gap-3 items-center">
          <FilterOption
            filterName="Project Difficulty"
            optionList={projectDifficulties}
            selectedOptions={selectedDifficulties || []}
            onSelect={(selectedOptions) => {
              selectedDifficulties = selectedOptions
              updateURL()
            }}
          />

          <FilterOption
            filterName="Project Type"
            optionList={projectTypes}
            selectedOptions={selectedTypes || []}
            onSelect={(selectedOptions) => {
              selectedTypes = selectedOptions
              updateURL()
            }}
          />
        </div>

        {(selectedDifficulties || selectedTypes) && (
          <div
            className="p-1 rounded-md hover:bg-accent"
            onClick={() => appRouter.push("/home")}
          >
            <Cross1Icon />
          </div>
        )}
      </div>

      <Separator />
    </Fragment>
  )
}
