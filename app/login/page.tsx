"use client"
import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import AuthShell from "../components/AuthShell"

const PENDING_APPROVAL_MESSAGE =
  "Your employer account is still awaiting approval. We'll email you as soon as it's reviewed."
const REJECTED_MESSAGE =
  "This employer account was not approved. Reply to our email or contact us if you think that's a mistake."

function signInErrorMessage(error: string) {
  if (error.includes("EMPLOYER_PENDING_APPROVAL")) return PENDING_APPROVAL_MESSAGE
  if (error.includes("EMPLOYER_REJECTED")) return REJECTED_MESSAGE
  return "Invalid email or password."
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(() => {
    const initial = searchParams.get("error")
    return initial ? signInErrorMessage(initial) : ""
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError(signInErrorMessage(res.error))
      return
    }

    // Fetch session to determine role and redirect
    const sessionRes = await fetch("/api/auth/session")
    const session = await sessionRes.json()
    const role = session?.user?.role

    if (role === "EMPLOYER") {
      router.push("/employer/dashboard")
    } else {
      router.push("/candidate/dashboard")
    }
  }

  return (
    <AuthShell
      panel="signin"
      title={<>Welcome <span className="gradient-text text-[1.08em]">back.</span></>}
      subtitle="Sign in to manage your verification or confirm a candidate."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="login-email" className="auth-label">Email address</label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="login-password" className="auth-label !mb-0">Password</label>
            <Link href="/forgot-password" className="auth-link text-[13px]">
              Forgot password?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            placeholder="••••••••"
          />
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-shimmer text-white font-medium py-4 rounded-full text-[15px] disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-900/[0.08]" /></div>
        <p className="relative mx-auto w-fit bg-[#F8F7F4] px-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">New here?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/candidate/signup" className="group rounded-2xl border border-slate-900/[0.08] bg-white px-4 py-3.5 hover:border-blue-500/40 hover:shadow-md transition-all">
          <p className="text-[14px] font-medium text-slate-900">I&apos;m a candidate</p>
          <p className="text-[12px] text-slate-500">Get verified <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span></p>
        </Link>
        <Link href="/employer/signup" className="group rounded-2xl border border-slate-900/[0.08] bg-white px-4 py-3.5 hover:border-blue-500/40 hover:shadow-md transition-all">
          <p className="text-[14px] font-medium text-slate-900">I&apos;m an employer</p>
          <p className="text-[12px] text-slate-500">Register your company <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span></p>
        </Link>
      </div>
    </AuthShell>
  )
}

