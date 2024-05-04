"use client"

import { createContext, useContext } from "react"
import { type User } from "@supabase/supabase-js"

// @ts-ignore
const UserContext = createContext<User | null>()

// @ts-ignore
const UserRoleContext = createContext<string | null>()

export function UserProvider({
  children,
  supabaseUser,
  supabaseUserRole,
}: Readonly<{
  children: React.ReactNode
  supabaseUser: User | null
  supabaseUserRole: string | null
}>) {
  return (
    <UserContext.Provider value={supabaseUser}>
      <UserRoleContext.Provider value={supabaseUserRole}>
        {children}
      </UserRoleContext.Provider>
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}

export function useUserRole() {
  return useContext(UserRoleContext)
}
