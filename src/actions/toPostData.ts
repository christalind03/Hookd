export function toPostData(formData: FormData) {
  return {
    id: formData.get("id") as string,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    postImage: formData.get("postImage") as Blob,
    difficulty: formData.get("difficulty") as string,
    postTags: JSON.parse(formData.get("postTags") as string),
  }
}
