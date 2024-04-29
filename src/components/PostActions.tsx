"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { IconLabel } from "@/components/IconLabel"
import { Fragment } from "react"
import { Link2Icon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"

type Props = {
  id: string
  isAuthor: boolean
  onDelete: () => void
}

export function PostActions({ id, isAuthor, onDelete }: Props) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuContent align="end" className="w-36" forceMount>
        <DropdownMenuItem onClick={() => {
          navigator.clipboard.writeText(`${window.location.origin}/post/${id}`)
        }}>
          <IconLabel text="Copy Link" icon={<Link2Icon />} />
        </DropdownMenuItem>

        {isAuthor && (
          <Fragment>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation()
                router.push(`/post/submit?edit=${id}`)
              }}
            >
              <IconLabel text="Edit Post" icon={<Pencil1Icon />} />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation()
                onDelete()
              }}
            >
              <IconLabel
                text="Delete Post"
                icon={<TrashIcon />}
                isDestructive
              />
            </DropdownMenuItem>
          </Fragment>
        )}
      </DropdownMenuContent>

      <DropdownMenuTrigger asChild>
        <DotsHorizontalIcon />
      </DropdownMenuTrigger>
    </DropdownMenu>
  )
}
