"use client"

import { PostActions } from "@/components/PostActions"
import { type Post } from "@/types/Post"
import { convertTimestamp } from "@/utils/convertTimestamp"
import { deletePost } from "@/actions/deletePost"
import { useEffect, useState } from "react"
import { supabaseClient } from "@/utils/supabase/client"
import { Badge } from "@/components/ui/Badge"
import { toggleFavorite } from "@/actions/toggleFavorite"

type Props = {
  postData: Post
  userID?: string
}

export function Post({ postData, userID }: Props) {
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
      .from("post")
      .getPublicUrl(postData.id)

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
      await toggleFavorite(userID, postData.id, isFavorite)
      setIsFavorite(!isFavorite)
    }
  }

  if (isActive) {
    return (
      <div className="flex items-center justify-center m-5">
        <div className="space-y-5 w-96 sm:w-[525px] md:w-[625px] lg:w-[750px]">
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

          <h3 className="font-extrabold text-3xl">{postData.title}</h3>

          <Badge
            className={
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
