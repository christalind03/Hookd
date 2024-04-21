export type Post = {
  postID: string
  title: string
  description: string
  notes: string
}

export function isPost(obj: any): obj is Post {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.postID === "string" &&
    typeof obj.title === "string" &&
    typeof obj.description === "string" &&
    typeof obj.notes === "string"
  )
}
