"use client"

// Business Logic
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useUser } from "@/components/UserProvider"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// UI Components
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/Form"
import { Fragment } from "react"
import { Input } from "@/components/ui/Input"
import Link from "next/link"
import { MagnifyingGlassIcon, Pencil2Icon } from "@radix-ui/react-icons"
import { UserAvatar } from "@/components/NavBar/UserAvatar"

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
  const [displaySearch, setDisplaySearch] = useState(false)

  function handleSubmit(formData: z.infer<typeof formSchema>) {
    const { searchQuery } = formData

    if (searchQuery) {
      router.push(`/results?searchQuery=${searchQuery}`)
    }
  }

  return (
    <div className="backdrop-blur-lg h-14 left-0 px-5 sticky top-0 z-10">
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
              <h1 className="cursor-pointer font-extrabold text-nowrap text-2xl">
                🧶 Hook&apos;d
              </h1>
            </Link>

            <div className="flex gap-3 items-center">
              <MagnifyingGlassIcon
                className="size-7 hover:text-blue-500"
                onClick={() => setDisplaySearch(true)}
              />

              {["Admin", "Creator"].some((userRole) => userRole === supabaseUser?.userRole) && (
                <Link href="/submit">
                  <Pencil2Icon className="size-7 hover:text-blue-500" />
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

      {/* Desktop NavBar */}
      <div className="flex gap-5 h-14 hidden items-center justify-between w-full lg:flex">
        <Link href="/home">
          <h1 className="cursor-pointer font-extrabold text-nowrap text-xl">
            🧶 Hook&apos;d
          </h1>
        </Link>

        <div className="flex gap-3 items-center">
          {["Admin", "Creator"].some((userRole) => userRole === supabaseUser?.userRole) && (
            <Link href="/submit">
              <Pencil2Icon className="size-7 hover:text-blue-500" />
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

    </div>
  )
}
