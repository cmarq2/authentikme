"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

type Status = {
  emailVerified: boolean
  recaptchaDone: boolean
  totpEnabled: boolean
  verificationCode: string | null
  name: string | null
  email: string
}

export default function CandidateDashboard() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const [userStatus, setUserStatus] = useState<Status | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login")
      return
    }
    if (sessionStatus === "authenticated") {
      fetch("/api/candidate/status")
        .then((r) => r.json())
        .then((data) => {
          setUserStatus(data)
          // Redirect to setup if not complete
          if (!data.totpEnabled) {
            router.push("/candidate/setup")
          }
        })
    }
  }, [sessionStatus])

  function copyCode() {
    if (userStatus?.verificationCode) {
      navigator.clipboard.writeText(userStatus.verificationCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (sessionStatus === "loading" || !userStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-900">
            Authentik<span className="text-blue-500">Me</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{userStatus.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Verified badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-green-700 font-semibold">Identity Fully Verified</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Welcome, {userStatus.name ?? "Candidate"}
        </h1>
        <p className="text-gray-500 mb-8">Your unique verification code is ready to share with employers.</p>

        {/* Verification Code */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
          <p className="text-sm text-gray-500 font-medium mb-3">YOUR VERIFICATION CODE</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-6 py-4">
              <span className="text-3xl font-mono font-bold text-gray-900 tracking-widest">
                {userStatus.verificationCode}
              </span>
            </div>
            <button
              onClick={copyCode}
              className={`px-5 py-4 rounded-xl font-semibold text-sm transition-all ${
                copied
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Share this code with any employer. They can verify it instantly on their dashboard.
          </p>
        </div>

        {/* Verification checklist */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">VERIFICATION COMPLETED</h2>
          <div className="space-y-3">
            {[
              { label: "Email address verified", done: userStatus.emailVerified },
              { label: "Human verification (reCAPTCHA) passed", done: userStatus.recaptchaDone },
              { label: "Google Authenticator (2FA) set up", done: userStatus.totpEnabled },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? "bg-green-100" : "bg-gray-100"}`}>
                  <svg className={`w-3 h-3 ${item.done ? "text-green-600" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
