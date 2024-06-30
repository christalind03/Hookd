"use client"

// Business Logic
import Color from "@tiptap/extension-color"
import Link from "@tiptap/extension-link"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import Typography from "@tiptap/extension-typography"
import Underline from "@tiptap/extension-underline"
import { useEditor, EditorContent } from "@tiptap/react"

// UI Components
import { EditorToolbar } from "@/components/App/Submit/Editor/EditorToolbar/EditorToolbar"

type Props = {
  content: string
  onChange: (richText: string) => void
}

export function Editor({ content, onChange }: Props) {
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
      <EditorToolbar editor={textEditor} />
      <EditorContent editor={textEditor} />
    </div>
  )
}
