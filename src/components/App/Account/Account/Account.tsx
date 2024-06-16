import { AccountInfo } from "@/components/App/Account/Account/AccountInfo"
import { ProfileInfo } from "@/components/App/Account/Account/ProfileInfo"

export function Account() {
  return (
    <div className="flex flex-col gap-7">
      <AccountInfo />
      <ProfileInfo />
    </div>
  )
}