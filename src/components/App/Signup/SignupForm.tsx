"use client"

// Business Logic
import { type Error, isError } from "@/types/Error"
import { signUp } from "@/actions/authActions"
import { useForm } from "react-hook-form"
import { useRef, useState } from "react"
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
import { Loading } from "@/components/Loading"

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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const formHook = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
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

    const serverResponse = await signUp(formData, captchaToken)
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

              <FormMessage className="text-xs" />
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
          Sign Up
        </Button>
      </form>
    </Form>
  )
}
