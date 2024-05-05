"use server"

import { createClient } from "@/utils/supabase/server"
import { uploadFile } from "@/utils/uploadFile"
import { isError } from "@/types/Error"

export async function saveDraft(formData: FormData) {
  const postData = JSON.parse(formData.get("postData") as string)
  const productImage = formData.get("productImage") as Blob
  const supabaseClient = await createClient()

  // Update storage.drafts bucket.
  const serverResponse = uploadFile("draft", postData.id, productImage)

  if (isError(serverResponse)) {
    return serverResponse
  }

  // Update public.drafts table.
  const { data, error } = await supabaseClient
    .from("draft")
    .select("*")
    .match({
      id: postData.id,
    })
    .maybeSingle()

  if (data) {
    const { data, error } = await supabaseClient
      .from("draft")
      .update({
        title: postData.title,
        content: postData.content,
        difficulty: postData.difficulty || "N/A",
        yarnWeight: postData.yarnWeight || "N/A",
        hasImage: productImage instanceof File,
        lastEdit: new Date().toISOString(),
      })
      .match({
        id: postData.id,
      })
  } else {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    const { data, error } = await supabaseClient.from("draft").insert({
      id: postData.id,
      title: postData.title,
      content: postData.content,
      difficulty: postData.difficulty || "N/A",
      yarnWeight: postData.yarnWeight || "N/A",
      hasImage: productImage instanceof File,
      creatorID: user?.id,
      lastEdit: new Date().toISOString(),
    })
  }
}
