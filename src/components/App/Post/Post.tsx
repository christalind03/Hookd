"use client"

// Business Logic
import { type Post } from "@/types/Post"
import { convertTimestamp } from "@/utils/convertTimestamp"
import { deletePost, savePost } from "@/actions/postActions"
import { supabaseClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/useToast"

// UI Components
import { Badge } from "@/components/ui/Badge"
import { PostActions } from "@/components/App/Post/PostActions"
import { ToastAction } from "@/components/ui/Toast"

type Props = {
  postData: Post
  userID?: string
}

export function Post({ postData, userID }: Props) {
  const appRouter = useRouter()
  const [imageURL, setImageURL] = useState<string>("")
  const [isActive, setIsActive] = useState<boolean>(true)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchFavorite() {
      if (userID) {
        const { data, error } = await supabaseClient
          .from("savedPosts")
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

  async function onSave() {
    if (userID) {
      await savePost(userID, postData.id, isFavorite)
      setIsFavorite(!isFavorite)

      if (!isFavorite) {
        toast({
          title: "💖 Post Saved!",
          description: "Post saved successfully!",
          action: (
            <ToastAction
              altText="View"
              onClick={() => appRouter.push("/saved")}
            >
              View
            </ToastAction>
          ),
        })
      } else {
        toast({
          title: "💔 Post Unsaved",
          description: "Post unsaved successfully.",
          action: (
            <ToastAction
              altText="Undo"
              onClick={() => {
                setIsFavorite(true)
              }}
            >
              Undo
            </ToastAction>
          ),
        })
      }
    }
  }

  if (isActive) {
    return (
      <div className="flex items-center justify-center m-5">
        <div className="space-y-5 w-96 sm:w-[525px] md:w-[625px] lg:w-[725px]">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-[10px]">
              {convertTimestamp(postData.creationTimestamp)}
            </p>

            <PostActions
              postID={postData.id}
              isAuthor={postData.creatorID === userID}
              isFavorite={isFavorite}
              onDelete={() => onDelete()}
              onSave={() => onSave()}
            />
          </div>

          <h3 className="font-extrabold text-3xl">{postData.title}</h3>

          <div className="flex flex-wrap gap-3">
            <Badge
              className={
                postData.projectDifficulty === "Beginner"
                  ? "hover:bg-green-300 bg-green-300 text-green-700"
                  : postData.projectDifficulty === "Intermediate"
                  ? "hover:bg-yellow-300 bg-yellow-300 text-yellow-700"
                  : "hover:bg-red-300 bg-red-300 text-red-700"
              }
            >
              {postData.projectDifficulty}
            </Badge>

            <Badge>{postData.projectType}</Badge>
          </div>

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
