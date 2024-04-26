"use client"

import { supabaseClient } from "@/utils/supabase/client"
import { PostPreview } from "@/components/PostPreview"
import { Separator } from "@/components/ui/Separator"
import { useEffect, useState } from "react"
import { type Post } from "@/types/Post"
import { useUser } from "@/components/UserProvider"

export default function Home() {
  const user = useUser()
  const [posts, setPosts] = useState<Post[]>()

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabaseClient
        .from("posts")
        .select("*")
        .order("creationTimestamp", { ascending: false })

      if (data) {
        setPosts(data)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="flex flex-col gap-5 items-center justify-center m-5">
      {posts ? (
        posts.length > 0 ? (
          posts.map((postData, postIndex) => (
            <div
              className="flex flex-col gap-5 sm:w-[525px] md:w-[625px] lg:w-[750px]"
              key={postData.id}
            >
              {!!postIndex && <Separator />}
              <PostPreview postData={postData} userID={user?.id || ""} />
            </div>
          ))
        ) : (
          <p>Nothing to display...</p>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
