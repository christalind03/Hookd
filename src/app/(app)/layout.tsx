import { NavBar } from "@/components/NavBar/NavBar"
import { UserProvider } from "@/components/UserProvider"
import { createClient } from "@/utils/supabase/server"
import { Toaster } from "@/components/ui/Toaster"

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabaseClient = await createClient()

  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  const { data, error } = await supabaseClient
    .from("users")
    .select("role")
    .match({
      id: user?.id,
    })
    .single()

  return (
    <UserProvider supabaseUser={user} supabaseUserRole={data?.role}>
      <NavBar />
      <Toaster />

      <main>{children}</main>
    </UserProvider>
  )
}
