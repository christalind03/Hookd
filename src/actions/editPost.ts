"use server"

import { createClient } from "@/utils/supabase/server"
import { isError } from "@/types/Error"
import { uploadFile } from "@/utils/uploadFile"

export async function editPost(formData: FormData) {
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
  const { data, error } = await supabaseClient
    .from("posts")
    .update({
      title,
      content,
      hasImage: productImage instanceof File,
    })
    .match({
      id,
    })

  if (error) {
    return {
      status: error.code,
      message: error.message,
    }
  }
}
