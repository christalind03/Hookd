export type Draft = {
  id: string
  title: string
  content: string
  difficulty: string
  postTags: string[]
  hasImage: boolean
  creatorID: string
  lastEdit: string
}

export function isDraft(obj: any): obj is Draft {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.content === "string" &&
    typeof obj.difficulty === "string" &&
    typeof obj.hasImage === "boolean" &&
    typeof obj.creatorID === "string" &&
    typeof obj.lastEdit === "string" &&
    Array.isArray(obj.postTags) &&
    obj.postTags.every((tagName: any) => typeof tagName === "string")
  )
}
