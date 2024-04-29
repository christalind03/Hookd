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
import { useCallback, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { TextEditor } from "@/components/TextEditor/TextEditor"
import { supabaseClient } from "@/utils/supabase/client"
import { type Post, isPost } from "@/types/Post"
import { UploadIcon } from "@radix-ui/react-icons"
import { v4 } from "uuid"
import debounce from "lodash.debounce"
import { saveDraft } from "@/actions/saveDraft"
import { type Draft, isDraft } from "@/types/Draft"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { useToast } from "@/components/ui/useToast"

type Props = {
  isPosted?: boolean
  postData?: Draft | Post
  onSubmit: (formData: FormData) => Promise<Error | void>
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title cannot be empty.",
  }),
  content: z
    .string()
    .refine(
      (content) =>
        content.trim() !== "" && content.trim() !== '<p class="text-sm"></p>',
      {
        message: "Description cannot be empty.",
      }
    ),
  difficulty: z.string().min(1, {
    message: "Difficulty cannot be empty",
  }),
  productImage: z.instanceof(Blob, {
    message: "Image cannot be empty.",
  }),
})

export function PostForm({ isPosted = false, postData, onSubmit }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [error, setError] = useState<Error>()
  const [postID, setPostID] = useState<string>(postData?.id || v4())
  const [isReady, setIsReady] = useState(false)

  const formHook = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      title: postData?.title || "",
      content: postData?.content || "",
      difficulty: postData?.difficulty || "",
      productImage: undefined,
    },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  })

  const debounceDraft = useCallback(
    debounce(() => {
      if (!isPosted) {
        const zodData = formHook.getValues()
        const formData = new FormData()

        formData.append("id", postID)
        formData.append("title", zodData.title)
        formData.append("content", zodData.content)
        formData.append("difficulty", zodData.difficulty)
        formData.append("productImage", zodData.productImage || "")

        saveDraft(formData)

        toast({
          title: "🎉 Autosave Complete",
          description: "Changes saved successfully.",
        })
      }
    }, 1500),
    []
  )

  useEffect(() => {
    async function fetchImage() {
      if (isDraft(postData) && postData.hasImage) {
        const { data, error } = await supabaseClient.storage
          .from("drafts")
          .download(`${postData.id}?burst=${Date.now()}`)

        if (data) {
          formHook.setValue("productImage", data)
        }
      }

      if (isPost(postData)) {
        const { data, error } = await supabaseClient.storage
          .from("posts")
          .download(`${postData.id}?burst=${Date.now()}`)

        if (data) {
          formHook.setValue("productImage", data)
        }
      }
    }

    fetchImage()
  }, [])

  async function handleSubmit(zodData: z.infer<typeof formSchema>) {
    const formData = new FormData()

    formData.append("id", postID)
    formData.append("title", zodData.title)
    formData.append("content", zodData.content)
    formData.append("difficulty", zodData.difficulty)
    formData.append("productImage", zodData.productImage || "")

    const serverResponse = await onSubmit(formData)

    if (isError(serverResponse)) {
      setError(serverResponse)
      return
    }

    router.push("/home")
    return
  }

  function uploadImage() {
    document.getElementById("fileUpload")?.click()
  }

  return (
    <Form {...formHook}>
      <form
        className="flex flex-col space-y-5 w-full sm:w-[525px] md:w-[625px] lg:w-[750px]"
        onChange={() => debounceDraft()}
        onSubmit={(formData) => formHook.handleSubmit(handleSubmit)(formData)}
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
              <FormMessage />

              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={formHook.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormMessage />

              <FormControl>
                <TextEditor
                  content={field.value}
                  onChange={(editorContent) => {
                    field.onChange(editorContent)
                    debounceDraft()
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={formHook.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <FormMessage />

              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>

                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Difficulty" />
                  </SelectTrigger>
                </FormControl>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={formHook.control}
          name="productImage"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Product Image</FormLabel>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      onChange(undefined)
                      debounceDraft()
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => uploadImage()}
                  >
                    Upload Image
                  </Button>
                </div>
              </div>

              <FormMessage />

              <FormControl>
                <Input
                  id="fileUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    if (event.target.files && event.target.files[0]) {
                      onChange(event.target.files && event.target.files[0])
                    }
                  }}
                  {...fieldProps}
                />
              </FormControl>

              {value ? (
                <img
                  alt="Product Image"
                  src={URL.createObjectURL(value)}
                  className="rounded-md"
                  onClick={() => uploadImage()}
                />
              ) : (
                <div
                  className="bg-secondary flex flex-col gap-3 h-80 items-center justify-center rounded-md"
                  onClick={() => uploadImage()}
                >
                  <UploadIcon className="size-12" />
                  <p>Upload Image</p>
                </div>
              )}
            </FormItem>
          )}
        />

        <Button className="ml-auto" type="submit">
          Submit Post
        </Button>
      </form>
    </Form>
  )
}
