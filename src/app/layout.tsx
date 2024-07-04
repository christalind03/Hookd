import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { cn } from "@/utils/shadcn"
import "./globals.css"

const fontPoppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Hook'd",
  description: "Discover and save free crochet patterns on Hook'd.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "antialiased bg-background font-sans min-h-screen",
          fontPoppins.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}
