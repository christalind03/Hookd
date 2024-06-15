"use client"

// Business Logic
import { type Error, isError } from "@/types/Error"
import { resetPassword } from "@/actions/authActions"
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
import Link from "next/link"

const formSchema = z
  .object({
    password: z.string().min(6, {
      message: "Password must have a minimum of 6 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((formValues) => formValues.password === formValues.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export function ResetPassword() {
  const [error, setError] = useState<Error>()
  const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false)
  const formHook = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema)
  })

  async function onSubmit(formValues: z.infer<typeof formSchema>) {
    const serverResponse = await resetPassword(formValues.password)

    if (isError(serverResponse)) {
      setError(serverResponse)
      return
    }

    setIsPasswordReset(true)
  }

  return (
    <Fragment>
      <h3 className="font-extrabold text-3xl text-center">Reset Password</h3>

      {isPasswordReset ? (
        <div className="flex flex-col gap-3 items-center justify-center text-sm text-pretty w-96">
          <p>Your password has been reset.</p>

          <Link
            className="font-bold hover:text-blue-500 hover:underline"
            href="/home"
          >
            Return to Home
          </Link>
        </div>
      ) : (
        <Fragment>
          <p className="mb-3 text-sm text-pretty w-96">
            Enter a new password in the field below, then retype it for confirmation.
          </p>

          <Form {...formHook}>
            <form
              className="flex flex-col gap-3 w-96"
              onSubmit={formHook.handleSubmit(onSubmit)}
            > 
              {error && <DisplayError error={error} />}

              <FormField
                  control={formHook.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formHook.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Confirm Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                <Button type="submit">Reset Password</Button>
            </form>
          </Form>
        </Fragment>
      )}
    </Fragment>
  )
}
