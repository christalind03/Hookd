"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { Button } from "@/components/ui/Button"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"

import { type Error, isError } from "@/types/Error"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useUser } from "@/components/UserProvider"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { TextEditor } from "../TextEditor/TextEditor"

type Props = {
  initialTitle?: string
  initialContent?: string
  onSubmit: (formData: {
    title: string
    content: string
  }) => Promise<Error | void>
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title cannot be empty.",
  }),
  content: z
    .string()
    .refine(
      (content) => content.trim() !== "" && content.trim() !== "<p></p>",
      {
        message: "Description cannot be empty.",
      }
    ),
})

export function PostForm({ initialTitle, initialContent, onSubmit }: Props) {
  const [error, setError] = useState<Error>()
  const formHook = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      title: initialTitle ? initialTitle : "",
      content: initialContent ? initialContent : "",
    },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  })

  const router = useRouter()
  const user = useUser()

  async function handleSubmit(formData: z.infer<typeof formSchema>) {
    if (user) {
      const serverResponse = await onSubmit(formData)

      if (isError(serverResponse)) {
        setError(serverResponse)
        return
      }

      router.push("/home")
      return
    }

    setError({
      status: "400",
      message: "User not authenticated.",
    })
  }

  return (
    <Form {...formHook}>
      <form
        className="flex flex-col gap-5 w-96 sm:w-[525px] md:w-[625px] lg:w-[750px]"
        onSubmit={formHook.handleSubmit(handleSubmit)}
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>

              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formHook.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>

              <FormControl>
                <TextEditor content={field.value} onChange={field.onChange} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit Post</Button>
      </form>
    </Form>
  )
}
