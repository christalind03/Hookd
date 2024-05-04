"use client"

import { InfiniteFeed } from "@/components/InfiniteFeed"
import { useUser } from "@/components/UserProvider"
import { supabaseClient } from "@/utils/supabase/client"

export default function Home() {
  const supabaseUser = useUser()

  async function fetchPosts(offset: number, pageCount: number) {
    const from = offset * pageCount
    const to = from + pageCount - 1

    const { data, error } = await supabaseClient
      .from("posts")
      .select("*")
      .range(from, to)
      .order("creationTimestamp", { ascending: false })

    return data ? data : []
  }

  return (
    <InfiniteFeed
      userID={supabaseUser?.id}
      fetchPosts={(offset, pageCount) => fetchPosts(offset, pageCount)}
    />
  )
}
