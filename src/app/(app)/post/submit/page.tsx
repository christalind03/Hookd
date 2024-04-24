"use client"

import { PostForm } from "@/components/Forms/PostForm"
import { submitPost } from "@/actions/submitPost"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/UserProvider"

export default function SubmitPost() {
  const router = useRouter()
  const user = useUser()

  if (user) {
    return (
      <div className="flex flex-col gap-5 items-center justify-center m-10">
        <h3 className="font-extrabold text-3xl">Submit Post</h3>
        <PostForm onSubmit={(formData) => submitPost(user.id, formData)} />
      </div>
    )
  }

  router.replace("/home")
}
