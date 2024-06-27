// Business Logic
import { createClient } from "@/utils/supabase/server"
import { isUser } from "@/types/User"
import { UserProvider } from "@/components/UserProvider"

// UI Components
import { NavBar } from "@/components/NavBar/NavBar"
import { Toaster } from "@/components/ui/Toaster"

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabaseClient = await createClient()

  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  const { data, error } = await supabaseClient
    .rpc("retrieveUserData", {
      userID: user?.id,
    })
    .single()

  return (
    <UserProvider supabaseUser={isUser(data) ? data : undefined}>
      <NavBar />
      <Toaster />

      <main className="flex items-center justify-center m-5">
        <div className="flex flex-col gap-3 w-full sm:w-[525px] md:w-[625px] lg:w-[725px]">
          {children}
        </div>
      </main>
    </UserProvider>
  )
}
