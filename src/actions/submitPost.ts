"use server"

import { createClient } from "@/utils/supabase/server"
import { uploadFile } from "@/utils/uploadFile"
import { isError } from "@/types/Error"
import { deleteDraft } from "@/actions/deleteDraft"

export async function submitPost(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title")
  const content = formData.get("content")
  const difficulty = formData.get("difficulty")
  const productImage = formData.get("productImage") as Blob
  const supabaseClient = await createClient()

  // Delete draft entry.
  deleteDraft(id)

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
    difficulty,
    creatorID: user?.id,
  })

  if (error) {
    return {
      status: error.code,
      message: error.message,
    }
  }
}
