"use client"

// Business Logic
import { type Draft } from "@/types/Draft"
import { calculateElapsedTime } from "@/utils/calculateElapsedTime"
import { deleteDraft } from "@/actions/draftActions"
import { supabaseClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { useUser } from "@/components/UserProvider"
import { useRouter } from "next/navigation"

// UI Components
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { TrashIcon } from "@radix-ui/react-icons"

export function DisplayDrafts() {
  const router = useRouter()
  const supabaseUser = useUser()
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [refreshSeed, setRefreshSeed] = useState<number>(0)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    async function fetchDrafts() {
      const { data, error } = await supabaseClient
        .from("drafts")
        .select("*")
        .match({
          creatorID: supabaseUser?.id,
        })
        .order("lastEdit", { ascending: false })

      if (data) {
        setDrafts(data)
      }
    }

    fetchDrafts()
  }, [refreshSeed, supabaseUser?.id])

  async function removeDraft(draftID: string) {
    await deleteDraft(draftID)
    setRefreshSeed(Math.random())
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Drafts</DialogTitle>
        </DialogHeader>

        {drafts.length > 0 ? (
          drafts.map((draftData) => {
            const elapsedTime = calculateElapsedTime(draftData.lastEdit)

            return (
              <div
                key={draftData.id}
                className="flex gap-3 items-center justify-between px-3 py-1 rounded-md hover:bg-accent"
                onClick={() => {
                  setIsOpen(false)
                  router.replace(`/submit?draft=${draftData.id}`)
                }}
              >
                <div>
                  <h5 className="font-bold">
                    {draftData.title || "No title provided."}
                  </h5>
                  <p className="text-muted-foreground text-xs">
                    Draft saved {elapsedTime === "Now" ? elapsedTime.toLowerCase() : `${elapsedTime} ago`}
                  </p>
                </div>

                <TrashIcon
                  className="size-5 hover:text-destructive"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()

                    removeDraft(draftData.id)
                  }}
                />
              </div>
            )
          })
        ) : (
          <p className="text-center">No drafts found.</p>
        )}
      </DialogContent>

      <DialogTrigger asChild>
        <Button variant="ghost">{drafts.length} Drafts</Button>
      </DialogTrigger>
    </Dialog>
  )
}
