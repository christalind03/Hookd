"use client"

// Business Logic
import { useToast } from "@/components/ui/useToast"
import { useRouter } from "next/navigation"

// UI Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog"
import {
  DotsHorizontalIcon,
  HeartFilledIcon,
  HeartIcon,
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
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Post?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible and will permanently delete the post and
            all content associated with it.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(event) => {
              event.stopPropagation()

              setTimeout(() => (document.body.style.pointerEvents = ""), 500)
            }}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.stopPropagation()

              onDelete()
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      <DropdownMenu>
        <DropdownMenuContent align="end" className="w-36" forceMount>
          <DropdownMenuItem
            onClick={(event) => {
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
              event.stopPropagation()

              onSave()
            }}
          >
            <IconButton
              text="Save"
              icon={
                isFavorite ? (
                  <HeartFilledIcon className="text-red-500" />
                ) : (
                  <HeartIcon />
                )
              }
            />
          </DropdownMenuItem>

          {isAuthor && (
            <Fragment>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation()

                  router.push(`/post/submit?edit=${postID}`)
                }}
              >
                <IconButton text="Edit Post" icon={<Pencil1Icon />} />
              </DropdownMenuItem>

              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onClick={(event) => {
                    event.stopPropagation()
                  }}
                >
                  <IconButton
                    text="Delete Post"
                    icon={<TrashIcon />}
                    isDestructive
                  />
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </Fragment>
          )}
        </DropdownMenuContent>

        <DropdownMenuTrigger asChild>
          <DotsHorizontalIcon />
        </DropdownMenuTrigger>
      </DropdownMenu>
    </AlertDialog>
  )
}
