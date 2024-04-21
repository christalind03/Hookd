"use server"

import { createClient } from "@/utils/supabase/server"

type LoginCredentials = {
  email: string
  password: string
}

export async function logIn(formData: LoginCredentials) {
  const supabaseClient = await createClient()

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    ...formData,
  })

  if (error) {
    return {
      status: error.status,
      message: error.message,
    }
  }

  return null
}
