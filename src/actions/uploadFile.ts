"use server"

import { createClient } from "@/utils/supabase/server"

export async function uploadFile(
  bucketName: string,
  destinationPath: string,
  fileUpload: Blob
) {
  const supabaseClient = await createClient()

  if (fileUpload instanceof File) {
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(destinationPath, fileUpload, {
        contentType: fileUpload.type,
        upsert: true,
      })

    if (error) {
      return {
        status: "413",
        message: "File exceeds maximum file size (1MB).",
      }
    }
  } else {
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .remove([`${destinationPath}`])
  }
}
