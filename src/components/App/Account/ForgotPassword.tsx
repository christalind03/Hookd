"use client"

// Business Logic
import { type Error, isError } from "@/types/Error"
import { requestResetPassword } from "@/actions/authActions"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// UI Components
import { Button } from "@/components/ui/Button"
import { DisplayError } from "@/components/DisplayError"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form"
import { Fragment } from "react"
import { Input } from "@/components/ui/Input"

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
})

export function ForgotPassword() {
  const [error, setError] = useState<Error>()
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const formHook = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(formValues: z.infer<typeof formSchema>) {
    const serverResponse = await requestResetPassword(formValues.email)

    if (isError(serverResponse)) {
      setError(serverResponse)
      return
    }

    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <Fragment>
        <h3 className="font-extrabold text-3xl text-center">Request Sent!</h3>
        <p className="mb-3 text-sm text-pretty w-96">
          An email has been sent to{" "}
          <span className="text-blue-500">{formHook.getValues("email")}</span>{" "}
          with a link to reset your password.
        </p>
      </Fragment>
    )
  }
  return (
    <Fragment>
      <h3 className="font-extrabold text-3xl text-center">Forgot Password?</h3>
      <p className="mb-3 text-sm text-pretty w-96">
        Enter the email address associated with your account and we&apos;ll send you
        a link to reset your password.
      </p>

      <Form {...formHook}>
        <form
          className="flex flex-col gap-3 w-96"
          onSubmit={formHook.handleSubmit(onSubmit)}
        >
          {error && <DisplayError error={error} />}

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
  )
}
