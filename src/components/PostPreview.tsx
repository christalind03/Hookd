"use client"

import { type Post } from "@/types/Post"
import { PostActions } from "@/components/PostActions"
import { convertTimestamp } from "@/utils/convertTimestamp"

import { deletePost } from "@/actions/deletePost"
import { useEffect, useState } from "react"
import Link from "next/link"
import { supabaseClient } from "@/utils/supabase/client"
import { Badge } from "@/components/ui/Badge"
import { toggleSave } from "@/actions/toggleSave"

type Props = {
  postData: Post
  userID?: string
}

export function PostPreview({ postData, userID }: Props) {
  const [imageURL, setImageURL] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    async function fetchFavorite() {
      if (userID) {
        const { data, error } = await supabaseClient
          .from("savedPost")
          .select("*")
          .match({
            userID,
            postID: postData.id,
          })
          .maybeSingle()

        if (data) {
          setIsFavorite(true)
        }
      }
    }

    const { data } = supabaseClient.storage
      .from("posts")
      .getPublicUrl(`${postData.id}?burst=${Date.now()}`)

    setImageURL(data.publicUrl)
    fetchFavorite()
  }, [])

  async function onDelete() {
    if (postData) {
      await deletePost(postData.id)
      setIsActive(false)
    }
  }

  async function onFavorite() {
    if (userID) {
      await toggleSave(userID, postData.id, isFavorite)
      setIsFavorite(!isFavorite)
    }
  }

  if (isActive) {
    return (
      <Link
        className="flex flex-col gap-3 p-3 rounded-md hover:bg-accent"
        href={`/post/${postData.id}`}
      >
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-[10px]">
            {convertTimestamp(postData.creationTimestamp)}
          </p>

          <PostActions
            postID={postData.id}
            isAuthor={postData.creatorID === userID}
            isFavorite={isFavorite}
            onDelete={() => onDelete()}
            onFavorite={() => onFavorite()}
          />
        </div>

        <h3 className="font-bold text-lg">{postData.title}</h3>

        <div className="flex flex-wrap gap-3">
          <Badge
            className={
              postData.projectDifficulty === "Beginner"
                ? "bg-green-300 text-green-700"
                : postData.projectDifficulty === "Intermediate"
                ? "bg-yellow-300 text-yellow-700"
                : "bg-red-300 text-red-700"
            }
          >
            {postData.projectDifficulty}
          </Badge>

          <Badge>{postData.projectType}</Badge>
        </div>

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
