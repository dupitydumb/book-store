import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { FirebaseProvider } from "@/lib/firebase/context/FirebaseContext"
import FallbackDataNotice from "@/components/fallback-data-notice"
import { SonnerProvider } from "@/components/sonner-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bright Books - Your Online Bookstore",
  description: "Discover your next favorite book at Bright Books, your premier online bookstore.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <FallbackDataNotice />
          <SonnerProvider />
        </FirebaseProvider>
      </body>
    </html>
  )
}
