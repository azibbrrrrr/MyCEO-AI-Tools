import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LanguageProvider } from "@/components/language-provider"

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
})

export const metadata: Metadata = {
  title: "BizKids AI - Your Entrepreneurship Adventure!",
  description: "AI-powered entrepreneurship tools for young CEOs aged 9-13",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
