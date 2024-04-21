import { NavBar } from "@/components/NavBar/NavBar"
import { UserProvider } from "@/components/UserProvider"
import { createClient } from "@/utils/supabase/server"

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabaseClient = await createClient()

  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  return (
    <UserProvider supabaseUser={user}>
      <NavBar />

      <main>
        {children}
      </main>
    </UserProvider>
  )
}
