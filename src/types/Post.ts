export type Post = {
  id: string
  title: string
  description: string
  notes: string
  creatorID: string
  creationTime: string
}

export function isPost(obj: any): obj is Post {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.description === "string" &&
    typeof obj.notes === "string" &&
    typeof obj.creatorID === "string" &&
    typeof obj.creationTime === "string"
  )
}
