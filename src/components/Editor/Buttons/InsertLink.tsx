"use client"

// Business Logic
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// UI Components
import { Button } from "@/components/ui/Button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { Link2Icon } from "@radix-ui/react-icons"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"

type Props = {
  onSubmit: (formData: { text: string; href: string }) => void
}

const formSchema = z.object({
  text: z.string(),
  href: z
    .string()
    .regex(
      /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/,
      "Invalid URL."
    ),
})

export function InsertLink({ onSubmit }: Props) {
  const formHook = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      text: "",
      href: "",
    },
    resolver: zodResolver(formSchema),
  })

  function handleSubmit(formData: z.infer<typeof formSchema>) {
    onSubmit({
      text: formData.text.trim() || formData.href,
      href: formData.href,
    })
  }

  return (
    <Popover>
      <PopoverContent>
        <Form {...formHook}>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.stopPropagation()
              formHook.handleSubmit(handleSubmit)(event)
            }}
          >
            <FormField
              control={formHook.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formHook.control}
              name="href"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Insert Link</Button>
          </form>
        </Form>
      </PopoverContent>

      <PopoverTrigger asChild>
        <div className="px-2">
          <Link2Icon className="size-4" />
        </div>
      </PopoverTrigger>
    </Popover>
  )
}
