import { LoginForm } from "@/components/Forms/LoginForm"

export default function Login() {
  return (
    <div className="flex flex-col gap-3 h-screen items-center justify-center mx-5">
      <h3 className="font-extrabold text-3xl text-center">Log In</h3>
      <p className="mb-3 text-sm text-center text-pretty">
        Welcome back to Threadify! <br className="sm:hidden" /> Let's stitch together.
      </p>
      <LoginForm />
    </div>
  )
}
