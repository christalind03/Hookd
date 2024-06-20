// Business Logic

// UI Components
import { ClearData } from "@/components/App/Account/Account/DangerZone/ClearData"
import { DeleteAccount } from "@/components/App/Account/Account/DangerZone/DeleteAccount"
import { Separator } from "@/components/ui/Separator"

export function DangerZone() {
  return (
    <section className="border border-red-500 flex flex-col gap-5 p-5 rounded-md shadow text-red-500">
      <h5>Danger Zone</h5>

      {/* The class name helps the separator ignore the parent padding. */}
      <Separator className="bg-red-500 -mx-5 w-[calc(100%+2.5rem)]" />

      <div className="flex flex-col gap-3">
        <ClearData />
        <DeleteAccount />
      </div>
    </section>
  )
}
