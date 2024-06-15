import { LoginForm } from "@/components/App/Login/LoginForm"
import Link from "next/link"
import { Fragment } from "react"

export function Login() {
  return (
    <Fragment>
      <h3 className="font-extrabold text-3xl text-center">Log In</h3>
      <p className="mb-3 text-sm text-center text-pretty">
        Welcome back to Threadify! <br className="sm:hidden" /> Let's stitch together.
      </p>
      <LoginForm />

      <div className="flex gap-3 mt-3 text-xs">
        <p>Don't have an account?</p>
        <Link
          className="font-bold hover:text-blue-500 hover:underline"
          href="/signup"
        >
          Sign Up
        </Link>
      </div>
    </Fragment>
  )
}
