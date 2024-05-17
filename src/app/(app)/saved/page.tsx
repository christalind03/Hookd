"use client"

import { InfiniteFeed } from "@/components/Feed/InfiniteFeed"
import { useUser } from "@/components/UserProvider"
import { supabaseClient } from "@/utils/supabase/client"

export default function Saved() {
  const supabaseUser = useUser()

  async function fetchPosts(offset: number, pageCount: number) {
    const from = offset * pageCount
    const to = from + pageCount - 1

    const { data, error } = await supabaseClient
      .from("savedPost")
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
        userID={supabaseUser?.id}
  
        // @ts-ignore
        // The 'fetchPosts' function has a one-to-one relationship using a composite key of users and posts.
        // Since it has the *opportunity* to have a one-to-many relationship, just ignore the Typescript error.
        fetchPosts={(offset, pageCount) => fetchPosts(offset, pageCount)}
      />
    </div>
  )
}
