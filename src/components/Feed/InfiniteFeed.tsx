"use client"

// Business Logic
import { type Post } from "@/types/Post"
import debounce from "lodash.debounce"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useUser } from "@/components/UserProvider"

// UI Components
import { Loading } from "@/components/Loading"
import { PostPreview } from "@/components/App/Post/PostPreview"
import { Separator } from "@/components/ui/Separator"

type Props = {
  refreshToken: number
  filterPosts: (limit: number, offset: number) => Promise<Post[]>
}

export function InfiniteFeed({ refreshToken, filterPosts }: Props) {
  const offsetRef = useRef<number>(0)
  const isLoading = useRef<boolean>(true)
  const [loadedPosts, setLoadedPosts] = useState<Post[]>([])
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const feedContainer = useRef<HTMLDivElement>(null)
  const supabaseUser = useUser()

  const debounceScroll = useMemo(
    () =>
      debounce(() => {
        if (feedContainer.current && typeof window !== "undefined") {
          const { bottom } = feedContainer.current.getBoundingClientRect()
          const { innerHeight } = window

          setIsVisible((prevState) => bottom <= innerHeight)
        }
      }, 250),
    []
  )

  const loadPosts = useCallback(
    async (refreshPosts: boolean) => {
      if (refreshPosts) {
        offsetRef.current = 0
      } else {
        offsetRef.current += 1
      }

      const newPosts = await filterPosts(3, offsetRef.current)

      setLoadedPosts((prevState) => {
        if (refreshPosts) {
          return newPosts
        }

        return [...prevState, ...newPosts]
      })

      if (isLoading.current) {
        isLoading.current = false
      }
    },
    [filterPosts]
  )

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
      {isLoading.current ? (
        <div className="mt-5">
          <Loading />
        </div>
      ) : loadedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center m-5">
          <h3 className="font-extrabold m-5 text-3xl">Uh oh!</h3>
          <p className="text-center text-pretty">
            We couldn&apos;t find any results matching your search.
          </p>
          <p className="mt-3 text-center text-pretty">
            Try searching for something else.
          </p>
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
