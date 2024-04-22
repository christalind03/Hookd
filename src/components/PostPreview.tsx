import { type Post } from "@/types/Post"
import { PostActions } from "@/components/PostActions"
import { convertTimestamp } from "@/utils/convertTimestamp"

type Props = {
  postData: Post
  userID: string
}

export function PostPreview({ postData, userID }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-[10px]">
          {convertTimestamp(postData.creationTimestamp)}
        </p>

        <PostActions isAuthor={postData.creatorID === userID} />
      </div>

      <h3 className="font-bold text-lg">{postData.title}</h3>
      <p className="line-clamp-5 text-sm">{postData.description}</p>
    </div>
  )
}
