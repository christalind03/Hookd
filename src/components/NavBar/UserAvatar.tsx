"use client"

// Business Logic
import { type UserMetadata } from "@supabase/supabase-js"
import { logOut } from "@/actions/authActions"
import { useRouter } from "next/navigation"
import { useState } from "react"

// UI Components
import { Avatar, AvatarImage } from "@/components/ui/Avatar"
import { BookmarkIcon, ExitIcon, GearIcon } from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { Fragment } from "react"
import { IconButton } from "@/components/IconButton"
import Link from "next/link"
import { Separator } from "../ui/Separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet"

type Props = {
  supabaseUser: UserMetadata
}

const navLinks = [
  {
    label: "Saved",
    href: "/saved",
    icon: <BookmarkIcon />,
  },
  {
    label: "Settings",
    href: "/account/settings",
    icon: <GearIcon />,
  },
]

export function UserAvatar({ supabaseUser }: Props) {
  const appRouter = useRouter()
  const [imageURL, setImageURL] = useState<string>("/Default.jpg")
  const [menuState, setMenuState] = useState<boolean>(false)

  async function signOut() {
    await logOut()
    appRouter.refresh()
  }

  return (
    <Fragment>
      {/* Mobile Navigation */}
      <div className="sm:hidden">
        <Sheet open={menuState} onOpenChange={(isOpen) => setMenuState(isOpen)}>
          <SheetContent>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 items-center justify-center">
                <Avatar className="size-16">
                  <AvatarImage src={imageURL} />
                </Avatar>

                <div className="font-normal leading-relaxed text-center">
                  <p className="font-bold">Hello,</p>
                  <p className="text-xs text-muted-foreground">
                    {supabaseUser?.username}
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

              <div className="cursor-pointer" onClick={() => signOut()}>
                <IconButton text="Log Out" icon={<ExitIcon />} isDestructive />
              </div>
            </div>
          </SheetContent>

          <SheetTrigger asChild>
            <Avatar className="size-8">
              <AvatarImage src={imageURL} />
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
                  {supabaseUser?.username}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {navLinks.map((navLink) => (
              <DropdownMenuItem
                key={navLink.href}
                className="flex gap-3 items-center"
                onSelect={() => appRouter.push(navLink.href)}
              >
                {navLink.icon}
                {navLink.label}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={() => signOut()}>
              <IconButton text="Log Out" icon={<ExitIcon />} isDestructive />
            </DropdownMenuItem>
          </DropdownMenuContent>

          <DropdownMenuTrigger asChild>
            <Avatar className="size-8">
              <AvatarImage src={imageURL} />
            </Avatar>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </Fragment>
  )
}
