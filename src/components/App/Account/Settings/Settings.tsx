import { AccountInfo } from "@/components/App/Account/Settings/AccountInfo"
import { DangerZone } from "@/components/App/Account/Settings/DangerZone/DangerZone"
import { ProfileInfo } from "@/components/App/Account/Settings/ProfileInfo"

export function Settings() {
  return (
    <div className="flex flex-col gap-7">
      <AccountInfo />
      <ProfileInfo />
      <DangerZone />
    </div>
  )
}