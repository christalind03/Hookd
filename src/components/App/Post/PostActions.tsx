"use client"

// Business Logic
import { useToast } from "@/components/ui/useToast"
import { useRouter } from "next/navigation"

// UI Components
import {
  DotsHorizontalIcon,
  BookmarkFilledIcon,
  BookmarkIcon,
} from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { Fragment } from "react"
import { IconButton } from "@/components/IconButton"
import { Link2Icon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons"

type Props = {
  postID: string
  isAuthor: boolean
  isFavorite: boolean
  onDelete: () => void
  onSave: () => void
}

export function PostActions({
  postID,
  isAuthor,
  isFavorite,
  onDelete,
  onSave,
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
          <IconButton text="Copy Link" icon={<Link2Icon />} />
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()

            onSave()
          }}
        >
          <IconButton
            text="Save"
            icon={
              isFavorite ? (
                <BookmarkFilledIcon className="text-yellow-500" />
              ) : (
                <BookmarkIcon />
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
              <IconButton text="Edit Post" icon={<Pencil1Icon />} />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()

                onDelete()
              }}
            >
              <IconButton
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
