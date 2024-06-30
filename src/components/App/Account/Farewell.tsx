"use client"

// Business Logic
import { useRouter } from "next/navigation"

// UI Components
import { Button } from "@/components/ui/Button"

export function Farewell() {
  const appRouter = useRouter()

  return (
    <div className="flex flex-col gap-3 items-center justify-center mt-5">
      <h3 className="font-extrabold text-3xl">Account Deleted</h3>
      <h5 className="text-center text-pretty text-sm">Your Hook&apos;d account and all your data have been deleted.</h5>
      <Button className="mt-3" onClick={() => appRouter.push("/home")}>Return to Home</Button>
    </div>
  )  
}