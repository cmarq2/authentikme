"use client"
import React, { Suspense, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import ReCAPTCHA from "react-google-recaptcha"

type Status = {
  emailVerified: boolean
  stripePaid: boolean
  recaptchaDone: boolean
  totpEnabled: boolean
  verificationCode: string | null
  name: string | null
  email: string
}

type Tab = "overview" | "verification" | "settings"

export default function CandidateDashboard() {
  return (
    <Suspense fallback={<Spinner full />}>
      <DashboardInner />
    </Suspense>
  )
}

function Spinner({ full }: { full?: boolean }) {
  const el = <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
  return full ? <div className="min-h-screen flex items-center justify-center bg-gray-50">{el}</div> : el
}

function DashboardInner() {
  const { status: sessionStatus } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const [userStatus, setUserStatus] = useState<Status | null>(null)
  const [copied, setCopied] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  const [captchaError, setCaptchaError] = useState("")
  const [activeTab, setActiveTab] = useState<Tab>("overview")

  const [totpStep, setTotpStep] = useState<"idle" | "scan" | "verify">("idle")
  const [qrCode, setQrCode] = useState("")
  const [totpToken, setTotpToken] = useState("")
  const [totpLoading, setTotpLoading] = useState(false)
  const [totpError, setTotpError] = useState("")

  const paymentResult = searchParams.get("payment")

  async function fetchStatus() {
    const res = await fetch("/api/candidate/status")
    if (res.ok) setUserStatus(await res.json())
  }

  useEffect(() => {
    if (sessionStatus === "unauthenticated") { router.push("/login"); return }
    if (sessionStatus === "authenticated") fetchStatus()
  }, [sessionStatus])

  useEffect(() => {
    if (paymentResult === "success") {
      setActiveTab("verification")
      const interval = setInterval(async () => {
        const res = await fetch("/api/candidate/status")
        if (res.ok) {
          const data = await res.json()
          setUserStatus(data)
          if (data.stripePaid) clearInterval(interval)
        }
      }, 2000)
      setTimeout(() => clearInterval(interval), 30000)
      return () => clearInterval(interval)
    }
  }, [paymentResult])

  async function handlePay() {
    setPaymentLoading(true)
    setPaymentError("")
    try {
      const res = await fetch("/api/candidate/create-checkout", { method: "POST" })
      const data = await res.json()
      if (data.url) { window.location.href = data.url } else {
        setPaymentError(data.error || "Payment setup failed. Please try again.")
        setPaymentLoading(false)
      }
    } catch {
      setPaymentError("Payment setup failed. Please try again.")
      setPaymentLoading(false)
    }
  }

  async function handleCaptcha(token: string | null) {
    if (!token) return
    setCaptchaError("")
    const res = await fetch("/api/candidate/recaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recaptchaToken: token }),
    })
    const data = await res.json()
    if (!res.ok) { setCaptchaError(data.error); recaptchaRef.current?.reset(); return }
    fetchStatus()
  }

  async function startTotp() {
    setTotpStep("scan")
    const res = await fetch("/api/candidate/setup-totp")
    const data = await res.json()
    if (res.ok) setQrCode(data.qrCode)
    else setTotpError(data.error)
  }

  async function verifyTotp(e: React.FormEvent) {
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
    if (!res.ok) { setTotpError(data.error); return }
    fetchStatus()
  }

  function copyCode() {
    if (userStatus?.verificationCode) {
      navigator.clipboard.writeText(userStatus.verificationCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (sessionStatus === "loading" || !userStatus) return <Spinner full />

  const allDone = userStatus.emailVerified && userStatus.stripePaid && userStatus.recaptchaDone && userStatus.totpEnabled
  const steps = [
    { key: "email",   label: "Email Verified", done: userStatus.emailVerified },
    { key: "payment", label: "Fee Paid",        done: userStatus.stripePaid },
    { key: "captcha", label: "Human Check",     done: userStatus.recaptchaDone },
    { key: "totp",    label: "2FA Setup",        done: userStatus.totpEnabled },
  ]
  const completedCount = steps.filter((s) => s.done).length
  const progressPct = Math.round((completedCount / steps.length) * 100)

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: "verification",
      label: "Verification",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 shrink-0 z-20 relative">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <Link href="/" className="text-xl font-bold text-blue-900">
            Authentik<span className="text-blue-500">Me</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold select-none">
              {(userStatus.name ?? userStatus.email)[0].toUpperCase()}
            </div>
            <span className="text-sm text-gray-700 font-medium hidden sm:block">
              {userStatus.name ?? userStatus.email}
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-xl mx-auto w-full">
        {/* Sidebar — desktop only */}
        <aside className="w-56 shrink-0 border-r border-gray-100 bg-white hidden md:flex flex-col py-6 px-3">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.label}
                {item.id === "verification" && !allDone && (
                  <span className="ml-auto text-xs font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                    {completedCount}/{steps.length}
                  </span>
                )}
                {item.id === "verification" && allDone && (
                  <svg className="w-4 h-4 text-green-500 ml-auto shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-4 border-t border-gray-100">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all w-full"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 pb-24 md:pb-8">
          {activeTab === "overview" && (
            <OverviewTab
              userStatus={userStatus}
              steps={steps}
              completedCount={completedCount}
              progressPct={progressPct}
              allDone={allDone}
              copied={copied}
              copyCode={copyCode}
              onGoToVerification={() => setActiveTab("verification")}
            />
          )}
          {activeTab === "verification" && (
            <VerificationTab
              userStatus={userStatus}
              paymentResult={paymentResult}
              paymentLoading={paymentLoading}
              paymentError={paymentError}
              captchaError={captchaError}
              recaptchaRef={recaptchaRef}
              totpStep={totpStep}
              qrCode={qrCode}
              totpToken={totpToken}
              totpLoading={totpLoading}
              totpError={totpError}
              onPay={handlePay}
              onCaptcha={handleCaptcha}
              onStartTotp={startTotp}
              onVerifyTotp={verifyTotp}
              setTotpToken={setTotpToken}
              setTotpStep={setTotpStep}
              allDone={allDone}
              copied={copied}
              copyCode={copyCode}
            />
          )}
          {activeTab === "settings" && (
            <SettingsTab userStatus={userStatus} />
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
              activeTab === item.id ? "text-blue-600" : "text-gray-500"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Overview Tab ─── */

function OverviewTab({
  userStatus, steps, completedCount, progressPct, allDone, copied, copyCode, onGoToVerification,
}: {
  userStatus: Status
  steps: { key: string; label: string; done: boolean }[]
  completedCount: number
  progressPct: number
  allDone: boolean
  copied: boolean
  copyCode: () => void
  onGoToVerification: () => void
}) {
  const firstName = userStatus.name?.split(" ")[0] ?? "there"
  const r = 15.9
  const circumference = 2 * Math.PI * r

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {firstName}</h1>
        <p className="text-sm text-gray-500 mt-1">Here&apos;s your identity verification overview.</p>
      </div>

      {/* Verification status card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">Verification Status</p>
        <div className="flex items-center gap-6 mb-6">
          {/* Circular progress ring */}
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" className="w-20 h-20">
              <circle cx="18" cy="18" r={r} fill="none" stroke="#f3f4f6" strokeWidth="3" />
              <circle
                cx="18" cy="18" r={r} fill="none"
                stroke={allDone ? "#22c55e" : "#2563eb"}
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progressPct / 100)}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
                style={{ transition: "stroke-dashoffset 0.7s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-bold ${allDone ? "text-green-600" : "text-blue-600"}`}>{progressPct}%</span>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-base">
              {allDone ? "Fully Verified" : `${completedCount} of ${steps.length} steps complete`}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              {allDone
                ? "All steps done. Your code is ready to share."
                : "Complete the remaining steps to get your code."}
            </p>
            {!allDone && (
              <button
                onClick={onGoToVerification}
                className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Continue verification →
              </button>
            )}
          </div>
        </div>

        {/* Step status pills */}
        <div className="grid grid-cols-2 gap-2">
          {steps.map((s) => (
            <div
              key={s.key}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                s.done ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-400"
              }`}
            >
              {s.done ? (
                <svg className="w-4 h-4 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
              )}
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Verification code */}
      {allDone && userStatus.verificationCode ? (
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <span className="text-sm font-semibold text-blue-100">Your Verification Code</span>
          </div>
          <p className="text-blue-200 text-xs mb-4">Share this with employers to prove your identity is verified.</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/10 backdrop-blur rounded-xl px-5 py-3">
              <span className="text-2xl font-mono font-bold tracking-widest">{userStatus.verificationCode}</span>
            </div>
            <button
              onClick={copyCode}
              className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                copied ? "bg-green-400 text-white" : "bg-white text-blue-700 hover:bg-blue-50"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      ) : !allDone ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">Verification code not yet available</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">Complete all verification steps to unlock your code.</p>
          <button
            onClick={onGoToVerification}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Continue Verification
          </button>
        </div>
      ) : null}
    </div>
  )
}

/* ─── Verification Tab ─── */

function VerificationTab({
  userStatus, paymentResult, paymentLoading, paymentError, captchaError,
  recaptchaRef, totpStep, qrCode, totpToken, totpLoading, totpError,
  onPay, onCaptcha, onStartTotp, onVerifyTotp, setTotpToken, setTotpStep,
  allDone, copied, copyCode,
}: {
  userStatus: Status
  paymentResult: string | null
  paymentLoading: boolean
  paymentError: string
  captchaError: string
  recaptchaRef: React.RefObject<ReCAPTCHA>
  totpStep: "idle" | "scan" | "verify"
  qrCode: string
  totpToken: string
  totpLoading: boolean
  totpError: string
  onPay: () => void
  onCaptcha: (token: string | null) => void
  onStartTotp: () => void
  onVerifyTotp: (e: React.FormEvent) => void
  setTotpToken: (v: string) => void
  setTotpStep: (v: "idle" | "scan" | "verify") => void
  allDone: boolean
  copied: boolean
  copyCode: () => void
}) {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Verification Steps</h1>
        <p className="text-sm text-gray-500 mt-1">Complete each step to earn your AuthentikMe verification code.</p>
      </div>

      {/* Payment banners */}
      {paymentResult === "success" && !userStatus.stripePaid && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
          <p className="text-sm text-blue-800 font-medium">Payment received — confirming your payment…</p>
        </div>
      )}
      {paymentResult === "cancelled" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6">
          <p className="text-sm text-amber-800 font-medium">Payment was cancelled. You can try again below.</p>
        </div>
      )}

      {/* Verification code — shown once complete */}
      {allDone && userStatus.verificationCode && (
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-semibold text-blue-100">Identity Fully Verified</span>
          </div>
          <p className="text-blue-200 text-xs mb-4">Share this code with any employer to prove your identity.</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/10 backdrop-blur rounded-xl px-5 py-3">
              <span className="text-2xl font-mono font-bold tracking-widest">{userStatus.verificationCode}</span>
            </div>
            <button
              onClick={copyCode}
              className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                copied ? "bg-green-400 text-white" : "bg-white text-blue-700 hover:bg-blue-50"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-4">
        <StepCard number={1} title="Verify your email address" description="Confirm your email to prove it belongs to you." done={userStatus.emailVerified}>
          {!userStatus.emailVerified && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              Check your inbox for a verification email and click the link inside.
            </p>
          )}
        </StepCard>

        <StepCard number={2} title="Pay verification fee" description="A one-time $4.99 fee covers the cost of your identity verification." done={userStatus.stripePaid} locked={!userStatus.emailVerified}>
          {!userStatus.stripePaid && userStatus.emailVerified && (
            <div className="space-y-3">
              <button
                onClick={onPay}
                disabled={paymentLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-60 text-sm"
              >
                {paymentLoading ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Redirecting to payment…</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> Pay $4.99 with Stripe</>
                )}
              </button>
              {paymentError && <p className="text-sm text-red-600 text-center">{paymentError}</p>}
            </div>
          )}
        </StepCard>

        <StepCard number={3} title="Human verification" description="Complete a quick reCAPTCHA challenge to confirm you're not a bot." done={userStatus.recaptchaDone} locked={!userStatus.stripePaid}>
          {!userStatus.recaptchaDone && userStatus.stripePaid && (
            <div>
              {captchaError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{captchaError}</div>
              )}
              <div className="flex justify-center">
                <ReCAPTCHA ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={onCaptcha} />
              </div>
            </div>
          )}
        </StepCard>

        <StepCard number={4} title="Set up Google Authenticator" description="Add two-factor authentication for maximum identity security." done={userStatus.totpEnabled} locked={!userStatus.recaptchaDone}>
          {!userStatus.totpEnabled && userStatus.recaptchaDone && (
            <div>
              {totpStep === "idle" && (
                <button onClick={onStartTotp} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                  Generate QR Code
                </button>
              )}
              {totpStep === "scan" && (
                <div className="text-center">
                  {qrCode ? (
                    <>
                      <p className="text-sm text-gray-600 mb-4">Open <strong>Google Authenticator</strong> → tap <strong>+</strong> → <strong>Scan a QR code</strong></p>
                      <img src={qrCode} alt="TOTP QR Code" className="mx-auto mb-4 border border-gray-200 rounded-xl" width={180} />
                      <button onClick={() => setTotpStep("verify")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                        I&apos;ve scanned it — Enter Code
                      </button>
                    </>
                  ) : (
                    <div className="flex justify-center py-6">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              )}
              {totpStep === "verify" && (
                <form onSubmit={onVerifyTotp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter the 6-digit code from your authenticator app</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      value={totpToken}
                      onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, ""))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="000000"
                      autoFocus
                    />
                  </div>
                  {totpError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{totpError}</div>}
                  <button
                    type="submit"
                    disabled={totpLoading || totpToken.length !== 6}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 text-sm"
                  >
                    {totpLoading ? "Verifying…" : "Verify & Complete Setup"}
                  </button>
                  <button type="button" onClick={() => setTotpStep("scan")} className="w-full text-sm text-gray-500 hover:text-gray-700">
                    ← Back to QR code
                  </button>
                </form>
              )}
            </div>
          )}
        </StepCard>
      </div>
    </div>
  )
}

/* ─── Settings Tab ─── */

function SettingsTab({ userStatus }: { userStatus: Status }) {
  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and security preferences.</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-4">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Profile</h2>
        </div>
        <div className="divide-y divide-gray-50">
          <div className="px-6 py-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Full Name</p>
            <p className="text-sm text-gray-900">{userStatus.name ?? "—"}</p>
          </div>
          <div className="px-6 py-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Email Address</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-900">{userStatus.email}</p>
              {userStatus.emailVerified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Verified</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-4">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Security</h2>
        </div>
        <div className="divide-y divide-gray-50">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500 mt-0.5">Google Authenticator (TOTP)</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              userStatus.totpEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}>
              {userStatus.totpEnabled ? "Enabled" : "Not set up"}
            </span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Verification Fee</p>
              <p className="text-xs text-gray-500 mt-0.5">One-time payment of $4.99</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              userStatus.stripePaid ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}>
              {userStatus.stripePaid ? "Paid" : "Pending"}
            </span>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Account</h2>
        </div>
        <div className="px-6 py-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out of AuthentikMe
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Step Card ─── */

function StepCard({
  number, title, description, done, locked = false, children,
}: {
  number: number
  title: string
  description: string
  done: boolean
  locked?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm transition-all ${
      done ? "border-green-200 bg-green-50/30" : locked ? "border-gray-100 opacity-60" : "border-gray-200"
    }`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
            done ? "bg-green-500 text-white" : locked ? "bg-gray-100 text-gray-400" : "bg-blue-600 text-white"
          }`}>
            {done ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : number}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className={`font-semibold text-sm ${done ? "text-green-800" : locked ? "text-gray-400" : "text-gray-900"}`}>
                {title}
              </h3>
              {done && <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Complete</span>}
              {locked && !done && <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Locked</span>}
            </div>
            <p className={`text-sm ${locked ? "text-gray-400" : "text-gray-500"}`}>{description}</p>
          </div>
        </div>
        {!done && !locked && children && (
          <div className="mt-5 ml-13 pl-0.5">{children}</div>
        )}
      </div>
    </div>
  )
}
