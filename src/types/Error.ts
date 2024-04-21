export type Error = {
  status: number
  message: string
}

export function isError(obj: any): obj is Error {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.status === "number" &&
    typeof obj.message === "string"
  )
}
