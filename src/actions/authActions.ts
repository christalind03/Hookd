"use server"

import { createAdmin } from "@/utils/supabase/admin"
import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"

export async function clearData(userID: string) {
  const supabaseClient = await createClient()

  const deletedPosts = await supabaseClient
    .from("posts")
    .delete()
    .in("id", [userID])

  const deletedSavedPosts = await supabaseClient
    .from("savedPosts")
    .delete()
    .in("userID", [userID])
}

export async function deleteAccount(userID: string) {
  logOut()
  
  const supabaseAdmin = await createAdmin()
  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userID)
}

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

export async function logOut() {
  const supabaseClient = await createClient()
  await supabaseClient.auth.signOut()
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

export async function requestResetPassword(emailAddress: string) {
  const headersList = headers()
  const supabaseClient = await createClient()

  const { data, error } = await supabaseClient.auth.resetPasswordForEmail(
    emailAddress,
    {
      redirectTo: `${headersList.get(
        "Origin"
      )}/account/verify?action=reset-password&`,
    }
  )

  if (error) {
    return {
      status: error.code,
      message: error.message,
    }
  }
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  // If the username is available, attempt to create a new account.
  if (await isUsernameAvailable(username)) {
    const supabaseAdmin = await createAdmin()
    const supabaseClient = await createClient()
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    })

    if (data.user) {
      await supabaseAdmin.from("userRoles").insert({
        id: data.user?.id,
      })

      await supabaseClient.from("userProfiles").insert({
        id: data.user?.id,
        username,
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

export async function updateProfile(userID: string, formData: FormData) {
  const username = formData.get("username") as string
  const biography = formData.get("biography") as string

  // If the username is available, update the user's profile information.
  if (await isUsernameAvailable(username)) {
    const supabaseClient = await createClient()
    const { data, error } = await supabaseClient
      .from("userProfiles")
      .update({
        username,
        biography,
      })
      .match({
        id: userID,
      })

    if (error) {
      return {
        status: error.code,
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
