import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = "https://www.authentikme.com"
const title = "AuthentikMe – Identity Verification for Job Seekers"
const description =
  "Verify your identity as a job candidate and share your unique code with employers who can instantly confirm you are real."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | AuthentikMe",
  },
  description,
  keywords: [
    "identity verification",
    "job applicant verification",
    "candidate verification",
    "hiring fraud prevention",
    "verified job candidates",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "AuthentikMe",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  verification: {
    google: "hIB0umxG7tsiHctaFMn4GOlfm48-rZS4SV-NRdAS4zk",
  },
}

export const viewport: Viewport = {
  themeColor: "#2563EB",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
