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

export default function SubmitPost() {
  const user = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [postData, setPostData] = useState<Post>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const draftID = searchParams.get("draft")
  const editID = searchParams.get("edit")

  useEffect(() => {
    async function fetchPostData() {
      if (draftID || editID) {
        const { data, error } = await supabaseClient
          .from("posts")
          .select("*")
          .match({
            id: draftID || editID,
          })
          .maybeSingle()

        if (data) {
          if (data.creatorID === user?.id) {
            setPostData(data)
          }
        }
      }

      setIsLoading(false)
    }

    fetchPostData()
  }, [])

  if (user) {
    return (
      <div className="flex flex-col gap-5 items-center justify-center m-5">
        <h3 className="font-extrabold text-3xl">Submit Post</h3>

        {isLoading ? (
          <Loading />
        ) : (
          <PostForm
            isDraft={!editID}
            postData={postData}
            onSubmit={(formData) =>
              editID ? editPost(formData) : submitPost(formData)
            }
          />
        )}
      </div>
    )
  }

  router.replace("/home")
}
