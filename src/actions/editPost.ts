"use server"

import { createClient } from "@/utils/supabase/server"

type FormData = {
  title: string
  content: string
}

export async function editPost(postID: string, formData: FormData) {
  const supabaseClient = await createClient()

  const { data, error } = await supabaseClient
    .from("post")
    .update({
      ...formData,
    })
    .match({
      id: postID,
    })

  if (error) {
    return {
      status: error.code,
      message: error.message,
    }
  }
}
