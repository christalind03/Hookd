"use client"

// Business Logic
import { deleteAccount } from "@/actions/authActions"
import { useRouter } from "next/navigation"
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

export function DeleteAccount() {
  const appRouter = useRouter()
  const supabaseUser = useUser()

  async function onDelete() {
    await deleteAccount(supabaseUser?.id!)

    // TODO: Change this to a success page?
    appRouter.push("/home")
  }

  return (
    <div className="flex gap-3 items-center justify-between">
      <div className="flex flex-col gap-3">
        <Label className="flex font-bold gap-2">
          Delete Account
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <QuestionMarkCircledIcon />
              </TooltipTrigger>

              <TooltipContent className="bg-red-500">
                <p>Permanently deletes your account.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
      </div>

      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible will permanently delete your account
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete()}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>

        <AlertDialogTrigger asChild>
          <Button variant="destructive">Confirm</Button>
        </AlertDialogTrigger>
      </AlertDialog>
    </div>
  )
}
