"use server"

import { createClient } from "@/utils/supabase/server"
import { randomUUID } from "crypto"

export async function submitPost(creatorID: string, formData: FormData) {
  const id = randomUUID()
  const title = formData.get("title")
  const content = formData.get("content")
  const productImage = formData.get("productImage") as Blob
  const supabaseClient = await createClient()

  if (productImage instanceof File) {
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

  const { data, error } = await supabaseClient.from("posts").insert({
    id,
    title,
    content,
    hasImage: productImage instanceof File,
    creatorID,
  })

  if (error) {
    return {
      status: error.code,
      message: error.message,
    }
  }
}
