"use client"
import React, { Suspense, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import ReCAPTCHA from "react-google-recaptcha"
import DashboardShell, { DashCard, DashHeading, DashLabel, IdentityCard, type DashNavItem } from "../../components/DashboardShell"

type Status = {
  emailVerified: boolean
  stripePaid: boolean
  stripeSubscriptionId: string | null
  recaptchaDone: boolean
  idUploaded: boolean
  idBackUploaded: boolean
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
  const el = (
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <span className="text-sm text-slate-400 font-medium">Loading…</span>
    </div>
  )
  return full ? (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">{el}</div>
  ) : el
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

  const [discountCode, setDiscountCode] = useState("")
  const [discountLoading, setDiscountLoading] = useState(false)
  const [discountError, setDiscountError] = useState("")
  const [discountSuccess, setDiscountSuccess] = useState(false)

  const [resendLoading, setResendLoading] = useState(false)
  const [resendError, setResendError] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)

  const [idPreview, setIdPreview] = useState<string | null>(null)
  const [idUploading, setIdUploading] = useState(false)
  const [idError, setIdError] = useState("")
  const [idConfirming, setIdConfirming] = useState(false)
  const [idConfirmBarActive, setIdConfirmBarActive] = useState(false)

  const [idBackPreview, setIdBackPreview] = useState<string | null>(null)
  const [idBackUploading, setIdBackUploading] = useState(false)
  const [idBackError, setIdBackError] = useState("")
  const [idBackConfirming, setIdBackConfirming] = useState(false)
  const [idBackConfirmBarActive, setIdBackConfirmBarActive] = useState(false)

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
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

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
    setPaymentLoading(true); setPaymentError("")
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

  async function handleDiscount(e: React.FormEvent) {
    e.preventDefault()
    setDiscountLoading(true); setDiscountError(""); setDiscountSuccess(false)
    try {
      const res = await fetch("/api/candidate/apply-discount", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCode }),
      })
      const data = await res.json()
      if (!res.ok) { setDiscountError(data.error); setDiscountLoading(false); return }
      setDiscountSuccess(true)
      fetchStatus()
    } catch {
      setDiscountError("Something went wrong. Please try again.")
    }
    setDiscountLoading(false)
  }

  async function handleResend() {
    setResendLoading(true); setResendError("")
    try {
      const res = await fetch("/api/candidate/resend-verification", { method: "POST" })
      const data = await res.json()
      if (!res.ok) { setResendError(data.error || "Failed to send. Please try again."); setResendLoading(false); return }
      setResendCooldown(60)
    } catch {
      setResendError("Failed to send. Please try again.")
    }
    setResendLoading(false)
  }

  async function handleCaptcha(token: string | null) {
    if (!token) return
    setCaptchaError("")
    const res = await fetch("/api/candidate/recaptcha", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recaptchaToken: token }),
    })
    const data = await res.json()
    if (!res.ok) { setCaptchaError(data.error); recaptchaRef.current?.reset(); return }
    fetchStatus()
  }

  async function compressIdImage(file: File): Promise<Blob> {
    const bitmap = await createImageBitmap(file)
    const maxDim = 1600
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, width, height)
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))), "image/jpeg", 0.82)
    })
  }

  async function runIdConfirmation(setConfirming: (v: boolean) => void, setBarActive: (v: boolean) => void) {
    const duration = 15000
    setConfirming(true)
    setBarActive(false)
    // Two nested rAFs guarantee a paint at 0% happens before the width
    // transition to 100% is triggered, so the CSS transition actually animates.
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
    setBarActive(true)
    // A plain timer (not rAF) so the wait reliably completes even if the tab
    // is backgrounded — rAF can be paused entirely when a tab isn't visible.
    await new Promise<void>((resolve) => setTimeout(resolve, duration))
    setConfirming(false)
    setBarActive(false)
  }

  async function handleIdFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIdPreview(URL.createObjectURL(file))
    setIdError(""); setIdUploading(true)
    try {
      const compressed = await compressIdImage(file)
      const formData = new FormData()
      formData.append("file", compressed, "id-front.jpg")
      formData.append("side", "front")
      const res = await fetch("/api/candidate/upload-id", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) { setIdError(data.error || "Upload failed. Please try again."); setIdUploading(false); return }
      setIdUploading(false)
      await runIdConfirmation(setIdConfirming, setIdConfirmBarActive)
      fetchStatus()
      return
    } catch {
      setIdError("Upload failed. Please try again.")
    }
    setIdUploading(false)
  }

  async function handleIdBackFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIdBackPreview(URL.createObjectURL(file))
    setIdBackError(""); setIdBackUploading(true)
    try {
      const compressed = await compressIdImage(file)
      const formData = new FormData()
      formData.append("file", compressed, "id-back.jpg")
      formData.append("side", "back")
      const res = await fetch("/api/candidate/upload-id", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) { setIdBackError(data.error || "Upload failed. Please try again."); setIdBackUploading(false); return }
      setIdBackUploading(false)
      await runIdConfirmation(setIdBackConfirming, setIdBackConfirmBarActive)
      fetchStatus()
      return
    } catch {
      setIdBackError("Upload failed. Please try again.")
    }
    setIdBackUploading(false)
  }

  async function startTotp() {
    setTotpStep("scan")
    const res = await fetch("/api/candidate/setup-totp")
    const data = await res.json()
    if (res.ok) setQrCode(data.qrCode)
    else setTotpError(data.error)
  }

  async function verifyTotp(e: React.FormEvent) {
    e.preventDefault(); setTotpError(""); setTotpLoading(true)
    const res = await fetch("/api/candidate/verify-totp", {
      method: "POST", headers: { "Content-Type": "application/json" },
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

  const allDone = userStatus.emailVerified && userStatus.recaptchaDone && userStatus.idUploaded && userStatus.stripePaid && userStatus.totpEnabled
  const steps = [
    { key: "email",   label: "Email Verified", done: userStatus.emailVerified },
    { key: "captcha", label: "Human Check",     done: userStatus.recaptchaDone },
    { key: "payment", label: "Fee Paid",        done: userStatus.stripePaid },
    { key: "idUpload", label: "ID Uploaded",    done: userStatus.idUploaded },
    { key: "totp",    label: "2FA Setup",        done: userStatus.totpEnabled },
  ]
  const completedCount = steps.filter((s) => s.done).length
  const progressPct = Math.round((completedCount / steps.length) * 100)

  const navItems: DashNavItem<Tab>[] = [
    {
      id: "overview", label: "Overview",
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: "verification", label: "Verification",
      badge: allDone ? (
        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <span className="text-[11px] font-semibold tabular-nums rounded-full px-2 py-0.5 bg-blue-500/20 text-blue-400">{completedCount}/{steps.length}</span>
      ),
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: "settings", label: "Settings",
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  return (
    <DashboardShell
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      user={{ name: userStatus.name ?? "", email: userStatus.email, role: "Candidate account" }}
      status={
        allDone ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-[12px] font-semibold text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-900/10 px-3 py-1.5 text-[12px] font-medium text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {completedCount}/{steps.length}<span className="hidden sm:inline"> steps complete</span>
          </span>
        )
      }
    >
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
          discountCode={discountCode}
          discountLoading={discountLoading}
          discountError={discountError}
          discountSuccess={discountSuccess}
          setDiscountCode={setDiscountCode}
          onApplyDiscount={handleDiscount}
          resendLoading={resendLoading}
          resendError={resendError}
          resendCooldown={resendCooldown}
          onResend={handleResend}
          idPreview={idPreview}
          idUploading={idUploading}
          idError={idError}
          idConfirming={idConfirming}
          idConfirmBarActive={idConfirmBarActive}
          onIdFileSelect={handleIdFileSelect}
          idBackPreview={idBackPreview}
          idBackUploading={idBackUploading}
          idBackError={idBackError}
          idBackConfirming={idBackConfirming}
          idBackConfirmBarActive={idBackConfirmBarActive}
          onIdBackFileSelect={handleIdBackFileSelect}
        />
      )}
      {activeTab === "settings" && (
        <SettingsTab userStatus={userStatus} onStatusChange={fetchStatus} />
      )}
    </DashboardShell>
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
  const r = 42
  const circumference = 2 * Math.PI * r

  const [ringPct, setRingPct] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setRingPct(progressPct), 250)
    return () => clearTimeout(t)
  }, [progressPct])

  const stepIcons: Record<string, React.ReactNode> = {
    email: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    payment: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    captcha: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    idUpload: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    totp: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  }

  const remaining = steps.length - completedCount

  return (
    <div>
      <DashHeading
        title={<>Welcome back, <span className="gradient-text text-[1.08em]">{firstName}.</span></>}
        subtitle={allDone
          ? "Your identity is verified. Share your code with employers to stand out from day one."
          : "Here's where your identity verification stands."}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Identity card */}
        <div className="lg:col-span-7 space-y-4 dash-enter dash-delay-1">
          {allDone && userStatus.verificationCode ? (
            <IdentityCard
              holder={userStatus.name ?? userStatus.email}
              code={userStatus.verificationCode}
              footer={
                <button
                  onClick={copyCode}
                  className={`shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-all ${
                    copied ? "bg-emerald-400 text-slate-950" : "bg-white text-slate-900 hover:bg-blue-50"
                  }`}
                >
                  {copied ? (
                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Copied</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copy code</>
                  )}
                </button>
              }
            />
          ) : (
            <IdentityCard
              holder={userStatus.name ?? userStatus.email}
              code={null}
              locked
              footer={
                <button
                  onClick={onGoToVerification}
                  className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white text-slate-900 hover:bg-blue-50 px-4 py-2.5 text-[13px] font-semibold transition-colors"
                >
                  Unlock code
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              }
            />
          )}
          <p className="text-[13px] text-slate-500 px-1">
            {allDone
              ? "Share this code with any employer — they can confirm your identity instantly."
              : `${remaining} step${remaining !== 1 ? "s" : ""} left to unlock your verification code.`}
          </p>
        </div>

        {/* Progress */}
        <DashCard className="lg:col-span-5 p-6 dash-enter dash-delay-2">
          <DashLabel className="mb-5">Verification progress</DashLabel>
          <div className="flex items-center gap-5 mb-6">
            <div className="relative shrink-0">
              <svg viewBox="0 0 100 100" className="w-24 h-24">
                <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f5f9" strokeWidth="7" />
                <circle
                  cx="50" cy="50" r={r} fill="none"
                  stroke={allDone ? "url(#greenGrad)" : "url(#blueGrad)"}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - ringPct / 100)}
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
                />
                <defs>
                  <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                  <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-semibold tabular-nums tracking-tight text-slate-900">{ringPct}%</span>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-900">
                {allDone ? "Identity verified" : `${remaining} step${remaining !== 1 ? "s" : ""} remaining`}
              </p>
              <p className="text-[13px] text-slate-500 leading-relaxed mt-0.5">
                {allDone ? "All checks passed." : `${completedCount} of ${steps.length} checks complete`}
              </p>
            </div>
          </div>

          <ul className="space-y-1">
            {steps.map((s) => (
              <li key={s.key} className="flex items-center gap-3 py-2">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  s.done ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                }`}>
                  {s.done ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  ) : stepIcons[s.key]}
                </span>
                <span className={`text-[14px] ${s.done ? "text-slate-900 font-medium" : "text-slate-500"}`}>{s.label}</span>
                <span className={`ml-auto text-[11px] font-semibold ${s.done ? "text-emerald-600" : "text-slate-400"}`}>{s.done ? "Done" : "Pending"}</span>
              </li>
            ))}
          </ul>

          {!allDone && (
            <button
              onClick={onGoToVerification}
              className="mt-5 w-full btn-shimmer text-white font-medium py-3 rounded-full text-[14px] inline-flex items-center justify-center gap-2"
            >
              Continue verification <span aria-hidden>→</span>
            </button>
          )}
        </DashCard>

        {/* How to use your code */}
        <DashCard className="lg:col-span-12 p-6 sm:p-7 dash-enter dash-delay-3">
          <DashLabel className="mb-5">How to use your code</DashLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { n: "01", t: "Add it to applications", d: "Paste your code into job applications, your CV, or your email signature." },
              { n: "02", t: "Employers enter it", d: "Hiring teams enter your code in their AuthentikMe employer dashboard." },
              { n: "03", t: "Instant confirmation", d: "They see in real time that your identity has been verified." },
            ].map(x => (
              <div key={x.n} className="flex gap-4">
                <span className="font-serif italic text-2xl text-blue-600/70 leading-none pt-0.5 w-7 shrink-0">{x.n}</span>
                <div>
                  <p className="text-[15px] font-semibold tracking-tight text-slate-900 mb-1">{x.t}</p>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{x.d}</p>
                </div>
              </div>
            ))}
          </div>
        </DashCard>
      </div>
    </div>
  )
}

/* ─── Verification Tab ─── */

function VerificationTab({
  userStatus, paymentResult, paymentLoading, paymentError, captchaError,
  recaptchaRef, totpStep, qrCode, totpToken, totpLoading, totpError,
  onPay, onCaptcha, onStartTotp, onVerifyTotp, setTotpToken, setTotpStep,
  allDone, copied, copyCode,
  discountCode, discountLoading, discountError, discountSuccess, setDiscountCode, onApplyDiscount,
  resendLoading, resendError, resendCooldown, onResend,
  idPreview, idUploading, idError, idConfirming, idConfirmBarActive, onIdFileSelect,
  idBackPreview, idBackUploading, idBackError, idBackConfirming, idBackConfirmBarActive, onIdBackFileSelect,
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
  discountCode: string
  discountLoading: boolean
  discountError: string
  discountSuccess: boolean
  setDiscountCode: (v: string) => void
  onApplyDiscount: (e: React.FormEvent) => void
  resendLoading: boolean
  resendError: string
  resendCooldown: number
  onResend: () => void
  idPreview: string | null
  idUploading: boolean
  idError: string
  idConfirming: boolean
  idConfirmBarActive: boolean
  onIdFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  idBackPreview: string | null
  idBackUploading: boolean
  idBackError: string
  idBackConfirming: boolean
  idBackConfirmBarActive: boolean
  onIdBackFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="max-w-3xl">
      <DashHeading
        title={<>Verification <span className="gradient-text text-[1.08em]">steps.</span></>}
        subtitle="Complete each step to earn your AuthentikMe verification code."
      />

      {/* Banners */}
      {paymentResult === "success" && !userStatus.stripePaid && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-6 flex items-center gap-3 dash-enter">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
          <p className="text-sm text-blue-800 font-medium">Payment received — confirming…</p>
        </div>
      )}
      {paymentResult === "cancelled" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6 dash-enter">
          <p className="text-sm text-amber-800 font-medium">Payment was cancelled. You can try again below.</p>
        </div>
      )}

      {/* Code card when done */}
      {allDone && userStatus.verificationCode && (
        <div className="mb-6 dash-enter">
          <IdentityCard
            holder={userStatus.name ?? userStatus.email}
            code={userStatus.verificationCode}
            footer={
              <button
                onClick={copyCode}
                className={`shrink-0 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-all ${
                  copied ? "bg-emerald-400 text-slate-950" : "bg-white text-slate-900 hover:bg-blue-50"
                }`}
              >
                {copied ? "Copied!" : "Copy code"}
              </button>
            }
          />
        </div>
      )}

      {/* Steps */}
      <div className="space-y-3">
        <PremiumStepCard number={1} title="Verify your email address" description="Confirm your email to prove it belongs to you." done={userStatus.emailVerified} delay="dash-delay-1">
          {!userStatus.emailVerified && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-amber-800 font-medium">Check your inbox for a verification email and click the link inside.</p>
              </div>
              <button
                onClick={onResend}
                disabled={resendLoading || resendCooldown > 0}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-full disabled:opacity-60 text-[14px] transition-colors"
              >
                {resendLoading ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
                ) : resendCooldown > 0 ? (
                  `Resend verification email (${resendCooldown}s)`
                ) : (
                  "Resend verification email"
                )}
              </button>
              {resendError && <p className="text-xs text-red-500 text-center">{resendError}</p>}
              {resendCooldown > 0 && !resendError && <p className="text-xs text-emerald-600 text-center">Verification email sent — check your inbox.</p>}
            </div>
          )}
        </PremiumStepCard>

        <PremiumStepCard number={2} title="Human verification" description="Complete a quick reCAPTCHA to confirm you're not a bot." done={userStatus.recaptchaDone} locked={!userStatus.emailVerified} delay="dash-delay-2">
          {!userStatus.recaptchaDone && userStatus.emailVerified && (
            <div>
              {captchaError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-3">{captchaError}</div>
              )}
              <div className="flex justify-center">
                <ReCAPTCHA ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={onCaptcha} />
              </div>
            </div>
          )}
        </PremiumStepCard>

        <PremiumStepCard number={3} title="Subscribe — $1.99/month" description="This fee covers the cost of verifying your government-issued ID and keeps your verified badge and ATK code active." done={userStatus.stripePaid} locked={!userStatus.recaptchaDone} delay="dash-delay-3">
          {!userStatus.stripePaid && userStatus.recaptchaDone && (
            <div className="space-y-4">
              <button
                onClick={onPay}
                disabled={paymentLoading}
                className="w-full flex items-center justify-center gap-2 btn-shimmer text-white font-medium py-3.5 px-6 rounded-full disabled:opacity-60 text-[14px]"
              >
                {paymentLoading ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Redirecting to payment…</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> Subscribe $1.99/mo with Stripe</>
                )}
              </button>
              {paymentError && <p className="text-xs text-red-600 text-center">{paymentError}</p>}

              <div className="flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5">
                <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your subscription funds the verification of your government-issued ID in the next step, along with the ongoing upkeep of your verified ATK badge.
                </p>
              </div>

              {/* Discount code */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Have a discount code?</p>
                <form onSubmit={onApplyDiscount} className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-semibold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:normal-case placeholder:tracking-normal placeholder:font-normal"
                    maxLength={20}
                  />
                  <button
                    type="submit"
                    disabled={discountLoading || !discountCode.trim()}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {discountLoading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : "Apply"}
                  </button>
                </form>
                {discountError && <p className="text-xs text-red-600 mt-2">{discountError}</p>}
                {discountSuccess && <p className="text-xs text-emerald-600 font-semibold mt-2">Discount applied! Subscription activated.</p>}
              </div>
            </div>
          )}
        </PremiumStepCard>

        <PremiumStepCard number={4} title="Upload a government-issued ID" description="Take a clear photo of your driver's license, passport, state ID, or other government-issued ID to confirm your identity. This information is never held for longer than 24 hours." done={userStatus.idUploaded} locked={!userStatus.stripePaid} forceShowChildren delay="dash-delay-4">
          {userStatus.stripePaid && (
            <div className="space-y-5">

              {/* Front — required */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Front of ID</p>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wide">Required</span>
                </div>

                {userStatus.idUploaded ? (
                  <div className="space-y-3">
                    {idPreview && (
                      <div className="rounded-xl overflow-hidden border border-slate-200">
                        <img src={idPreview} alt="Front of ID preview" className="w-full max-h-56 object-cover" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                      <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm font-semibold text-emerald-700">Front photo uploaded</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {idPreview && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 relative">
                        <img src={idPreview} alt="Front of ID preview" className={`w-full max-h-56 object-cover transition-opacity ${idConfirming ? "opacity-40" : ""}`} />
                      </div>
                    )}

                    {idConfirming ? (
                      <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-5 space-y-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
                          <span className="text-sm font-semibold text-blue-700">AI verification in progress…</span>
                        </div>
                        <div className="h-2 rounded-full bg-blue-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                            style={{ width: idConfirmBarActive ? "100%" : "0%", transition: "width 15000ms linear" }}
                          />
                        </div>
                        <p className="text-xs text-blue-400 text-center">Our AI is verifying your document and screening for signs of fraud or tampering…</p>
                      </div>
                    ) : (
                      <>
                        <label
                          className={`w-full flex items-center justify-center gap-2 font-medium py-3.5 rounded-full text-[14px] transition-colors ${
                            idUploading ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "btn-shimmer text-white cursor-pointer"
                          }`}
                        >
                          {idUploading ? (
                            <><div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> Uploading…</>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {idPreview ? "Retake or choose another photo" : "Take or upload a photo of the front"}
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            disabled={idUploading}
                            onChange={onIdFileSelect}
                          />
                        </label>
                        <p className="text-xs text-slate-400 text-center">Make sure your name and photo are clearly visible. JPG, PNG, or WEBP.</p>
                        {idError && <p className="text-xs text-red-600 text-center">{idError}</p>}
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Back — optional */}
              <div className="space-y-3 border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Back of ID</p>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wide">Optional</span>
                </div>

                {userStatus.idBackUploaded ? (
                  <div className="space-y-3">
                    {idBackPreview && (
                      <div className="rounded-xl overflow-hidden border border-slate-200">
                        <img src={idBackPreview} alt="Back of ID preview" className="w-full max-h-56 object-cover" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                      <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm font-semibold text-emerald-700">Back photo uploaded</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {idBackPreview && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 relative">
                        <img src={idBackPreview} alt="Back of ID preview" className={`w-full max-h-56 object-cover transition-opacity ${idBackConfirming ? "opacity-40" : ""}`} />
                      </div>
                    )}

                    {idBackConfirming ? (
                      <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-5 space-y-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
                          <span className="text-sm font-semibold text-blue-700">AI verification in progress…</span>
                        </div>
                        <div className="h-2 rounded-full bg-blue-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                            style={{ width: idBackConfirmBarActive ? "100%" : "0%", transition: "width 15000ms linear" }}
                          />
                        </div>
                        <p className="text-xs text-blue-400 text-center">Our AI is verifying your document and screening for signs of fraud or tampering…</p>
                      </div>
                    ) : (
                      <>
                        <label
                          className={`w-full flex items-center justify-center gap-2 font-medium py-3.5 rounded-full text-[14px] transition-colors ${
                            idBackUploading ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          }`}
                        >
                          {idBackUploading ? (
                            <><div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> Uploading…</>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {idBackPreview ? "Retake or choose another photo" : "Take or upload a photo of the back"}
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            disabled={idBackUploading}
                            onChange={onIdBackFileSelect}
                          />
                        </label>
                        <p className="text-xs text-slate-400 text-center">Not required — add it only if your ID has details on both sides.</p>
                        {idBackError && <p className="text-xs text-red-600 text-center">{idBackError}</p>}
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5">
                <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your ID is used only to confirm your identity. Once your verification is confirmed, the document is permanently deleted from our systems — we retain no copy of any government ID beyond 24 hours.
                </p>
              </div>
            </div>
          )}
        </PremiumStepCard>

        <PremiumStepCard number={5} title="Set up Google Authenticator" description="Add two-factor authentication for maximum identity security." done={userStatus.totpEnabled} locked={!userStatus.idUploaded} delay="dash-delay-5">
          {!userStatus.totpEnabled && userStatus.idUploaded && (
            <div>
              {totpStep === "idle" && (
                <button onClick={onStartTotp} className="w-full btn-shimmer text-white font-medium py-3.5 rounded-full text-[14px]">
                  Generate QR Code
                </button>
              )}
              {totpStep === "scan" && (
                <div className="text-center">
                  {qrCode ? (
                    <>
                      <p className="text-sm text-slate-600 mb-4">Open <strong>Google Authenticator</strong> → tap <strong>+</strong> → <strong>Scan a QR code</strong></p>
                      <div className="inline-block p-3 bg-white border border-slate-200 rounded-2xl shadow-sm mb-4">
                        <img src={qrCode} alt="TOTP QR Code" width={160} />
                      </div>
                      <button onClick={() => setTotpStep("verify")} className="w-full btn-shimmer text-white font-medium py-3.5 rounded-full text-[14px]">
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
                <form onSubmit={onVerifyTotp} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Enter the 6-digit code from your authenticator app</label>
                    <input
                      type="text" inputMode="numeric" maxLength={6} required
                      value={totpToken}
                      onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, ""))}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="000000" autoFocus
                    />
                  </div>
                  {totpError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{totpError}</div>}
                  <button
                    type="submit" disabled={totpLoading || totpToken.length !== 6}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3.5 rounded-full transition-colors disabled:opacity-50 text-[14px]"
                  >
                    {totpLoading ? "Verifying…" : "Verify & Complete Setup"}
                  </button>
                  <button type="button" onClick={() => setTotpStep("scan")} className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors">
                    ← Back to QR code
                  </button>
                </form>
              )}
            </div>
          )}
        </PremiumStepCard>
      </div>
    </div>
  )
}

/* ─── Settings Tab ─── */

function SettingsTab({ userStatus, onStatusChange }: { userStatus: Status; onStatusChange: () => void }) {
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelError, setCancelError] = useState("")
  const [cancelConfirm, setCancelConfirm] = useState(false)

  async function handleCancel() {
    setCancelLoading(true)
    setCancelError("")
    try {
      const res = await fetch("/api/candidate/cancel-subscription", { method: "POST" })
      const data = await res.json()
      if (!res.ok) { setCancelError(data.error || "Failed to cancel."); setCancelLoading(false); return }
      setCancelConfirm(false)
      onStatusChange()
    } catch {
      setCancelError("Something went wrong. Please try again.")
      setCancelLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <DashHeading
        title={<>Account <span className="gradient-text text-[1.08em]">settings.</span></>}
        subtitle="Manage your profile, security, and subscription."
      />

      {/* Profile */}
      <div className="bg-white rounded-[22px] border border-slate-900/[0.06] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.12)] mb-4 overflow-hidden dash-enter dash-delay-1">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">Profile</h2>
        </div>

        <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-white text-xl font-semibold select-none">
            {(userStatus.name ?? userStatus.email)[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{userStatus.name ?? "—"}</p>
            <p className="text-sm text-slate-500">{userStatus.email}</p>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          <div className="px-6 py-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
            <p className="text-sm text-slate-800 font-medium">{userStatus.name ?? "—"}</p>
          </div>
          <div className="px-6 py-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-800 font-medium">{userStatus.email}</p>
              {userStatus.emailVerified && (
                <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-[22px] border border-slate-900/[0.06] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.12)] mb-4 overflow-hidden dash-enter dash-delay-2">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">Security</h2>
        </div>
        <div className="divide-y divide-slate-50">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500 mt-0.5">Google Authenticator (TOTP)</p>
            </div>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              userStatus.totpEnabled
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-slate-100 text-slate-500 border border-slate-200"
            }`}>
              {userStatus.totpEnabled && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
              {userStatus.totpEnabled ? "Enabled" : "Not set up"}
            </span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Subscription</p>
              <p className="text-xs text-slate-500 mt-0.5">$1.99/month · billed on the 16th</p>
            </div>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              userStatus.stripePaid
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-amber-50 text-amber-700 border border-amber-100"
            }`}>
              {userStatus.stripePaid ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* Subscription management */}
      {userStatus.stripePaid && (
        <div className="bg-white rounded-[22px] border border-rose-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] mb-4 overflow-hidden dash-enter dash-delay-3">
          <div className="px-6 py-4 border-b border-red-50 flex items-center gap-2">
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">Subscription</h2>
          </div>
          <div className="px-6 py-5">
            {!cancelConfirm ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Cancel subscription</p>
                  <p className="text-xs text-slate-500 mt-0.5">Your badge and ATK code will be revoked immediately.</p>
                </div>
                <button
                  onClick={() => setCancelConfirm(true)}
                  className="text-sm font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 px-4 py-2 rounded-xl transition-colors"
                >
                  Cancel plan
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-red-800">Are you sure?</p>
                  <p className="text-xs text-red-600 mt-0.5">Your verification badge and ATK code will stop working immediately. You can resubscribe at any time.</p>
                </div>
                {cancelError && <p className="text-xs text-red-600">{cancelError}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={cancelLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60"
                  >
                    {cancelLoading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : "Yes, cancel"}
                  </button>
                  <button
                    onClick={() => { setCancelConfirm(false); setCancelError("") }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    Keep subscription
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account */}
      <div className={`bg-white rounded-[22px] border border-slate-900/[0.06] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.12)] overflow-hidden dash-enter ${userStatus.stripePaid ? "dash-delay-4" : "dash-delay-3"}`}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">Account</h2>
        </div>
        <div className="px-6 py-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2.5 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out of AuthentikMe
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Premium Step Card ─── */

function PremiumStepCard({
  number, title, description, done, locked = false, delay = "", forceShowChildren = false, children,
}: {
  number: number
  title: string
  description: string
  done: boolean
  locked?: boolean
  delay?: string
  forceShowChildren?: boolean
  children?: React.ReactNode
}) {
  return (
    <div
      className={`rounded-[22px] border transition-all duration-300 dash-enter ${delay} ${
        done
          ? "bg-white border-emerald-500/20 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          : locked
          ? "bg-white/50 border-slate-900/[0.05]"
          : "bg-white border-blue-500/25 shadow-[0_0_0_4px_rgba(59,130,246,0.06),0_16px_40px_-20px_rgba(15,23,42,0.25)]"
      }`}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Step indicator */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[15px] font-semibold ${
            done
              ? "bg-emerald-500 text-white"
              : locked
              ? "bg-slate-100 text-slate-300"
              : "bg-slate-900 text-white shadow-[0_8px_20px_-8px_rgba(15,23,42,0.6)]"
          }`}>
            {done ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : locked ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ) : number}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className={`font-semibold text-[15px] tracking-tight ${locked ? "text-slate-400" : "text-slate-900"}`}>
                {title}
              </h3>
              {done && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Complete</span>
              )}
              {!done && !locked && (
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">Up next</span>
              )}
              {locked && !done && (
                <span className="text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">Locked</span>
              )}
            </div>
            <p className={`text-[14px] leading-relaxed ${locked ? "text-slate-400/80" : "text-slate-500"}`}>
              {description}
            </p>
          </div>
        </div>

        {!locked && children && (!done || forceShowChildren) && (
          <div className="mt-5 sm:ml-14">{children}</div>
        )}
      </div>
    </div>
  )
}
