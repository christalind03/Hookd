"use client"

import { PostActions } from "@/components/PostActions"
import { type Post } from "@/types/Post"
import { convertTimestamp } from "@/utils/convertTimestamp"
import { deletePost } from "@/actions/deletePost"
import { useState } from "react"

type Props = {
  postData: Post | undefined
  userID: string | undefined
}

export function Post({ postData, userID }: Props) {
  const [isActive, setIsActive] = useState(true)

  async function onDelete() {
    if (postData) {
      await deletePost(postData.id)
      setIsActive(false)
    }
  }

  if (isActive && postData) {
    return (
      <div className="flex items-center justify-center m-10">
        <div className="flex flex-col gap-5 w-96 sm:w-[525px] md:w-[625px] lg:w-[750px]">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-[10px]">
              {convertTimestamp(postData.creationTimestamp)}
            </p>

            <PostActions
              isAuthor={postData.creatorID === userID}
              onDelete={onDelete}
            />
          </div>

          <h3 className="font-extrabold text-3xl">{postData.title}</h3>
          <p>{postData.description}</p>
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
