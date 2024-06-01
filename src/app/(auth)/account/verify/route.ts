import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { origin, searchParams } = new URL(request.nextUrl)
  
  const action = searchParams.get("action")
  const sessionCode = searchParams.get("code")
  
  let redirectURL = new URL("", origin)

  switch (action) {
    case "reset-password":
      redirectURL.pathname = "/account/reset-password"
      break

    default:
      break
  }

  if (sessionCode) {
    const supabaseClient = await createClient()
    const { data, error } = await supabaseClient.auth.exchangeCodeForSession(
      sessionCode
    )
  }

  return NextResponse.redirect(redirectURL)
}
