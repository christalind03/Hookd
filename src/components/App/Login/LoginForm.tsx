"use client"

// Business Logic
import { type Error, isError } from "@/types/Error"
import { logIn } from "@/actions/authActions"
import { useForm } from "react-hook-form"
import { LegacyRef, RefObject, useRef, useState } from "react"
import { useRouter } from "next/navigation"
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
import HCaptcha from "@hcaptcha/react-hcaptcha"
import { Input } from "@/components/ui/Input"
import Link from "next/link"
import { Loading } from "@/components/Loading"

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(1, {
    message: "Password cannot be empty.",
  }),
})

export function LoginForm() {
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const formHook = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  })
  
  const router = useRouter()
  const captchaField = useRef<HCaptcha>(null)
  const [captchaToken, setCaptchaToken] = useState<string>("")

  async function onSubmit(formValues: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const formData = new FormData()

    for (const [formProperty, formValue] of Object.entries(formValues)) {
      formData.append(formProperty, formValue)
    }

    const serverResponse = await logIn(formData, captchaToken)
    captchaField.current?.resetCaptcha()

    if (isError(serverResponse)) {
      setError(serverResponse)
      setIsLoading(false)
      
      return
    }

    router.push("/home")
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <Form {...formHook}>
      <form
        className="flex flex-col gap-3 max-w-[19rem] w-full"
        onSubmit={formHook.handleSubmit(onSubmit)}
      >
        {error && <DisplayError error={error} />}

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
          name="password"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>

              <div className="flex items-center justify-between">
                <FormMessage className="text-xs" />
                <Link
                  className="ml-auto text-xs hover:text-blue-500 hover:underline"
                  href="/account/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-center mt-5">
          <HCaptcha
            ref={captchaField}
            sitekey="c71e0450-3290-48b0-9866-f2d4a75057a8"
            onVerify={(token) => {
              setCaptchaToken(token)
            }}
          />
        </div>

        <Button className="mt-1" type="submit">
          Log In
        </Button>
      </form>
    </Form>
  )
}
