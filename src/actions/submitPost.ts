"use server"

import { createClient } from "@/utils/supabase/server"
import { uploadFile } from "@/utils/uploadFile"
import { isError } from "@/types/Error"

export async function submitPost(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title")
  const content = formData.get("content")
  const productImage = formData.get("productImage") as Blob
  const supabaseClient = await createClient()

  // Update storage.posts bucket.
  const serverResponse = uploadFile("posts", id, productImage)

  if (isError(serverResponse)) {
    return serverResponse
  }

  // Update public.posts table.
  const {
    data: { user }
  } = await supabaseClient.auth.getUser()

  const { data, error } = await supabaseClient.from("posts").insert({
    id,
    title,
    content,
    hasImage: productImage instanceof File,
    creatorID: user?.id,
  })

  if (error) {
    return {
      status: error.code,
      message: error.message,
    }
  }
}
