export type Post = {
  id: string
  title: string
  content: string
  projectDifficulty: string
  projectType: string
  creatorID: string
  creationTimestamp: string
}

export function isPost(obj: any): obj is Post {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.content === "string" &&
    typeof obj.projectDifficulty === "string" &&
    typeof obj.projectType === "string" &&
    typeof obj.creatorID === "string" &&
    typeof obj.creationTimestamp === "string"
  )
}
