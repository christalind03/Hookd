"use client"

import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { ExitIcon } from "@radix-ui/react-icons"
import { IconLabel } from "@/components/IconLabel"

import { logOut } from "@/actions/logOut"
import { useRouter } from "next/navigation"
import { type User } from "@supabase/supabase-js"

type Props = {
  supabaseUser: User
}

export function UserAvatar({ supabaseUser }: Props) {
  const router = useRouter()

  async function signOut() {
    await logOut()
    router.refresh()
  }

  return (
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

        <DropdownMenuItem onClick={() => signOut()}>
          <IconLabel text="Log Out" icon={<ExitIcon />} isDestructive />
        </DropdownMenuItem>
      </DropdownMenuContent>

      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
    </DropdownMenu>
  )
}
