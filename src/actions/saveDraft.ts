"use server"

import { createClient } from "@/utils/supabase/server"
import { uploadFile } from "@/actions/uploadFile"
import { isError } from "@/types/Error"
import { toPostData } from "@/actions/toPostData"

export async function saveDraft(formData: FormData) {
  const postData = toPostData(formData)
  const supabaseClient = await createClient()

  // Update storage.drafts bucket.
  const serverResponse = await uploadFile(
    "drafts",
    postData.id,
    postData.postImage
  )

  if (isError(serverResponse)) {
    return serverResponse
  }

  // Update public.drafts table.
  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  const { data, error } = await supabaseClient.from("drafts").upsert({
    id: postData.id,
    title: postData.title,
    content: postData.content,
    projectDifficulty: postData.projectDifficulty || "N/A",
    projectType: postData.projectType || "N/A",
    hasImage: postData.postImage instanceof File,
    creatorID: user?.id,
    lastEdit: new Date().toISOString(),
  })
}
