import { SignupForm } from "@/components/App/Signup/SignupForm"
import Link from "next/link"
import { Fragment } from "react"

export function Signup() {
  return (
    <Fragment>
      <h3 className="font-extrabold text-3xl text-center">Sign Up</h3>
      <p className="mb-3 text-sm text-center text-pretty">
        Welcome to Threadify! <br className="sm:hidden" /> Let&apos;s stitch together.
      </p>
      <SignupForm />

      <div className="flex gap-3 mt-3 text-xs">
        <p>Already have an account?</p>
        <Link className="font-bold hover:text-blue-500 hover:underline" href="/login">Log In</Link>
      </div>
    </Fragment>
  )
}
