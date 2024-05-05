"use server"

import { createClient } from "@/utils/supabase/server"

export async function deleteDraft(id: string) {
  const supabaseClient = await createClient()

  await supabaseClient.storage
    .from("draft")
    .remove([`${id}`])
  
  await supabaseClient
    .from("draft")
    .delete()
    .match({
      id,
    })
}