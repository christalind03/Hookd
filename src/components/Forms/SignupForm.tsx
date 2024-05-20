"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { Button } from "@/components/ui/Button"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"

import { type Error, isError } from "@/types/Error"
import { signUp } from "@/actions/signUp"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const formSchema = z
  .object({
    email: z.string().email({
      message: "Invalid email address.",
    }),
    username: z.string().min(3, {
      message: "Username must have a minimum of 3 characters.",
    }),
    password: z.string().min(6, {
      message: "Password must have a minimum of 6 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((formValues) => formValues.password === formValues.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export function SignupForm() {
  const [error, setError] = useState<Error>()
  const formHook = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  })

  const router = useRouter()

  async function onSubmit(formValues: z.infer<typeof formSchema>) {
    const formData = new FormData()

    for (const [formProperty, formValue] of Object.entries(formValues)) {
      formData.append(formProperty, formValue)
    }

    const serverResponse = await signUp(formData)

    if (isError(serverResponse)) {
      setError(serverResponse)
      return
    }

    router.push("/home")
  }

  return (
    <Form {...formHook}>
      <form
        className="flex flex-col gap-3 max-w-96 w-full"
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
                <Input placeholder="Email" {...field} />
              </FormControl>

              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        
        <FormField
          control={formHook.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>

              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={formHook.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>

              <FormMessage className="text-xs" />
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

              <FormMessage className="text-xs"/>
            </FormItem>
          )}
        />

        <Button className="mt-3" type="submit">
          Sign Up
        </Button>
      </form>
    </Form>
  )
}
