export function toPostData(formData: FormData) {
  return {
    id: formData.get("id") as string,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    postImage: formData.get("postImage") as Blob,
    projectDifficulty: formData.get("projectDifficulty") as string,
    projectType: formData.get("projectType") as string,
  }
}
