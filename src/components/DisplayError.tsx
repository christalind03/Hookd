// Business Logic
import { type Error } from "@/types/Error"

// UI Components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

type Props = {
  error: Error
}

export function DisplayError({ error }: Props) {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon />

      <AlertTitle>Error {error.status}</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )
}
