"use client"

import { type User } from "@/types/User"
import { createContext, useContext } from "react"

// @ts-ignore
const UserContext = createContext<User | undefined>()

export function UserProvider({
  children,
  supabaseUser,
}: Readonly<{
  children: React.ReactNode
  supabaseUser: User | undefined
}>) {
  return (
    <UserContext.Provider value={supabaseUser}>{children}</UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
