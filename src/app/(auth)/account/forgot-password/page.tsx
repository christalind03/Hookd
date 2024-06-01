"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { Fragment, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/Button"
import { isError, type Error } from "@/types/Error"
import { requestReset } from "@/actions/resetPassword"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
})

export default function ForgotPassword() {
  const [error, setError] = useState<Error>()
  const [isRequestSent, setIsRequestSent] = useState(false)
  const formHook = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(formValues: z.infer<typeof formSchema>) {
    const serverResponse = await requestReset(formValues.email)

    if (isError(serverResponse)) {
      setError(serverResponse)
      return
    }

    setIsRequestSent(true)
  }

  return (
    <div className="flex h-screen items-center justify-center mx-5">
      <div className="flex flex-col gap-3 items-center justify-center max-sm:w-[305px] md:border md:p-12 md:rounded-md md:shadow">
        {isRequestSent ? (
          <Fragment>
            <h3 className="font-extrabold text-3xl text-center">
              Request Sent
            </h3>
            <p className="mb-3 text-sm text-pretty w-96">
              An email has been sent to{" "}
              <span className="text-blue-500">
                {formHook.getValues("email")}
              </span>{" "}
              with a link to reset your password.
            </p>
          </Fragment>
        ) : (
          <Fragment>
            <h3 className="font-extrabold text-3xl text-center">
              Forgot Password?
            </h3>
            <p className="mb-3 text-sm text-pretty w-96">
              Enter the email address associated with your account and we'll
              send you a link to reset your password.
            </p>

            <Form {...formHook}>
              <form
                className="flex flex-col gap-3 w-96"
                onSubmit={formHook.handleSubmit(onSubmit)}
              >
                {error && (
                  <Alert variant="destructive">
                    <ExclamationTriangleIcon />

                    <AlertTitle>Error {error.status}</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={formHook.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="example@domain.com" {...field} />
                      </FormControl>

                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                <Button type="submit">Send</Button>
              </form>
            </Form>
          </Fragment>
        )}
      </div>
    </div>
  )
}
