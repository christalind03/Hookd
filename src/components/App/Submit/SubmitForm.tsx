"use client"

// Business Logic
import { type Error, isError } from "@/types/Error"
import { type Draft, isDraft } from "@/types/Draft"
import { type Post, isPost } from "@/types/Post"
import debounce from "lodash.debounce"
import { projectDifficulties } from "@/constants/projectDifficulties"
import { projectTypes } from "@/constants/projectTypes"
import { saveDraft } from "@/actions/draftActions"
import { supabaseClient } from "@/utils/supabase/client"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/useToast"
import { v4 } from "uuid"
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
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Editor } from "@/components/App/Submit/Editor/Editor"
import { UploadIcon } from "@radix-ui/react-icons"

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

export function SubmitForm({ isEdit = false, postData, onSubmit }: Props) {
  const appRouter = useRouter()
  const { toast } = useToast()
  const [error, setError] = useState<Error>()
  const [isSaving, setIsSaving] = useState<boolean>(false)

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

  const debounceDraft = useMemo(
    () =>
      debounce(async () => {
        const formData = new FormData()
        const formValues = formHook.getValues()

        for (const [formProperty, formValue] of Object.entries(formValues)) {
          Array.isArray(formValue)
            ? formData.append(formProperty, JSON.stringify(formValue))
            : formData.append(formProperty, formValue)
        }

        await saveDraft(formData)

        setIsSaving(false)

        toast({
          title: "🎉 Autosave Complete",
          description: "Changes saved successfully.",
        })
      }, 1500),
    [formHook, toast]
  )

  const updateDraft = useCallback(() => {
    if (!isEdit) {
      if (!isSaving) {
        setIsSaving(true)
      }

      debounceDraft()
    }
  }, [debounceDraft, isEdit, isSaving])

  useEffect(() => {
    async function fetchImage() {
      if (isDraft(postData) && postData.hasImage) {
        const { data, error } = await supabaseClient.storage
          .from("drafts")
          .download(`${postData.id}?burst=${Date.now()}`)

        if (data) {
          formHook.setValue("postImage", data)
        }
      }

      if (isPost(postData)) {
        const { data, error } = await supabaseClient.storage
          .from("posts")
          .download(`${postData.id}?burst=${Date.now()}`)

        if (data) {
          formHook.setValue("postImage", data)
        }
      }
    }

    fetchImage()
  }, [formHook, postData])

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

    appRouter.push("/home")
    return
  }

  function uploadImage() {
    document.getElementById("fileUpload")?.click()
  }

  return (
    <Form {...formHook}>
      <form
        className="flex flex-col space-y-5 w-full sm:w-[525px] md:w-[625px] lg:w-[725px]"
        onChange={() => updateDraft()}
        onSubmit={(formData) => formHook.handleSubmit(handleSubmit)(formData)}
      >
        {error && <DisplayError error={error} />}

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
                <Editor
                  content={field.value}
                  onChange={(editorContent) => {
                    field.onChange(editorContent)
                    updateDraft()
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
                    <SelectItem
                      key={projectDifficulty}
                      value={projectDifficulty}
                    >
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

        {/* {isSaving ? (
          <Button className="ml-auto" type="submit" disabled>
            Saving...
          </Button>
        ) : (
          <Button className="ml-auto" type="submit">
            Submit Post
          </Button>
        )} */}

        <Button className="ml-auto" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Submit Post"}
        </Button>
      </form>
    </Form>
  )
}
