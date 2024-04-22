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

type Props = {
  isAuthor: boolean
  onDelete: () => void
}

export function PostActions({ isAuthor, onDelete }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuContent align="end" className="w-36" forceMount>
        <DropdownMenuItem>
          <IconLabel text="Copy Link" icon={<Link2Icon />} />
        </DropdownMenuItem>

        {isAuthor && (
          <Fragment>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <IconLabel text="Edit Post" icon={<Pencil1Icon />} />
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onDelete()}>
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
