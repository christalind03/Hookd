import { LoginForm } from "@/components/LoginForm"

export default function Login() {
  return (
    <div className="flex h-screen w-screen">
      <div className="bg-slate-900 lg:w-1/2">
        {/* Display something here... */}
      </div>

      <div className="flex flex-col gap-3 h-full items-center justify-center w-full lg:w-1/2">
        <h3 className="font-extrabold text-3xl">Log In</h3>
        <p className="mb-3 text-sm">
          Welcome back to Threadify! Let's stitch together.
        </p>
        <LoginForm />
      </div>
    </div>
  )
}
