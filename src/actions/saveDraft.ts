"use server"

import { createClient } from "@/utils/supabase/server"
import { uploadFile } from "@/utils/uploadFile"
import { isError } from "@/types/Error"

export async function saveDraft(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title")
  const content = formData.get("content")
  const difficulty = formData.get("difficulty")
  const productImage = formData.get("productImage") as Blob
  const supabaseClient = await createClient()

  // Update storage.drafts bucket.
  const serverResponse = uploadFile("draft", id, productImage)

  if (isError(serverResponse)) {
    return serverResponse
  }

  // Update public.drafts table.
  const { data, error } = await supabaseClient
    .from("draft")
    .select("*")
    .match({ id })
    .maybeSingle()

  if (data) {
    const { data, error } = await supabaseClient
      .from("draft")
      .update({
        title,
        content,
        difficulty: difficulty || "N/A",
        hasImage: productImage instanceof File,
        lastEdit: new Date().toISOString(),
      })
      .match({ id })
  } else {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    const { data, error } = await supabaseClient.from("draft").insert({
      id,
      title,
      content,
      difficulty: difficulty || "N/A",
      hasImage: productImage instanceof File,
      creatorID: user?.id,
      lastEdit: new Date().toISOString(),
    })
  }
}
