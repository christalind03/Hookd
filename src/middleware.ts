import { type CookieOptions, createServerClient } from "@supabase/ssr"
import { jwtDecode } from "jwt-decode"
import { protectedRoutes, publicRoutes } from "@/constants/protectedRoutes"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // ==============================
  // Refresh Expired Auth Tokens
  // ==============================
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  // ==============================
  // Implement Protected Routes
  // ==============================
  const requestedRoute = request.nextUrl.pathname

  // If the requested route is public, skip the user role verification process.
  if (publicRoutes.some((publicRoute) => requestedRoute.startsWith(publicRoute))) {
    return response
  }

  // Retrieve the user's role from their JSON Web Token.
  const jsonWebToken = await new Promise((resolve, reject) => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session) {
          resolve(jwtDecode(session.access_token))
        }

        resolve(null)

      } catch (err) {
        reject(err)
      }
    })
  })

  // @ts-ignore
  // Since the 'app_metadata' property is not included in a JwtPayload object, ignore the TypeScript error.
  const userRole = jsonWebToken?.app_metadata.user_role || "Anon"

  // Allow users with the role of 'Admin' to have full access to the application.
  if (userRole === "Admin" && requestedRoute !== "/login" && requestedRoute !== "/signup") {
    return response
  }
  
  // Prevent unauthorized users from accessing certain pages of the application.
  if (protectedRoutes[userRole].includes(requestedRoute)) {
    return response
  }

  // If the user is not authorized to view the requested route, redirect them to an error page.
  return NextResponse.rewrite(new URL("/not-found", request.url))
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
