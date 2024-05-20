import { LoginForm } from "@/components/Forms/LoginForm"
import Link from "next/link"

export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center mx-5">
      <div className="flex flex-col gap-3 items-center justify-center max-sm:w-[305px] md:border md:p-12 md:rounded-md md:shadow">
        <h3 className="font-extrabold text-3xl text-center">Log In</h3>
        <p className="mb-3 text-sm text-center text-pretty">
          Welcome back to Threadify! <br className="sm:hidden" /> Let's stitch together.
        </p>
        <LoginForm />

        <div className="flex gap-3 mt-3 text-xs">
          <p>Don't have an account?</p>
          <Link className="font-bold hover:text-blue-500 hover:underline" href="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  )
}
