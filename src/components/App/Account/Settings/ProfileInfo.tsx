"use client"

// Business Logic
import { type Error, isError } from "@/types/Error"
import { updateProfile } from "@/actions/authActions"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useToast } from "@/components/ui/useToast"
import { useUser } from "@/components/UserProvider"
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
import { Separator } from "@/components/ui/Separator"
import { Textarea } from "@/components/ui/Textarea"

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must have a minimum of 3 characters.",
  }),
  biography: z
    .string()
    .max(150, {
      message: "Biography must not exceed 150 characters.",
    })
    .optional(),
})

export function ProfileInfo() {
  const supabaseUser = useUser()
  const [error, setError] = useState<Error>()
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const formHook = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      username: supabaseUser?.username,
      biography: supabaseUser?.biography,
    },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  })

  const { toast } = useToast()

  async function onSubmit(formValues: z.infer<typeof formSchema>) {
    setIsSaving(true)

    const formData = new FormData()

    for (const [formProperty, formValue] of Object.entries(formValues)) {
      formData.append(formProperty, formValue)
    }

    const serverResponse = await updateProfile(supabaseUser?.id!, formData)
    await new Promise((resolve) => setTimeout(resolve, 150))

    if (isError(serverResponse)) {
      setError(serverResponse)
    } else {
      setError(undefined)

      toast({
        title: "🎉 Profile Saved",
        description: "Changes saved successfully.",
      })
    }

    setIsSaving(false)
  }

  return (
    <section className="border flex flex-col gap-5 p-5 rounded-md shadow">
      <h5>Profile Information</h5>

      {/* The class name helps the separator ignore the parent padding. */}
      <Separator className="-mx-5 w-[calc(100%+2.5rem)]" />

      <Form {...formHook}>
        <form
          className="flex flex-col gap-5"
          onSubmit={formHook.handleSubmit(onSubmit)}
        >
          {error && <DisplayError error={error} />}

          <FormField
            control={formHook.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={formHook.control}
            name="biography"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biography</FormLabel>

                <FormControl>
                  <Textarea className="h-24" {...field} />
                </FormControl>

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* The class name helps the separator ignore the parent padding. */}
          <Separator className="-mx-5 w-[calc(100%+2.5rem)]" />

          <div className="flex gap-3 items-center ml-auto">
            <Button
              onClick={() => formHook.reset()}
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Submit Post"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}
