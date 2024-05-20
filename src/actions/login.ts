"use server"

import { createClient } from "@/utils/supabase/server"

export async function logIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabaseClient = await createClient()

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      status: error.status?.toString(),
      message: error.message,
    }
  }
}
