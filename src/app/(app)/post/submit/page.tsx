import { SubmitPost } from "@/components/Forms/SubmitPost"

export default function Submit() {
  return (
    <div className="flex flex-col gap-5 items-center justify-center m-10">
      <h3 className="font-extrabold text-3xl">Submit Post</h3>
      <SubmitPost />
    </div>
  )
}
