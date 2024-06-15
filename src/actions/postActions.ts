"use server"

import { createClient } from "@/utils/supabase/server"
import { deleteDraft } from "@/actions/draftActions"
import { isError } from "@/types/Error"
import { toPostData } from "@/utils/toPostData"
import { uploadFile } from "@/actions/uploadFile"

export async function deletePost(postID: string) {
  const supabaseClient = await createClient()

  await supabaseClient.storage
    .from("posts")
    .remove([`${postID}`])

  await supabaseClient
    .from("posts")
    .delete()
    .match({
      id: postID,
    })
}

export async function savePost(
  userID: string,
  postID: string,
  isSaved: boolean
) {
  const supabaseClient = await createClient()

  if (isSaved) {
    const { data, error } = await supabaseClient
      .from("savedPosts")
      .delete()
      .match({
        userID,
        postID,
      })
  } else {
    const { data, error } = await supabaseClient
      .from("savedPosts")
      .insert({
        userID,
        postID,
      })
  }
}

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

  const { data, error } = await supabaseClient
    .from("posts")
    .upsert({
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