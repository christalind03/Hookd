"use server"

import { createClient } from "@/utils/supabase/server"

export async function logOut() {
  const supabaseClient = await createClient()

  await supabaseClient.auth.signOut()
}
