"use client"

import { FeedFilter } from "@/components/FeedFilter"
import { InfiniteFeed } from "@/components/InfiniteFeed"
import { useUser } from "@/components/UserProvider"
import { Separator } from "@/components/ui/Separator"
import { projectDifficulties } from "@/constants/projectDifficulties"
import { projectTypes } from "@/constants/projectTypes"
import { supabaseClient } from "@/utils/supabase/client"
import { Cross1Icon } from "@radix-ui/react-icons"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
  const router = useRouter()
  const supabaseUser = useUser()
  const searchParams = useSearchParams()
  const [refreshToken, setRefreshToken] = useState(0)

  const parsedParams = {
    projectDifficulty: searchParams.get("projectDifficulty")?.split("|"),
    projectType: searchParams.get("projectType")?.split("|"),
  }

  useEffect(() => {
    setRefreshToken(Math.random())
  }, [searchParams.toString()])

  async function fetchPosts(offset: number, limit: number) {
    const { data, error } = await supabaseClient.rpc("generate_feed", {
      query_offset: offset,
      query_limit: limit,
      project_difficulties: parsedParams.projectDifficulty,
      project_types: parsedParams.projectType
    })

    return data ? data : []
  }

  function updateURL() {
    const searchParams: string[] = []

    for (const [currentProperty, currentValue] of Object.entries(
      parsedParams
    )) {
      if (currentValue) {
        searchParams.push(
          `${encodeURIComponent(currentProperty)}=${encodeURIComponent(
            currentValue.join("|")
          )}`
        )
      }
    }

    router.replace(`/home?${searchParams.join("&")}`)
  }

  return (
    <div className="flex flex-col items-center justify-center m-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <FeedFilter
              filterName="Project Difficulty"
              optionList={projectDifficulties}
              selectedOptions={parsedParams.projectDifficulty || []}
              onSelect={(selectedOptions) => {
                parsedParams.projectDifficulty = selectedOptions
                updateURL()
              }}
            />

            <FeedFilter
              filterName="Project Type"
              optionList={projectTypes}
              selectedOptions={parsedParams.projectType || []}
              onSelect={(selectedOptions) => {
                parsedParams.projectType = selectedOptions
                updateURL()
              }}
            />
          </div>
        </div>

        <Separator className="w-full sm:w-[525px] md:w-[625px] lg:w-[750px]" />

        <InfiniteFeed
          userID={supabaseUser?.id}
          refreshToken={refreshToken}
          fetchPosts={(offset, pageCount) => fetchPosts(offset, pageCount)}
        />
      </div>
    </div>
  )
}
