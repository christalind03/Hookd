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

export async function filterSavedPosts(
  userID: string,
  queryLimit: number,
  queryOffset: number,
  projectDifficulties?: string[],
  projectTypes?: string[]
) {
  const supabaseClient = await createClient()

  const { data , error } = await supabaseClient.rpc("filterSavedPosts", {
    userID,
    queryLimit,
    queryOffset,
    projectDifficulties,
    projectTypes,
  })

  return data ? data : []
}