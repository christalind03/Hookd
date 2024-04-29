"use server"

import { createClient } from "@/utils/supabase/server"
import { uploadFile } from "@/utils/uploadFile"
import { isError } from "@/types/Error"

export async function saveDraft(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title")
  const content = formData.get("content")
  const productImage = formData.get("productImage") as Blob
  const supabaseClient = await createClient()

  // Update storage.drafts bucket.
  const serverResponse = uploadFile("drafts", id, productImage)

  if (isError(serverResponse)) {
    return serverResponse
  }

  // Update public.drafts table.
  const { data, error } = await supabaseClient
    .from("drafts")
    .select("*")
    .match({ id })
    .maybeSingle()

  if (data) {
    const { data, error } = await supabaseClient
      .from("drafts")
      .update({
        title,
        content,
        hasImage: productImage instanceof File,
        lastEdit: new Date().toISOString(),
      })
      .match({ id })
  } else {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    const { data, error } = await supabaseClient.from("drafts").insert({
      id,
      title,
      content,
      hasImage: productImage instanceof File,
      creatorID: user?.id,
      lastEdit: new Date().toISOString(),
    })
  }
}
