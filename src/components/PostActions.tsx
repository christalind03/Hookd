"use client"

import {
  DotsHorizontalIcon,
  StarFilledIcon,
  StarIcon,
} from "@radix-ui/react-icons"
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
import { useToast } from "@/components/ui/useToast"

type Props = {
  postID: string
  isAuthor: boolean
  isFavorite: boolean
  onDelete: () => void
  onFavorite: () => void
}

export function PostActions({
  postID,
  isAuthor,
  isFavorite,
  onDelete,
  onFavorite,
}: Props) {
  const router = useRouter()
  const { toast } = useToast()

  return (
    <DropdownMenu>
      <DropdownMenuContent align="end" className="w-36" forceMount>
        <DropdownMenuItem
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()

            navigator.clipboard.writeText(
              `${window.location.origin}/post/${postID}`
            )

            toast({
              title: "🔗 Link Copied",
              description: "Link copied to clipboard.",
            })
          }}
        >
          <IconLabel text="Copy Link" icon={<Link2Icon />} />
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()

            onFavorite()
          }}
        >
          <IconLabel
            text="Favorite"
            icon={
              isFavorite ? (
                <StarFilledIcon className="text-yellow-500" />
              ) : (
                <StarIcon />
              )
            }
          />
        </DropdownMenuItem>

        {isAuthor && (
          <Fragment>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()

                router.push(`/post/submit?edit=${postID}`)
              }}
            >
              <IconLabel text="Edit Post" icon={<Pencil1Icon />} />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(event) => {
                event.preventDefault()
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
