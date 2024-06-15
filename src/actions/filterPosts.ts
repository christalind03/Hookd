"use server"

import { createClient } from "@/utils/supabase/server"

export async function filterPosts(
  queryLimit: number,
  queryOffset: number,
  projectDifficulties?: string[],
  projectTypes?: string[],
  searchQuery?: string,
  userID?: string
) {
  const supabaseClient = await createClient()

  const { data, error } = await supabaseClient.rpc("filterPosts", {
    queryLimit,
    queryOffset,
    projectDifficulties,
    projectTypes,
    searchQuery,
    userID,
  })

  return data ? data : []
}