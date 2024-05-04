"use client"

import debounce from "lodash.debounce"
import { useCallback, useEffect, useRef, useState } from "react"
import { type Post } from "@/types/Post"
import { PostPreview } from "@/components/PostPreview"
import { Separator } from "@/components/ui/Separator"

type Props = {
  userID?: string
  fetchPosts: (offset: number, pageCount: number) => Promise<Post[]>
}

const PAGE_COUNT = 25

export function InfiniteFeed({ userID, fetchPosts }: Props) {
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
    loadPosts()
    window.addEventListener("scroll", debounceScroll)

    return () => window.removeEventListener("scroll", debounceScroll)
  }, [])

  useEffect(() => {
    if (isVisible) {
      loadPosts()
    }
  }, [isVisible])

  async function loadPosts() {
    setIsLoading(true)
    setOffset((prevState) => prevState + 1)

    const newPosts = await fetchPosts(offset, PAGE_COUNT)
    setLoadedPosts((prevState) => [...prevState, ...newPosts])

    setIsLoading(false)
  }

  return (
    <div
      className="flex flex-col gap-5 items-center justify-center m-5"
      ref={feedContainer}
    >
      {loadedPosts.map((postData, postIndex) => (
        <div
          className="space-y-5 w-full sm:w-[525px] md:w-[625px] lg:w-[750px]"
          key={postIndex}
        >
          {!!postIndex && <Separator />}
          <PostPreview postData={postData} userID={userID || ""} />
        </div>
      ))}
    </div>
  )
}
