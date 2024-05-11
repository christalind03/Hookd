"use client"

import { Button } from "../ui/Button"
import { UserAvatar } from "@/components/NavBar/UserAvatar"
import { useUser, useUserRole } from "@/components/UserProvider"
import { MagnifyingGlassIcon, Pencil2Icon } from "@radix-ui/react-icons"
import Link from "next/link"

export function NavBar() {
  const supabaseUser = useUser()
  const supabaseUserRole = useUserRole()

  return (
    <div className="backdrop-blur-lg flex h-14 items-center justify-between left-0 px-5 sticky top-0 z-10">
      <Link href="/home">
        <h1 className="cursor-pointer font-extrabold text-xl">🧶 Hook'd</h1>
      </Link>

      <div className="flex gap-3 items-center">
        <MagnifyingGlassIcon className="size-5 hover:text-blue-500" />

        {supabaseUserRole === "Admin" && (
          <Link href="/post/submit">
            <Pencil2Icon className="size-5 hover:text-blue-500" />
          </Link>
        )}

        {supabaseUser ? (
          <UserAvatar supabaseUser={supabaseUser} />
        ) : (
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
