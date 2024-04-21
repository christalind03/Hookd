export type Error = {
  status: string
  message: string
}

export function isError(obj: any): obj is Error {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.status === "string" &&
    typeof obj.message === "string"
  )
}
