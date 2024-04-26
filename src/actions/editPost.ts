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
      .list(undefined, {
        search: id,
      })

    // If a file already exists, replace the current file.
    // Otherwise, create a new file instance.
    if (data && data[0]) {
      const { data, error } = await supabaseClient.storage
        .from("posts")
        .update(id, productImage, {
          contentType: productImage.type,
          upsert: true,
        })

      if (error) {
        return {
          status: "413",
          message: "File exceeds maximum size (1MB).",
        }
      }
    } else {
      const { data, error } = await supabaseClient.storage
        .from("posts")
        .upload(id, productImage, {
          contentType: productImage.type,
        })

      if (error) {
        return {
          status: "413",
          message: "File exceeds maximum size (1MB).",
        }
      }
    }
  } else {
    const { data, error } = await supabaseClient.storage
      .from("posts")
      .remove([`${id}`])
  }

  const { data, error } = await supabaseClient
    .from("posts")
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
