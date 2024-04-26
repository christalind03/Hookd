"use client"

import { PostActions } from "@/components/PostActions"
import { type Post } from "@/types/Post"
import { convertTimestamp } from "@/utils/convertTimestamp"
import { deletePost } from "@/actions/deletePost"
import { useEffect, useState } from "react"
import { supabaseClient } from "@/utils/supabase/client"

type Props = {
  postData: Post
  userID?: string
}

export function Post({ postData, userID }: Props) {
  const [imageURL, setImageURL] = useState("")
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (postData.hasImage) {
      const { data } = supabaseClient.storage
        .from("posts")
        .getPublicUrl(postData.id)

      setImageURL(data.publicUrl)
    }
  }, [])

  async function onDelete() {
    if (postData) {
      await deletePost(postData.id)
      setIsActive(false)
    }
  }

  if (isActive) {
    return (
      <div className="flex items-center justify-center m-10">
        <div className="flex flex-col gap-5 w-96 sm:w-[525px] md:w-[625px] lg:w-[750px]">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-[10px]">
              {convertTimestamp(postData.creationTimestamp)}
            </p>

            <PostActions
              id={postData.id}
              isAuthor={postData.creatorID === userID}
              onDelete={onDelete}
            />
          </div>

          <h3 className="font-extrabold text-3xl">{postData.title}</h3>
          {imageURL && <img className="rounded-md" src={imageURL} />}
          <div dangerouslySetInnerHTML={{ __html: postData.content }} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 items-center justify-center m-10">
      <h3 className="font-extrabold text-3xl">Uh oh!</h3>

      <div className="text-center">
        <p>This page doesn't exist.</p>
        <p>Try searching for something else.</p>
      </div>
    </div>
  )
}
