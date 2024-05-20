"use server"

import { createClient } from "@/utils/supabase/server"
import { uploadFile } from "@/actions/uploadFile"
import { isError } from "@/types/Error"
import { deleteDraft } from "@/actions/deleteDraft"
import { toPostData } from "@/actions/toPostData"

export async function submitPost(isEdit: boolean, formData: FormData) {
  const postData = toPostData(formData)
  const supabaseClient = await createClient()

  // Delete draft entry.
  if (!isEdit) {
    deleteDraft(postData.id)
  }

  // Update storage.posts bucket.
  const serverResponse = await uploadFile(
    "posts",
    postData.id,
    postData.postImage
  )

  if (isError(serverResponse)) {
    return serverResponse
  }

  // Update public.posts table.
  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  const { data, error } = await supabaseClient.from("posts").upsert({
    id: postData.id,
    title: postData.title,
    content: postData.content,
    projectDifficulty: postData.projectDifficulty,
    projectType: postData.projectType,
    creatorID: user?.id,
  })

  if (error) {
    return {
      status: error.code,
      message: error.message,
    }
  }
}
