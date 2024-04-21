"use client"

import { createContext, useContext } from "react"
import { type User } from "@supabase/supabase-js"

// @ts-ignore
const UserContext = createContext<User | null>()

export function UserProvider({
  children,
  supabaseUser,
}: Readonly<{ children: React.ReactNode; supabaseUser: User | null }>) {
  return (
    <UserContext.Provider value={supabaseUser}>{children}</UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
