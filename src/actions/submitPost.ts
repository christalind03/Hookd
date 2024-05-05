"use server"

import { createClient } from "@/utils/supabase/server"
import { uploadFile } from "@/utils/uploadFile"
import { isError } from "@/types/Error"
import { deleteDraft } from "@/actions/deleteDraft"

export async function submitPost(formData: FormData) {
  const postaData = JSON.parse(formData.get("postData") as string)
  const productImage = formData.get("productImage") as Blob
  const supabaseClient = await createClient()

  // Delete draft entry.
  deleteDraft(postaData.id)

  // Update storage.posts bucket.
  const serverResponse = uploadFile("post", postaData.id, productImage)

  if (isError(serverResponse)) {
    return serverResponse
  }

  // Update public.posts table.
  const {
    data: { user }
  } = await supabaseClient.auth.getUser()
  
  const { data, error } = await supabaseClient
    .from("post")
    .insert({
      id: postaData.id,
      title: postaData.title,
      content: postaData.content,
      difficulty: postaData.difficulty,
      yarnWeight: postaData.yarnWeight,
      creatorID: user?.id,
    })

  if (error) {
    return {
      status: error.code,
      message: error.message,
    }
  }
}
