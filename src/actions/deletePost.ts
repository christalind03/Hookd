"use server"

import { createClient } from "@/utils/supabase/server"

export async function deletePost(id: string) {
  const supabaseClient = await createClient()

  await supabaseClient.storage
    .from("post")
    .remove([`${id}`])
  
  await supabaseClient
    .from("post")
    .delete()
    .match({
      id,
    })
}