"use server"

import { createClient } from "@/utils/supabase/server"

export async function editPost(id: string, formData: FormData) {
  const title = formData.get("title")
  const content = formData.get("content")
  const productImage = formData.get("productImage") as Blob
  const supabaseClient = await createClient()

  if (productImage instanceof File) {
    const { data, error } = await supabaseClient.storage
      .from("posts")
      .update(id, productImage, {
        contentType: productImage.type,
        upsert: true,
      })

    if (error) {
      return {
        status: error.name,
        message: error.message,
      }
    }
  } else {
    const { data, error } = await supabaseClient.storage
      .from("posts")
      .remove([`${id}`])
  }

  const { data, error } = await supabaseClient
    .from("post")
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
