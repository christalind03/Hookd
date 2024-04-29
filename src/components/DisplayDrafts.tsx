"use client"

import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { TrashIcon } from "@radix-ui/react-icons"

import { deleteDraft } from "@/actions/deleteDraft"
import { supabaseClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { useUser } from "@/components/UserProvider"
import { type Draft } from "@/types/Draft"
import { calculateElapsedTime } from "@/utils/calculateElapsedTime"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function DisplayDrafts() {
  const user = useUser()
  const router = useRouter()
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [refreshSeed, setRefreshSeed] = useState<number>(0)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    async function fetchDrafts() {
      const { data, error } = await supabaseClient
        .from("drafts")
        .select("*")
        .match({
          creatorID: user?.id,
        })
        .order("lastEdit", { ascending: false })

      if (data) {
        setDrafts(data)
      }
    }

    fetchDrafts()
  }, [refreshSeed])

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
          drafts.map((draftData) => (
            <div
              key={draftData.id}
              className="flex gap-3 items-center justify-between px-3 py-1 rounded-md hover:bg-accent"
              onClick={() => {
                setIsOpen(false)
                router.replace(`/post/submit?draft=${draftData.id}`)
              }}
            >
              <div>
                <h5 className="font-bold">
                  {draftData.title || "No title provided."}
                </h5>
                <p className="text-muted-foreground text-xs">
                  Draft saved {calculateElapsedTime(draftData.lastEdit)} ago
                </p>
              </div>

              <TrashIcon
                className="text-destructive size-5"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()

                  removeDraft(draftData.id)
                }}
              />
            </div>
          ))
        ) : (
          <p>Nothing to display...</p>
        )}
      </DialogContent>

      <DialogTrigger asChild>
        <Button variant="ghost">{drafts.length} Drafts</Button>
      </DialogTrigger>
    </Dialog>
  )
}
