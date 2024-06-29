"use client"

// Business Logic
import { useRouter } from "next/navigation"

// UI Components
import { Button } from "@/components/ui/Button"

export function NotFound() {
  const appRouter = useRouter()

  return (
    <div className="flex flex-col gap-3 items-center justify-center mt-5">
      <h3 className="font-black text-7xl">404</h3>
      <h5 className="font-bold text-xl">Page Not Found</h5>
      <p>The page you are looking for does not exist.</p>
      <Button className="mt-3" onClick={() => appRouter.push("/home")}>Return to Home</Button>
    </div>
  )
}