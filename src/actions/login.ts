"use server"

import { createClient } from "@/utils/supabase/server"

type FormData = {
  email: string
  password: string
}

export async function logIn(formData: FormData) {
  const supabaseClient = await createClient()

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    ...formData,
  })

  if (error) {
    return {
      status: error.status?.toString(),
      message: error.message,
    }
  }
}
