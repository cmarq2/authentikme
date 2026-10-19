"use client"
import { useState } from "react"
import Link from "next/link"
import AuthShell, { AuthSuccess } from "../../components/AuthShell"

export default function EmployerSignupPage() {
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service to create an account.")
      return
    }

    setLoading(true)

    const res = await fetch("/api/employer/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, company, email, password, agreedToTerms }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.")
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AuthSuccess
        tone="pending"
        title="Submitted for approval"
        action={
          <Link href="/" className="btn-shimmer inline-flex items-center gap-2 text-white font-medium px-8 py-3.5 rounded-full text-[15px]">
            Back to site <span aria-hidden>→</span>
          </Link>
        }
      >
        Employer accounts are reviewed manually before they can access candidate
        verification. We&apos;ll email <strong className="text-slate-900 font-medium">{email}</strong> as soon as your account is
        approved.
      </AuthSuccess>
    )
  }

  return (
    <AuthShell
      panel="employer"
      title={<>Register your <span className="gradient-text text-[1.08em]">company.</span></>}
      subtitle={<>Create an employer account to confirm candidate identities instantly. Recruiter plan: <strong className="text-slate-900 font-semibold">$199.99/month</strong> · <Link href="/pricing" className="auth-link">See pricing</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="emp-name" className="auth-label">Your name</label>
            <input id="emp-name" type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="auth-input" placeholder="John Doe" />
          </div>
          <div>
            <label htmlFor="emp-company" className="auth-label">Company name</label>
            <input id="emp-company" type="text" required autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} className="auth-input" placeholder="Acme Corp" />
          </div>
        </div>
        <div>
          <label htmlFor="emp-email" className="auth-label">Work email</label>
          <input id="emp-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" placeholder="hr@company.com" />
        </div>
        <div>
          <label htmlFor="emp-password" className="auth-label">Password</label>
          <input id="emp-password" type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" placeholder="At least 8 characters" />
        </div>

        <div className="flex items-start gap-3">
          <input id="agreedToTerms" type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="auth-checkbox" />
          <label htmlFor="agreedToTerms" className="text-[13px] text-slate-600 leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" target="_blank" className="auth-link">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" target="_blank" className="auth-link">Privacy Policy</Link>
            , including the $199.99 per month recruiter plan.
          </label>
        </div>

        <div className="flex gap-3 rounded-xl border border-blue-500/15 bg-blue-50/60 px-4 py-3 text-[13px] text-slate-600 leading-relaxed">
          <svg className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Employer accounts are manually reviewed before activation. You&apos;ll receive an email once yours is approved.
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-shimmer text-white font-medium py-4 rounded-full text-[15px] disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? "Submitting…" : "Submit for approval"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="auth-link">Sign in</Link>
      </p>
    </AuthShell>
  )
}

