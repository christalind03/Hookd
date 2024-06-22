"use client"

// Business Logic
import { filterPosts } from "@/actions/filterPosts"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// UI Components
import { FilterBar } from "@/components/Feed/FilterBar"
import { Fragment } from "react"
import { InfiniteFeed } from "@/components/Feed/InfiniteFeed"

export function Results() {
  const appRouter = useRouter()
  const searchParams = useSearchParams()
  const [refreshToken, setRefreshToken] = useState<number>(0)

  const parsedParams = {
    projectDifficulty: searchParams.get("projectDifficulty")?.split("|"),
    projectType: searchParams.get("projectType")?.split("|"),
    searchQuery: searchParams.get("searchQuery"),
  }

  useEffect(() => {
    setRefreshToken(Math.random())
  }, [searchParams.toString()])

  return (
    <Fragment>
      <FilterBar
        appRouter={appRouter}
        rootDirectory="results"
        selectedDifficulties={parsedParams.projectDifficulty}
        selectedTypes={parsedParams.projectType}
      />

      <InfiniteFeed
        refreshToken={refreshToken}
        filterPosts={(limit, offset) =>
          filterPosts(
            limit,
            offset * limit,
            parsedParams.projectDifficulty,
            parsedParams.projectType,
            parsedParams.searchQuery?.replaceAll(" ", "+"),
          )
        }
      />
    </Fragment>
  )
}
