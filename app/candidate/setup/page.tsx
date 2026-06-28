"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import ReCAPTCHA from "react-google-recaptcha"

type Status = {
  emailVerified: boolean
  recaptchaDone: boolean
  totpEnabled: boolean
  verificationCode: string | null
  name: string | null
  email: string
}

export default function SetupPage() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const [userStatus, setUserStatus] = useState<Status | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // TOTP state
  const [qrCode, setQrCode] = useState("")
  const [totpToken, setTotpToken] = useState("")
  const [totpLoading, setTotpLoading] = useState(false)
  const [totpError, setTotpError] = useState("")
  const [totpStep, setTotpStep] = useState<"load" | "scan" | "verify">("load")

  async function fetchStatus() {
    const res = await fetch("/api/candidate/status")
    if (res.ok) {
      const data = await res.json()
      setUserStatus(data)
      if (data.totpEnabled && data.verificationCode) {
        router.push("/candidate/dashboard")
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    if (sessionStatus === "unauthenticated") router.push("/login")
    if (sessionStatus === "authenticated") fetchStatus()
  }, [sessionStatus])

  async function handleRecaptcha(token: string | null) {
    if (!token) return
    setError("")
    const res = await fetch("/api/candidate/recaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recaptchaToken: token }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
      recaptchaRef.current?.reset()
      return
    }
    fetchStatus()
  }

  async function loadTotp() {
    setTotpStep("scan")
    const res = await fetch("/api/candidate/setup-totp")
    const data = await res.json()
    if (!res.ok) {
      setTotpError(data.error)
      return
    }
    setQrCode(data.qrCode)
  }

  async function handleTotpVerify(e: React.FormEvent) {
    e.preventDefault()
    setTotpError("")
    setTotpLoading(true)
    const res = await fetch("/api/candidate/verify-totp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: totpToken }),
    })
    const data = await res.json()
    setTotpLoading(false)
    if (!res.ok) {
      setTotpError(data.error)
      return
    }
    router.push("/candidate/dashboard")
  }

  if (loading || sessionStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!userStatus) return null

  const step = !userStatus.recaptchaDone ? 2 : 3

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-900">
            Authentik<span className="text-blue-500">Me</span>
          </Link>
          <p className="text-gray-500 mt-1 text-sm">Complete your identity verification</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 gap-3">
          {[
            { n: 1, label: "Email", done: userStatus.emailVerified },
            { n: 2, label: "reCAPTCHA", done: userStatus.recaptchaDone },
            { n: 3, label: "Authenticator", done: userStatus.totpEnabled },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                    s.done
                      ? "bg-green-500 text-white"
                      : step === s.n
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {s.done ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.n
                  )}
                </div>
                <span className="text-xs text-gray-500 mt-1">{s.label}</span>
              </div>
              {i < 2 && <div className="w-12 h-px bg-gray-300 mb-4" />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Step 2: reCAPTCHA */}
          {!userStatus.recaptchaDone && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Step 2: Prove you are human</h2>
              <p className="text-gray-500 text-sm mb-6">Complete the reCAPTCHA challenge below.</p>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={handleRecaptcha}
                />
              </div>
            </div>
          )}

          {/* Step 3: TOTP */}
          {userStatus.recaptchaDone && !userStatus.totpEnabled && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Step 3: Set up Google Authenticator</h2>
              <p className="text-gray-500 text-sm mb-6">
                Install Google Authenticator on your phone, then scan the QR code below.
              </p>

              {totpStep === "load" && (
                <button
                  onClick={loadTotp}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Generate QR Code
                </button>
              )}

              {totpStep === "scan" && (
                <div>
                  {qrCode ? (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Open Google Authenticator → tap <strong>+</strong> → <strong>Scan a QR code</strong>
                      </p>
                      <img src={qrCode} alt="TOTP QR Code" className="mx-auto mb-6 border border-gray-200 rounded-lg" />
                      <button
                        onClick={() => setTotpStep("verify")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                      >
                        I've scanned it — Enter Code
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              )}

              {totpStep === "verify" && (
                <form onSubmit={handleTotpVerify} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter the 6-digit code from your authenticator app
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      value={totpToken}
                      onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, ""))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="000000"
                    />
                  </div>

                  {totpError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                      {totpError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={totpLoading || totpToken.length !== 6}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
                  >
                    {totpLoading ? "Verifying…" : "Verify & Complete Setup"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTotpStep("scan")}
                    className="w-full text-sm text-gray-500 hover:text-gray-700"
                  >
                    Go back to QR code
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
