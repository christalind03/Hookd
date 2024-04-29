"use client"

import { PostForm } from "@/components/Forms/PostForm"
import { submitPost } from "@/actions/submitPost"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser } from "@/components/UserProvider"
import { useEffect, useState } from "react"
import { type Post } from "@/types/Post"
import { supabaseClient } from "@/utils/supabase/client"
import { editPost } from "@/actions/editPost"
import { Loading } from "@/components/Loading"
import { DisplayDrafts } from "@/components/DisplayDrafts"
import { type Draft } from "@/types/Draft"

export default function SubmitPost() {
  const user = useUser()
  const router = useRouter()
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
          if (data.creatorID === user?.id) {
            setPostData({ ...data })
          }
        }
      }

      setIsLoading(false)
    }

    fetchPostData()
  }, [draftID, postID])

  if (user) {
    return (
      <div className="flex flex-col gap-5 items-center justify-center m-5">
        <div className="flex items-center justify-center w-full sm:w-[525px] md:w-[625px] lg:w-[750px]">
          <h3 className="absolute font-extrabold text-3xl">Create Post</h3>

          <div className="ml-auto">
            <DisplayDrafts />
          </div>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <PostForm
            isDraft={!postID}
            postData={postData}
            onSubmit={(formData) =>
              postID ? editPost(formData) : submitPost(formData)
            }
          />
        )}
      </div>
    )
  }

  router.replace("/home")
}
