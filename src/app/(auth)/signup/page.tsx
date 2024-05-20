import { SignupForm } from "@/components/Forms/SignupForm"
import Link from "next/link"

export default function Signup() {
  return (
    <div className="flex h-screen items-center justify-center mx-5">
      <div className="flex flex-col gap-3 items-center justify-center max-sm:w-[305px] md:border md:p-12 md:rounded-md md:shadow">
        <h3 className="font-extrabold text-3xl text-center">Sign Up</h3>
        <p className="mb-3 text-sm text-center text-pretty">
          Welcome to Threadify! <br className="sm:hidden" /> Let's stitch together.
        </p>
        <SignupForm />

        <div className="flex gap-3 mt-3 text-xs">
          <p>Already have an account?</p>
          <Link className="font-bold hover:text-blue-500 hover:underline" href="/login">Log In</Link>
        </div>
      </div>
    </div>
  )
}
