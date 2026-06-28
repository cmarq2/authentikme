"use client"
import { useState } from "react"
import Link from "next/link"

type AccountType = "candidate" | "employer"

export default function SignupPage() {
  const [accountType, setAccountType] = useState<AccountType>("candidate")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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

    setLoading(true)
    const fullName = `${firstName.trim()} ${lastName.trim()}`

    try {
      if (accountType === "candidate") {
        const res = await fetch("/api/candidate/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: fullName, email, password }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error || "Something went wrong. Please try again."); return }
        setSuccess(true)
      } else {
        const res = await fetch("/api/employer/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: fullName, company, email, password }),
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {accountType === "candidate" ? "Check your email" : "Account created!"}
            </h2>
            <p className="text-gray-700 text-sm mb-6">
              {accountType === "candidate"
                ? <>We sent a verification link to <strong>{email}</strong>. Click it to continue your setup.</>
                : <>Your employer account is ready. You can now sign in.</>}
            </p>
            <Link href="/login" className="btn-shimmer inline-block text-white font-semibold px-8 py-3 rounded-xl text-sm">
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Back to site */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to site
          </Link>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-gray-900">
            Authentik<span className="text-blue-600">Me</span>
          </Link>
          <p className="text-gray-600 mt-2 text-sm">Create your account to get started</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Account type tabs */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => switchTab("candidate")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                accountType === "candidate"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              I&apos;m a Candidate
            </button>
            <button
              type="button"
              onClick={() => switchTab("employer")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                accountType === "employer"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              I&apos;m an Employer
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-5">

            {/* First + Last name row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Smith"
                />
              </div>
            </div>

            {/* Company name — employer only */}
            {accountType === "employer" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company name</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Acme Corp"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder={accountType === "employer" ? "hr@company.com" : "you@example.com"}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="At least 8 characters"
              />
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition ${
                  confirmPassword && confirmPassword !== password
                    ? "border-red-300 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Re-enter your password"
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-shimmer text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-60 text-sm"
            >
              {loading
                ? "Creating account…"
                : accountType === "candidate"
                  ? "Create Candidate Account"
                  : "Create Employer Account"}
            </button>
          </form>

          <div className="px-5 sm:px-8 pb-6 sm:pb-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
