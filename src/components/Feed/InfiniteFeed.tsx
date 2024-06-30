"use client"

// Business Logic
import { type Post } from "@/types/Post"
import debounce from "lodash.debounce"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useUser } from "@/components/UserProvider"

// UI Components
import { PostPreview } from "@/components/App/Post/PostPreview"
import { Separator } from "@/components/ui/Separator"

type Props = {
  refreshToken: number
  filterPosts: (limit: number, offset: number) => Promise<Post[]>
}

export function InfiniteFeed({ refreshToken, filterPosts }: Props) {
  const [offset, setOffset] = useState<number>(0)
  const [loadedPosts, setLoadedPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const feedContainer = useRef<HTMLDivElement>(null)
  const supabaseUser = useUser()

  const debounceScroll = useMemo(() =>
    debounce(() => {
      if (feedContainer.current && typeof window !== "undefined") {
        const { bottom } = feedContainer.current.getBoundingClientRect()
        const { innerHeight } = window

        setIsVisible((prevState) => bottom <= innerHeight)
      }
    }, 250),
    []
  )

  const loadPosts = useCallback((refreshPosts: boolean) => {
    return new Promise(async () => {
      setIsLoading(true)
      setOffset((prevState) => 
        refreshPosts ? 0 : prevState + 1
      )

      const newPosts = await filterPosts(25, offset)

      setLoadedPosts((prevState) =>
        refreshPosts ? newPosts : [...prevState, ...newPosts]
      )
      
      setIsLoading(false)
    })
  }, [filterPosts, offset])

  useEffect(() => {
    loadPosts(true)
    window.addEventListener("scroll", debounceScroll)

    return () => window.removeEventListener("scroll", debounceScroll)
  }, [debounceScroll, refreshToken, loadPosts])

  useEffect(() => {
    if (isVisible) {
      loadPosts(false)
    }
  }, [isVisible, loadPosts])

  return (
    <div
      className="flex flex-col gap-3 items-center justify-center"
      ref={feedContainer}
    >
      {loadedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center m-5">
          <h3 className="font-extrabold m-5 text-3xl">Uh oh!</h3>
          <p className="text-center text-pretty">We couldn&apos;t find any results matching your search.</p>
          <p className="mt-3 text-center text-pretty">Try searching for something else.</p>
        </div>
      ) : (
        loadedPosts.map((postData, postIndex) => (
          <div className="space-y-3 w-full" key={postIndex}>
            {!!postIndex && <Separator />}
            <PostPreview postData={postData} userID={supabaseUser?.id || ""} />
          </div>
        ))
      )}
    </div>
  )
}
