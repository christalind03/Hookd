"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { Button } from "@/components/ui/Button"
import { ExclamationTriangleIcon, PlusIcon } from "@radix-ui/react-icons"
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
import { useFieldArray, useForm } from "react-hook-form"
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
import { Label } from "../ui/Label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command"
import { projectTypes } from "@/constants/projectTypes"
import { Badge } from "@/components/ui/Badge"
import { projectDifficulties } from "@/constants/projectDifficulties"

type Props = {
  isEdit?: boolean
  postData?: Draft | Post
  onSubmit: (formData: FormData) => Promise<Error | void>
}

const formSchema = z.object({
  id: z.string(),
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
  projectDifficulty: z.string().min(1, {
    message: "Difficulty cannot be empty.",
  }),
  projectType: z.string().min(1, {
    message: "Type cannot be empty.",
  }),
  postImage: z.instanceof(Blob, {
    message: "Image cannot be empty.",
  }),
})

export function PostForm({ isEdit = false, postData, onSubmit }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [error, setError] = useState<Error>()

  const formHook = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      id: postData?.id || v4(),
      title: postData?.title || "",
      content: postData?.content || "",
      projectDifficulty: postData?.projectDifficulty || "",
      projectType: postData?.projectType || "",
      postImage: undefined,
    },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  })

  const debounceDraft = useCallback(
    debounce(() => {
      if (!isEdit) {
        const formData = new FormData()
        const formValues = formHook.getValues()

        for (const [formProperty, formValue] of Object.entries(formValues)) {
          Array.isArray(formValue)
            ? formData.append(formProperty, JSON.stringify(formValue))
            : formData.append(formProperty, formValue)
        }

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
          formHook.setValue("postImage", data)
        }

        console.log(data, error)
      }

      if (isPost(postData)) {
        const { data, error } = await supabaseClient.storage
          .from("posts")
          .download(`${postData.id}?burst=${Date.now()}`)

        if (data) {
          formHook.setValue("postImage", data)
        }

        console.log(data, error)
      }
    }

    fetchImage()
  }, [])

  async function handleSubmit(formValues: z.infer<typeof formSchema>) {
    const formData = new FormData()

    for (const [formProperty, formValue] of Object.entries(formValues)) {
      Array.isArray(formValue)
        ? formData.append(formProperty, JSON.stringify(formValue))
        : formData.append(formProperty, formValue)
    }

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
        className="flex flex-col space-y-5 w-full sm:w-[525px] md:w-[625px] lg:w-[725px]"
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
          name="postImage"
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

        <FormField
          control={formHook.control}
          name="projectDifficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Difficulty</FormLabel>
              <FormMessage />

              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <SelectContent>
                  {projectDifficulties.map((projectDifficulty) => (
                    <SelectItem key={projectDifficulty} value={projectDifficulty}>
                      {projectDifficulty}
                    </SelectItem>
                  ))}
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
          name="projectType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Type</FormLabel>
              <FormMessage />

              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <SelectContent>
                  {projectTypes.map((projectType) => (
                    <SelectItem key={projectType} value={projectType}>
                      {projectType}
                    </SelectItem>
                  ))}
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

        <Button className="ml-auto" type="submit">
          Submit Post
        </Button>
      </form>
    </Form>
  )
}
