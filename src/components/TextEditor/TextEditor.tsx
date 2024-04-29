"use client"

import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Typography from "@tiptap/extension-typography"
import { useEditor, EditorContent } from "@tiptap/react"
import { Toolbar } from "@/components/TextEditor/Toolbar"

type Props = {
  content: string
  onChange: (richText: string) => void
}

export function TextEditor({ content, onChange }: Props) {
  const textEditor = useEditor({
    content: content,
    editorProps: {
      attributes: {
        class:
          "bg-background border border-input min-h-60 p-3 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      },
    },
    extensions: [
      Color,
      Link.extend({
        addKeyboardShortcuts() {
          return {
            "Mod-k": () => this.editor.commands.toggleLink({ href: "https://example.com", target: "_blank" })
          }
        },
        inclusive: false,
      }).configure({
        HTMLAttributes: {
          class: "text-blue-500 underline"
        }
      }),
      StarterKit.configure({
        heading: {
          HTMLAttributes: {
            class: "font-bold text-lg",
            levels: [3],
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "text-sm",
          }
        },
        listItem: {
          HTMLAttributes: {
            class: "list-disc ml-5",
          },
        }
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),
      TextStyle,
      Typography,
      Underline,
    ],
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="space-y-3">
      <Toolbar editor={textEditor} />
      <EditorContent editor={textEditor} />
    </div>
  )
}
