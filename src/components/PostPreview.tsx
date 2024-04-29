"use client"

import { type Post } from "@/types/Post"
import { PostActions } from "@/components/PostActions"
import { convertTimestamp } from "@/utils/convertTimestamp"

import { deletePost } from "@/actions/deletePost"
import { useEffect, useState } from "react"
import Link from "next/link"
import { supabaseClient } from "@/utils/supabase/client"
import { Badge } from "@/components/ui/Badge"

type Props = {
  postData: Post
  userID?: string
}

export function PostPreview({ postData, userID }: Props) {
  const [imageURL, setImageURL] = useState("")
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const { data } = supabaseClient.storage
      .from("posts")
      .getPublicUrl(`${postData.id}?burst=${Date.now()}`)

    setImageURL(data.publicUrl)
  }, [])

  async function onDelete() {
    if (postData) {
      await deletePost(postData.id)
      setIsActive(false)
    }
  }

  if (isActive) {
    return (
      <Link className="p-3 rounded-md space-y-3 hover:bg-accent" href={`/post/${postData.id}`}>
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
        
        <Badge
          className={"grow-0" &&
            postData.difficulty === "Beginner"
              ? "hover:bg-green-300 bg-green-300 text-green-700"
              : postData.difficulty === "Intermediate"
              ? "hover:bg-yellow-300 bg-yellow-300 text-yellow-700"
              : "hover:bg-red-300 bg-red-300 text-red-700"
          }
        >
          {postData.difficulty}
        </Badge>

        {imageURL && <img className="rounded-md" src={imageURL} />}
        
      </Link>
    )
  }

  return (
    <div className="space-y-3">
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
