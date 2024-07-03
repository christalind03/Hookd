export type User = {
  id: string
  email: string
  username: string
  biography: string
  userRole: string
}

export function isUser(obj: any): obj is User {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.email === "string" &&
    typeof obj.username === "string" &&
    typeof obj.biography === "string" &&
    typeof obj.userRole === "string"
  )
}