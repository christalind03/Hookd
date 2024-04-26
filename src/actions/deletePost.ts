"use server"

import { createClient } from "@/utils/supabase/server"

export async function deletePost(id: string) {
  const supabaseClient = await createClient()

  await supabaseClient
    .from("posts")
    .delete()
    .match({
      id,
    })
}