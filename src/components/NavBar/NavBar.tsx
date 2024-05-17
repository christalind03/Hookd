"use client"

import { Button } from "@/components/ui/Button"
import { UserAvatar } from "@/components/NavBar/UserAvatar"
import { useUser, useUserRole } from "@/components/UserProvider"
import { MagnifyingGlassIcon, Pencil2Icon } from "@radix-ui/react-icons"
import Link from "next/link"
import { Input } from "@/components/ui/Input"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/Form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Fragment, useState } from "react"

const formSchema = z.object({
  searchQuery: z.string(),
})

export function NavBar() {
  const formHook = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      searchQuery: "",
    },
    resolver: zodResolver(formSchema),
  })

  const router = useRouter()
  const supabaseUser = useUser()
  const supabaseUserRole = useUserRole()
  const [displaySearch, setDisplaySearch] = useState(false)

  function handleSubmit(formData: z.infer<typeof formSchema>) {
    const { searchQuery } = formData

    if (searchQuery) {
      router.push(`/results?searchQuery=${searchQuery}`)
    }
  }

  return (
    <div className="backdrop-blur-lg h-14 left-0 px-5 sticky top-0 z-10">
      {/* Desktop NavBar */}
      <div className="flex gap-5 h-14 hidden items-center justify-between w-full lg:flex">
        <Link href="/home">
          <h1 className="cursor-pointer font-extrabold text-nowrap text-xl">
            🧶 Hook'd
          </h1>
        </Link>

        <div className="flex gap-3 items-center">
          {supabaseUserRole === "Admin" && (
            <Link href="/post/submit">
              <Pencil2Icon className="size-5 hover:text-blue-500" />
            </Link>
          )}

          {supabaseUser ? (
            <UserAvatar supabaseUser={supabaseUser} />
          ) : (
            <Link href="/login">
              <Button>Log In</Button>
            </Link>
          )}
        </div>
      </div>
      
      <div className="absolute flex gap-5 h-14 hidden items-center justify-center left-0 mx-auto right-0 top-0 w-full lg:flex lg:w-[725px]">
        <Form {...formHook}>
          <form
            className="w-full"
            onSubmit={(formData) =>
              formHook.handleSubmit(handleSubmit)(formData)
            }
          >
            <FormField
              name="searchQuery"
              control={formHook.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Search..."
                      className="bg-background"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      {/* Mobile NavBar */}
      <div className="flex gap-5 h-14 items-center justify-between w-full lg:hidden">
        {displaySearch ? (
          <Form {...formHook}>
            <form
              className="flex gap-3 items-center justify-between w-full"
              onSubmit={(formData) =>
                formHook.handleSubmit(handleSubmit)(formData)
              }
            >
              <FormField
                name="searchQuery"
                control={formHook.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Search..."
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="button" variant="ghost" onClick={() => setDisplaySearch(false)}>Cancel</Button>
            </form>
          </Form>
        ) : (
          <Fragment>
            <Link href="/home">
              <h1 className="cursor-pointer font-extrabold text-nowrap text-xl">
                🧶 Hook'd
              </h1>
            </Link>

            <div className="flex gap-3 items-center">
              <MagnifyingGlassIcon
                className="size-5 hover:text-blue-500"
                onClick={() => setDisplaySearch(true)}
              />

              {supabaseUserRole === "Admin" && (
                <Link href="/post/submit">
                  <Pencil2Icon className="size-5 hover:text-blue-500" />
                </Link>
              )}

              {supabaseUser ? (
                <UserAvatar supabaseUser={supabaseUser} />
              ) : (
                <Link href="/login">
                  <Button>Log In</Button>
                </Link>
              )}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  )
}
