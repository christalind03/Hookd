"use server"

import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"

export async function requestReset(emailAddress: string) {
  const headersList = headers()
  const supabaseClient = await createClient()

  const { data, error } = await supabaseClient.auth.resetPasswordForEmail(
    emailAddress,
    {
      redirectTo: `${headersList.get("Origin")}/account/verify?action=reset-password&`,
    }
  )

  if (error) {
    return {
      status: error.code,
      message: error.message,
    }
  }
}

export async function resetPassword(newPassword: string) {
  const supabaseClient = await createClient()

  const { data, error } = await supabaseClient.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return {
      status: error.status?.toString(),
      message: error.message,
    }
  }
}
