"use client"

import debounce from "lodash.debounce"
import { useCallback, useEffect, useRef, useState } from "react"
import { type Post } from "@/types/Post"
import { PostPreview } from "@/components/PostPreview"
import { Separator } from "@/components/ui/Separator"

type Props = {
  userID?: string
  refreshToken: number
  fetchPosts: (offset: number, pageCount: number) => Promise<Post[]>
}

export function InfiniteFeed({ userID, refreshToken, fetchPosts }: Props) {
  const feedContainer = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [loadedPosts, setLoadedPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const debounceScroll = useCallback(
    debounce(() => {
      if (feedContainer.current && typeof window !== "undefined") {
        const { bottom } = feedContainer.current.getBoundingClientRect()
        const { innerHeight } = window

        setIsVisible((prevState) => bottom <= innerHeight)
      }
    }, 250),
    []
  )

  useEffect(() => {
    loadPosts(true)
    window.addEventListener("scroll", debounceScroll)

    return () => window.removeEventListener("scroll", debounceScroll)
  }, [refreshToken])

  useEffect(() => {
    if (isVisible) {
      loadPosts(false)
    }
  }, [isVisible])

  async function loadPosts(refreshPosts: boolean) {
    setIsLoading(true)
    setOffset((prevState) => (refreshPosts ? 0 : prevState + 1))

    const newPosts = await fetchPosts(offset, 25)

    setLoadedPosts((prevState) =>
      refreshPosts ? newPosts : [...prevState, ...newPosts]
    )

    setIsLoading(false)
  }

  return (
    <div
      className="flex flex-col gap-3 items-center justify-center"
      ref={feedContainer}
    >
      {loadedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center m-5">
          <h3 className="font-extrabold m-5 text-3xl">Uh oh!</h3>
          <p>We couldn't find any results matching your search.</p>
          <p>Try searching for something else.</p>
        </div>
      ) : (
        loadedPosts.map((postData, postIndex) => (
          <div
            className="space-y-3 w-full sm:w-[525px] md:w-[625px] lg:w-[750px]"
            key={postIndex}
          >
            {!!postIndex && <Separator />}
            <PostPreview postData={postData} userID={userID || ""} />
          </div>
        ))
      )}
    </div>
  )
}
