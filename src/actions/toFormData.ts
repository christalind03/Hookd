export function toPostData(formData: FormData) {
  return {
    id: formData.get("id") as string,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    difficulty: formData.get("difficulty") as string,
    yarnWeight: formData.get("yarnWeight") as string,
    postImage: formData.get("postImage") as Blob,
  } 
}