"use client"
import { useState } from "react"
import Link from "next/link"
import AuthShell, { AuthSuccess } from "../../components/AuthShell"

type AccountType = "candidate" | "employer"

export default function SignupPage() {
  const [accountType, setAccountType] = useState<AccountType>("candidate")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function switchTab(tab: AccountType) {
    setAccountType(tab)
    setError("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service to create an account.")
      return
    }

    setLoading(true)
    const fullName = `${firstName.trim()} ${lastName.trim()}`

    try {
      if (accountType === "candidate") {
        const res = await fetch("/api/candidate/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: fullName, email, password, agreedToTerms }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error || "Something went wrong. Please try again."); return }
        setSuccess(true)
      } else {
        const res = await fetch("/api/employer/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: fullName, company, email, password, agreedToTerms }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error || "Something went wrong. Please try again."); return }
        setSuccess(true)
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthSuccess
        tone={accountType === "candidate" ? "success" : "pending"}
        title={accountType === "candidate" ? "Check your email" : "Submitted for approval"}
        action={
          <Link href="/login" className="btn-shimmer inline-flex items-center gap-2 text-white font-medium px-8 py-3.5 rounded-full text-[15px]">
            Go to sign in <span aria-hidden>→</span>
          </Link>
        }
      >
        {accountType === "candidate"
          ? <>We sent a verification link to <strong className="text-slate-900 font-medium">{email}</strong>. Click it to continue your setup.</>
          : <>Employer accounts are reviewed manually before they can access candidate verification. We&apos;ll email <strong className="text-slate-900 font-medium">{email}</strong> as soon as your account is approved.</>}
      </AuthSuccess>
    )
  }

  const tabs: { key: AccountType; label: string }[] = [
    { key: "candidate", label: "I'm a candidate" },
    { key: "employer", label: "I'm an employer" },
  ]

  return (
    <AuthShell
      panel={accountType}
      title={accountType === "candidate"
        ? <>Get <span className="gradient-text text-[1.08em]">verified.</span></>
        : <>Register your <span className="gradient-text text-[1.08em]">company.</span></>}
      subtitle={accountType === "candidate"
        ? "Create your account and prove to employers you're the real deal."
        : "Create an employer account to confirm candidate identities instantly."}
    >
      {/* Account type switch */}
      <div className="grid grid-cols-2 p-1 mb-8 rounded-full bg-slate-900/[0.05] border border-slate-900/[0.06]" role="tablist">
        {tabs.map(t => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={accountType === t.key}
            onClick={() => switchTab(t.key)}
            className={`py-2.5 rounded-full text-sm font-medium transition-all ${
              accountType === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="su-first" className="auth-label">First name</label>
            <input id="su-first" type="text" required autoComplete="given-name" value={firstName} onChange={e => setFirstName(e.target.value)} className="auth-input" placeholder="Jane" />
          </div>
          <div>
            <label htmlFor="su-last" className="auth-label">Last name</label>
            <input id="su-last" type="text" required autoComplete="family-name" value={lastName} onChange={e => setLastName(e.target.value)} className="auth-input" placeholder="Smith" />
          </div>
        </div>

        {accountType === "employer" && (
          <div>
            <label htmlFor="su-company" className="auth-label">Company name</label>
            <input id="su-company" type="text" required autoComplete="organization" value={company} onChange={e => setCompany(e.target.value)} className="auth-input" placeholder="Acme Corp" />
          </div>
        )}

        <div>
          <label htmlFor="su-email" className="auth-label">{accountType === "employer" ? "Work email" : "Email address"}</label>
          <input id="su-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="auth-input" placeholder={accountType === "employer" ? "hr@company.com" : "you@example.com"} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="su-password" className="auth-label">Password</label>
            <input id="su-password" type="password" required autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} className="auth-input" placeholder="8+ characters" />
          </div>
          <div>
            <label htmlFor="su-confirm" className="auth-label">Confirm password</label>
            <input
              id="su-confirm"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={`auth-input ${confirmPassword && confirmPassword !== password ? "is-invalid" : ""}`}
              placeholder="Re-enter password"
            />
          </div>
        </div>
        {confirmPassword && confirmPassword !== password && (
          <p className="text-rose-600 text-xs -mt-2">Passwords do not match</p>
        )}

        <div className="flex items-start gap-3">
          <input id="agreedToTerms" type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="auth-checkbox" />
          <label htmlFor="agreedToTerms" className="text-[13px] text-slate-600 leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" target="_blank" className="auth-link">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" target="_blank" className="auth-link">Privacy Policy</Link>
            {accountType === "candidate"
              ? ", including the one-time $12.99 verification fee charged when I complete the payment step."
              : "."}
          </label>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-shimmer text-white font-medium py-4 rounded-full text-[15px] disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading
            ? "Creating account…"
            : accountType === "candidate"
              ? "Create candidate account"
              : "Create employer account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="auth-link">Sign in</Link>
      </p>
    </AuthShell>
  )
}
