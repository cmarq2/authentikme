"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AuthShell from "../../components/AuthShell"

export default function EmployerSignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await fetch("/api/employer/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, company, email, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    router.push("/login?registered=employer")
  }

  return (
    <AuthShell
      panel="employer"
      title={<>Register your <span className="gradient-text text-[1.08em]">company.</span></>}
      subtitle="Create an employer account to confirm candidate identities instantly."
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

        {error && <div className="auth-error">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-shimmer text-white font-medium py-4 rounded-full text-[15px] disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? "Creating account…" : "Create employer account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="auth-link">Sign in</Link>
      </p>
    </AuthShell>
  )
}

