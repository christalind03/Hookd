"use server"

import { createClient } from "@/utils/supabase/server"

type FormData = {
  title: string
  description: string
  notes: string
}

export async function submitPost(formData: FormData) {
  const supabaseClient = await createClient()

  const { data, error } = await supabaseClient.from("post").insert({
    ...formData,
  })

  if (error) {
    return {
      status: error.code,
      message: error.message,
    }
  }

  return null
}
