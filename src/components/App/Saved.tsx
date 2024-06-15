"use client"

// Business Logic
import { supabaseClient } from "@/utils/supabase/client"
import { useUser } from "@/components/UserProvider"

// UI Components
import { InfiniteFeed } from "../Feed/InfiniteFeed"

export function Saved() {
  const supabaseUser = useUser()

  async function fetchPosts(limit: number, offset: number) {
    const from = limit * offset
    const to = from + limit - 1

    const { data, error } = await supabaseClient
      .from("savedPosts")
      .select("post(*)")
      .match({
        userID: supabaseUser?.id,
      })
      .range(from, to)
      .order("saveTimestamp", { ascending: false })

    return data ? data.map(({ post }) => post) : []
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="font-extrabold text-3xl">Saved Posts</h3>

      <InfiniteFeed
        // @ts-ignore
        // The 'fetchPosts' function has a one-to-one relationship using a composite key of users and posts.
        // Since it has the *opportunity* to have a one-to-many relationship, just ignore the Typescript error.
        fetchPosts={(offset, pageCount) => fetchPosts(offset, pageCount)}
      />
    </div>
  )
}
