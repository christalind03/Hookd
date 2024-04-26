"use client"

import { Button } from "../ui/Button"
import { UserAvatar } from "@/components/NavBar/UserAvatar"
import { useUser } from "@/components/UserProvider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

const navLinks = [
  {
    label: "Home",
    href: "/home",
  },
  {
    label: "Create Post",
    href: "/post/submit",
  },
]

export function NavBar() {
  const pathname = usePathname()
  const supabaseUser = useUser()
  const [menuState, setMenuState] = useState(false)

  return (
    <div className="backdrop-blur-lg flex h-14 items-center justify-between left-0 px-5 sticky top-0 z-10">
      <Sheet open={menuState} onOpenChange={(isOpen) => setMenuState(isOpen)}>
        <SheetContent className="w-screen sm:w-full" side="left">
          <div className="flex flex-col gap-5 h-full items-center justify-center">
            {navLinks.map((navLink) => (
              <Link
                key={navLink.href}
                href={navLink.href}
                className={`text-xl ${
                  pathname.includes(navLink.href)
                    ? "decoration-4 font-bold text-blue-500 underline underline-offset-4"
                    : ""
                }`}
                onClick={() => setMenuState(false)}
              >
                {navLink.label}
              </Link>
            ))}
          </div>
        </SheetContent>

        <SheetTrigger asChild>
          <h1 className="cursor-pointer font-extrabold text-xl">
            🧶 Threadify
          </h1>
        </SheetTrigger>
      </Sheet>

      {supabaseUser ? (
        <UserAvatar supabaseUser={supabaseUser} />
      ) : (
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      )}
    </div>
  )
}
