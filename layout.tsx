import type { Metadata } from "next"
import "./globals.css"
import type React from "react"

export const metadata: Metadata = {
  title: "Stitch Valentine Proposal",
  description: "A cute Valentine's Day proposal featuring Stitch",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}


