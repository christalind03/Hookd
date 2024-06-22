"use client"

// Business Logic
import { filterSavedPosts } from "@/actions/filterPosts"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser } from "@/components/UserProvider"

// UI Components
import { FilterBar } from "@/components/Feed/FilterBar"
import { InfiniteFeed } from "@/components/Feed/InfiniteFeed"

export function Saved() {
  const appRouter = useRouter()
  const supabaseUser = useUser()
  const searchParams = useSearchParams()
  const [refreshToken, setRefreshToken] = useState<number>(0)

  const parsedParams = {
    projectDifficulty: searchParams.get("projectDifficulty")?.split("|"),
    projectType: searchParams.get("projectType")?.split("|"),
  }

  useEffect(() => {
    setRefreshToken(Math.random())
  }, [searchParams.toString()])

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-extrabold mx-auto text-3xl">Saved Posts</h3>
      
      <FilterBar
        appRouter={appRouter}
        rootDirectory="saved"
        selectedDifficulties={parsedParams.projectDifficulty}
        selectedTypes={parsedParams.projectType}
      />

      <InfiniteFeed
        refreshToken={refreshToken}
        // @ts-ignore
        // The 'fetchPosts' function has a one-to-one relationship using a composite key of users and posts.
        // Since it has the *opportunity* to have a one-to-many relationship, just ignore the Typescript error.
        filterPosts={(limit, offset) =>
          filterSavedPosts(
            supabaseUser?.id!,
            limit,
            offset * limit,
            parsedParams.projectDifficulty,
            parsedParams.projectType
          )
        }
      />
    </div>
  )
}
