"use client"

// Business Logic
import { useRouter } from "next/navigation"
import { useUser } from "@/components/UserProvider"

// UI Components
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Separator } from "@/components/ui/Separator"

export function AccountInfo() {
  const appRouter = useRouter()
  const supabaseUser = useUser()

  return (
    <section className="border flex flex-col gap-5 p-5 rounded-md shadow">
      <h5>Account Information</h5>

      {/* The class name helps the separator ignore the parent padding. */}
      <Separator className="-mx-5 w-[calc(100%+2.5rem)]" />

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-3 items-center text-sm">
          <Label>Email</Label>
          <Input
            className="col-span-2"
            placeholder={supabaseUser?.email}
            disabled
          />
        </div>

        <div className="grid grid-cols-3 items-center text-sm">
          <Label>Password</Label>
          <Button
            onClick={() => appRouter.push("/account/reset-password")}
            variant="secondary"
          >
            Reset Password
          </Button>
        </div>
      </div>
    </section>
  )
}
