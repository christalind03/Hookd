export const protectedRoutes: { [userRole: string]: string[] } = {
  "Anon": [
    "/account/farewell",
    "/login",
    "/signup",
  ],
  "User": [
    "/account/settings",
    "/saved",
  ],
  "Creator": [
    "/account/settings",
    "/saved",
    "/submit",
  ],
}

export const publicRoutes = [
  "/account/forgot-password",
  "/account/reset-password",
  "/home",
  "/not-found",
  "/post",
  "/results",
]