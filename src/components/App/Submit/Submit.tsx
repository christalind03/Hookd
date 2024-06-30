"use client"

// Business Logic
import { type Draft } from "@/types/Draft"
import { type Post } from "@/types/Post"
import { submitPost } from "@/actions/postActions"
import { supabaseClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser } from "@/components/UserProvider"

// UI Components
import { DisplayDrafts } from "@/components/App/Submit/DisplayDrafts"
import { Loading } from "@/components/Loading"
import { SubmitForm } from "@/components/App/Submit/SubmitForm"

export function Submit() {
  const appRouter = useRouter()
  const supabaseUser = useUser()
  const searchParams = useSearchParams()
  const [postData, setPostData] = useState<Draft | Post>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const draftID = searchParams.get("draft")
  const postID = searchParams.get("edit")

  useEffect(() => {
    async function fetchPostData() {
      setIsLoading(true)

      if (draftID || postID) {
        const { data, error } = await supabaseClient
          .from(draftID ? "drafts" : "posts")
          .select("*")
          .match({
            id: draftID || postID,
          })
          .maybeSingle()

        if (data) {
          if (data.creatorID === supabaseUser?.id) {
            setPostData({ ...data })
          }
        }
      }

      setIsLoading(false)
    }

    fetchPostData()
  }, [draftID, postID, supabaseUser?.id])

  if (supabaseUser) {
    return (
      <div className="flex flex-col gap-5 items-center justify-center m-5">
        <div className="flex items-center justify-center w-full sm:w-[525px] md:w-[625px] lg:w-[725px]">
          <h3 className="absolute font-extrabold text-3xl">Submit Post</h3>

          <div className="ml-auto max-sm:hidden">
            <DisplayDrafts />
          </div>
        </div>
        
        <div className="sm:hidden">
          <DisplayDrafts />
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <SubmitForm
            isEdit={!!postID}
            postData={postData}
            onSubmit={(formData) => submitPost(!!postID, formData)}
          />
        )}
      </div>
    )
  }

  appRouter.replace("/home")
}
