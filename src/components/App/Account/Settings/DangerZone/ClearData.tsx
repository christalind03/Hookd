"use client"

// Business Logic
import { clearData } from "@/actions/authActions"
import { useUser } from "@/components/UserProvider"

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
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/Tooltip"
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"

export function ClearData() {
  const supabaseUser = useUser()
  
  return (
    <div className="flex gap-3 items-center justify-between">
      <div className="flex flex-col gap-3">
        <Label className="flex font-bold gap-2">
          Clear Data
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <QuestionMarkCircledIcon />
              </TooltipTrigger>
              <TooltipContent className="bg-red-500">
                <p>Permanently deletes all drafts, posts, and saved posts.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
      </div>

      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible and will permanently delete all your
              drafts, posts, and saved posts and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => clearData(supabaseUser?.id!)}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Confirm</Button>
        </AlertDialogTrigger>
      </AlertDialog>
    </div>
  )
}
