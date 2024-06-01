import Link from "next/link"

type Props = {
  href: string
}

export function LinkExpired({ href }: Props) {
  return (
    <div className="flex h-screen items-center justify-center mx-5">
      <div className="flex flex-col gap-3 items-center justify-center max-sm:w-[305px] md:border md:p-12 md:rounded-md md:shadow">
        <h3 className="font-extrabold text-3xl text-center">Link Expired</h3>
        <p className="mb-3 text-sm text-center text-pretty w-96">
          This link was set to expire after a certain amount of time. Receive a
          new link by clicking{" "}
          <Link className="text-blue-500" href={href}>
            here
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
