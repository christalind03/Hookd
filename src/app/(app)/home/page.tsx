import { createClient } from "@/utils/supabase/server"
import { PostPreview } from "@/components/PostPreview"
import { Separator } from "@/components/ui/Separator"

export default async function Home() {
  const supabaseClient = await createClient()

  const { data, error } = await supabaseClient.from("post").select("*")

  return (
    <div className="flex flex-col gap-5 items-center justify-center m-10">
      {data?.map((postData, postIndex) => (
        <div
          className="flex flex-col gap-5 w-96 sm:w-[525px] md:w-[625px] lg:w-[750px]"
          key={postData.postID}
        >
          {!!postIndex && <Separator />}
          <PostPreview postData={postData} />
        </div>
      ))}
    </div>
  )
}
