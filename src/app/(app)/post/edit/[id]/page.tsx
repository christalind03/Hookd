"use client"

import { PostForm } from "@/components/Forms/PostForm"
import { editPost } from "@/actions/editPost"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/UserProvider"
import { supabaseClient } from "@/utils/supabase/client"
import { type Post } from "@/types/Post"

type Props = {
  params: {
    id: string
  }
}

export default function EditPost({ params: { id } }: Props) {
  const user = useUser()
  const router = useRouter()
  const [postData, setPostData] = useState<Post>()

  useEffect(() => {
    async function fetchPostData() {
      const { data, error } = await supabaseClient
        .from("posts")
        .select("*")
        .match({
          id,
        })
        .maybeSingle()

      if (data) {
        if (data.creatorID === user?.id) {
          setPostData(data)
        }
      } else {
        router.replace("/home")
      }
    }

    fetchPostData()
  }, [])

  if (postData) {
    return (
      <div className="flex flex-col gap-5 items-center justify-center m-5">
        <h3 className="font-extrabold text-3xl">Edit Post</h3>
        <PostForm
          isDraft={false}
          postData={postData}
          onSubmit={(formData) => editPost(formData)}
        />
      </div>
    )
  }

  return <p>Loading...</p>
}
