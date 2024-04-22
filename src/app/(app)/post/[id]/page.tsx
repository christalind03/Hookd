import { PostActions } from "@/components/PostActions"
import { convertTimestamp } from "@/utils/convertTimestamp"
import { createClient } from "@/utils/supabase/server"

type Props = {
  params: {
    id: string
  }
}

export default async function Post({ params: { id } }: Props) {
  const supabaseClient = await createClient()

  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  const { data, error } = await supabaseClient
    .from("post")
    .select("*")
    .match({
      id,
    })
    .single()

  if (data) {
    return (
      <div className="flex items-center justify-center m-10">
        <div className="flex flex-col gap-5 w-96 sm:w-[525px] md:w-[625px] lg:w-[750px]">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-[10px]">
              {convertTimestamp(data.creationTimestamp)}
            </p>

            <PostActions isAuthor={data.creatorID === user?.id} />
          </div>

          <h3 className="font-extrabold text-3xl">{data.title}</h3>
          <p>{data.description}</p>
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
