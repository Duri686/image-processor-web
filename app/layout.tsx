import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Image Optimizer - Professional Image Processing Tool",
  description:
    "Compress, convert, and optimize images directly in your browser. Generate favicons and OG images with ease.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  keywords: [
    "image optimization",
    "image compressor",
    "image converter",
    "webp",
    "png",
    "jpeg",
    "favicon generator",
    "og image",
  ],
  authors: [{ name: "Image Optimizer" }],
  creator: "Image Optimizer",
  publisher: "Image Optimizer",
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  // openGraph: {
  //   type: "website",
  //   locale: "en_US",
  //   url: "/",
  //   siteName: "Image Optimizer",
  //   title: "Image Optimizer - Professional Image Processing Tool",
  //   description:
  //     "Compress, convert, and optimize images directly in your browser. Generate favicons and OG images with ease.",
  //   images: [
  //     {
  //       url: "/placeholder-logo.png",
  //       width: 1200,
  //       height: 630,
  //       alt: "Image Optimizer",
  //     },
  //   ],
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Image Optimizer - Professional Image Processing Tool",
  //   description:
  //     "Compress, convert, and optimize images directly in your browser. Generate favicons and OG images with ease.",
  //   images: ["/placeholder-logo.png"],
  // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Footer />
          <Toaster richColors closeButton position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
