"use server"

import { createClient } from "@/utils/supabase/server"
import { isError } from "@/types/Error"
import { uploadFile } from "@/utils/uploadFile"

export async function editPost(formData: FormData) {
  const postaData = JSON.parse(formData.get("postData") as string)
  const productImage = formData.get("productImage") as Blob
  const supabaseClient = await createClient()

  // Update storage.posts bucket.
  const serverResponse = uploadFile("post", postaData.id, productImage)

  if (isError(serverResponse)) {
    return serverResponse
  }

  // Update public.posts table.
  const { data, error } = await supabaseClient
    .from("post")
    .update({
      title: postaData.title,
      content: postaData.content,
      difficulty: postaData.difficulty,
      yarnWeight: postaData.yarnWeight,
    })
    .match({
      id: postaData.id,
    })

  if (error) {
    return {
      status: error.code,
      message: error.message,
    }
  }
}
