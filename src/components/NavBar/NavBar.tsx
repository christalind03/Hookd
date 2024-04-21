"use client"

import { Button } from "../ui/Button"
import { UserAvatar } from "@/components/NavBar/UserAvatar"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/UserProvider"

export function NavBar() {
  const router = useRouter()
  const supabaseUser = useUser()

  return (
    <div className="backdrop-blur-lg fixed top-0 left-0 flex h-14 items-center justify-between px-10 w-screen z-10">
      <h1 className="font-extrabold text-xl">🧶 Threadify</h1>

      <div className="flex gap-3 items-center justify-center">
        {supabaseUser ? (
          <UserAvatar supabaseUser={supabaseUser} />
        ) : (
          <Button onClick={() => router.push("/login")}>Log In</Button>
        )}
      </div>
    </div>
  )
}
