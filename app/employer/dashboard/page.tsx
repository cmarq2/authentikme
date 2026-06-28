"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

type VerifyResult = {
  verified: boolean
  message?: string
  candidate?: { name: string | null; email: string }
}

export default function EmployerDashboard() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerifyResult | null>(null)

  useEffect(() => {
    if (sessionStatus === "unauthenticated") router.push("/login")
  }, [sessionStatus])

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setResult(null)
    setLoading(true)

    const res = await fetch("/api/employer/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })

    const data = await res.json()
    setLoading(false)
    setResult(data)
  }

  if (sessionStatus === "loading") {
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
            <span className="text-sm text-gray-500">{session?.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify a Candidate</h1>
        <p className="text-gray-500 mb-8">
          Enter the verification code shared by the candidate to confirm their identity is real and verified.
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate Verification Code
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 font-mono text-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="ATK-XXXX-XXXX"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !code}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? "Verifying…" : "Verify Code"}
            </button>
          </form>
        </div>

        {/* Result */}
        {result && (
          <div
            className={`rounded-2xl border p-6 ${
              result.verified
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  result.verified ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {result.verified ? (
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <p className={`text-lg font-bold ${result.verified ? "text-green-800" : "text-red-800"}`}>
                  {result.verified ? "Identity Verified" : "Not Verified"}
                </p>
                {result.verified && result.candidate ? (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-green-700">
                      <strong>Name:</strong> {result.candidate.name ?? "N/A"}
                    </p>
                    <p className="text-sm text-green-700">
                      <strong>Email:</strong> {result.candidate.email}
                    </p>
                    <div className="mt-3 flex flex-col gap-1 text-xs text-green-600">
                      <span>Email address confirmed</span>
                      <span>Human verification passed</span>
                      <span>Google Authenticator set up</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-red-700 mt-1">{result.message}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
