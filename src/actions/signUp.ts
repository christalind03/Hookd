"use server"

import { createClient } from "@/utils/supabase/server"

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const username = formData.get("username") as string
  const password = formData.get("password") as string
  const supabaseClient = await createClient()

  // If the username is available, attempt to create a new account.
  // Otherwise, return an error.
  if (await isUsernameAvailable(username)) {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    })

    if (data.user) {
      await supabaseClient.from("userProfiles").insert({
        id: data.user?.id,
        username,
      })

      await supabaseClient.from("userRoles").insert({
        id: data.user?.id,
      })
    }

    if (error) {
      return {
        status: error.status?.toString(),
        message: error.message,
      }
    }
  } else {
    return {
      status: "404",
      message: "Username already taken.",
    }
  }
}

async function isUsernameAvailable(username: string) {
  const supabaseClient = await createClient()

  const { data, error } = await supabaseClient
    .from("userProfiles")
    .select("*")
    .match({
      username,
    })
    .single()

  return !!!data
}
