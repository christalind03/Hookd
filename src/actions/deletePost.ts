"use server"

import { createClient } from "@/utils/supabase/server"

export async function deletePost(id: string) {
  const supabaseClient = await createClient()

  const { error } = await supabaseClient
    .from("post")
    .delete()
    .match({
      id,
    })

  console.log(id)
  console.log("Delete Error: ", error)
}