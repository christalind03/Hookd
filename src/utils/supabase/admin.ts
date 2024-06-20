"use server"

import { cookies } from "next/headers"
import { type CookieOptions, createServerClient } from "@supabase/ssr"

export async function createAdmin() {
  const cookieStore = cookies()

  const supabaseClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SECRET_SUPABASE_ADMIN_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    }
  )

  return supabaseClient
}
