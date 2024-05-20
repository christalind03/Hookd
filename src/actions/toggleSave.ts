"use server"

import { createClient } from "@/utils/supabase/server"

export async function toggleSave(
  userID: string,
  postID: string,
  isFavorite: boolean
) {
  const supabaseClient = await createClient()

  if (isFavorite) {
    const { data, error } = await supabaseClient
      .from("savedPosts")
      .delete()
      .match({
        userID,
        postID,
      })
  } else {
    const { data, error } = await supabaseClient.from("savedPosts").insert({
      userID,
      postID,
    })
  }
}
