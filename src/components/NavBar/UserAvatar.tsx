"use client"

// Business Logic
import { type User } from "@supabase/supabase-js"
import { logOut } from "@/actions/authActions"
import { useRouter } from "next/navigation"
import { useState } from "react"

// UI Components
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { BookmarkIcon, ExitIcon, GearIcon } from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { IconButton } from "@/components/IconButton"
import Link from "next/link"
import { Separator } from "../ui/Separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet"

type Props = {
  supabaseUser: User
}

const navLinks = [
  {
    label: "Saved",
    href: "/saved",
    icon: <BookmarkIcon />,
  },
  {
    label: "Settings",
    href: "/account",
    icon: <GearIcon />,
  },
]

export function UserAvatar({ supabaseUser }: Props) {
  const router = useRouter()
  const [menuState, setMenuState] = useState(false)

  async function signOut() {
    await logOut()
    router.refresh()
  }

  return (
    <div>
      {/* Mobile Navigation */}
      <div className="sm:hidden">
        <Sheet open={menuState} onOpenChange={(isOpen) => setMenuState(isOpen)}>
          <SheetContent>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 items-center justify-center">
                <Avatar className="size-16">
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="font-normal leading-relaxed text-center">
                  <p className="font-bold">Hello,</p>
                  <p className="text-xs text-muted-foreground">
                    {supabaseUser?.email}
                  </p>
                </div>
              </div>

              <Separator />

              {navLinks.map((navLink) => (
                <Link
                  key={navLink.href}
                  href={navLink.href}
                  className={`flex gap-3 items-center text-sm ${
                    navLink.label === "Settings" ? "" : ""
                  }`}
                >
                  {navLink.icon}
                  {navLink.label}
                </Link>
              ))}

              <div onClick={() => signOut()}>
                <IconButton text="Log Out" icon={<ExitIcon />} isDestructive />
              </div>
            </div>
          </SheetContent>

          <SheetTrigger>
            <Avatar>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </SheetTrigger>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:block">
        <DropdownMenu>
          <DropdownMenuContent align="end" className="w-56" forceMount>
            <DropdownMenuLabel>
              <div className="font-normal leading-relaxed">
                <p className="font-bold">Hello,</p>
                <p className="text-xs text-muted-foreground">
                  {supabaseUser?.email}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {navLinks.map((navLink) => (
              <DropdownMenuItem key={navLink.href}>
                <Link href={navLink.href} className="flex gap-3 items-center">
                  {navLink.icon}
                  {navLink.label}
                </Link>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => signOut()}>
              <IconButton text="Log Out" icon={<ExitIcon />} isDestructive />
            </DropdownMenuItem>
          </DropdownMenuContent>

          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </div>
  )
}
