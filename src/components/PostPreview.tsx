"use client"

import { type Post } from "@/types/Post"
import { PostActions } from "@/components/PostActions"
import { convertTimestamp } from "@/utils/convertTimestamp"

import { deletePost } from "@/actions/deletePost"
import { useEffect, useState } from "react"
import Link from "next/link"
import { supabaseClient } from "@/utils/supabase/client"

type Props = {
  postData: Post
  userID?: string
}

export function PostPreview({ postData, userID }: Props) {
  const [imageURL, setImageURL] = useState("")
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (postData.hasImage) {
      const { data } = supabaseClient.storage
        .from("posts")
        .getPublicUrl(`${postData.id}?burst=${Date.now()}`)

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
      <Link className="flex flex-col gap-3" href={`/post/${postData.id}`}>
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

        <h3 className="font-bold text-lg">{postData.title}</h3>
        {imageURL && <img className="rounded-md" src={imageURL} />}
        <div dangerouslySetInnerHTML={{ __html: postData.content }} />
      </Link>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-[10px]">Date Unavailable</p>
      </div>

      <h3 className="font-bold text-lg">{"[removed]"}</h3>
      <p className="line-clamp-5 text-sm">
        Refresh the page to see the latest changes.
      </p>
    </div>
  )
}
