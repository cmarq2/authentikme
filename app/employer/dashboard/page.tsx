"use client"
import React, { Suspense, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

type VerifyResult = {
  verified: boolean
  message?: string
  candidate?: { name: string | null; email: string }
}

type Tab = "overview" | "verify" | "settings"

export default function EmployerDashboard() {
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
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [history, setHistory] = useState<{ code: string; result: VerifyResult; time: string }[]>([])

  useEffect(() => {
    if (sessionStatus === "unauthenticated") router.push("/login")
  }, [sessionStatus, router])

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setResult(null)
    setLoading(true)

    const res = await fetch("/api/employer/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim() }),
    })

    const data: VerifyResult = await res.json()
    setLoading(false)
    setResult(data)

    setHistory(prev => [
      { code: code.trim().toUpperCase(), result: data, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 4),
    ])
  }

  function clearVerify() {
    setCode("")
    setResult(null)
  }

  if (sessionStatus === "loading") return <Spinner full />

  const user = session?.user as { name?: string; email?: string; company?: string } | undefined
  const displayName = user?.name ?? user?.email ?? "Employer"
  const displayEmail = user?.email ?? ""
  const displayCompany = (user as { company?: string } | undefined)?.company ?? "Your Company"
  const initials = displayName.slice(0, 1).toUpperCase()

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "overview", label: "Overview",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: "verify", label: "Verify Code",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
    {
      id: "settings", label: "Settings",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">

      {/* ── Header ── */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 shrink-0 z-20 relative">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <Link href="/" className="text-xl font-bold text-white tracking-tight">
            Authentik<span className="text-blue-400">Me</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-slate-300 font-medium">{displayName}</span>
              <span className="text-xs text-slate-500">{displayCompany}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold select-none ring-2 ring-violet-500/30">
              {initials}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-xl mx-auto w-full">

        {/* ── Sidebar (desktop) ── */}
        <aside className="w-60 shrink-0 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col py-6 px-3">
          <div className="px-2 mb-2">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">Navigation</p>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                    isActive
                      ? "text-blue-300 sidebar-item-active"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <span className={isActive ? "text-blue-400" : "text-slate-500"}>{item.icon}</span>
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="mt-auto px-3">
            <div className="border-t border-slate-800 pt-4">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          <div className="px-4 sm:px-8 py-8 max-w-4xl">

            {activeTab === "overview" && <OverviewTab name={displayName} company={displayCompany} email={displayEmail} history={history} setActiveTab={setActiveTab} />}
            {activeTab === "verify" && <VerifyTab code={code} setCode={setCode} loading={loading} result={result} onSubmit={handleVerify} onClear={clearVerify} />}
            {activeTab === "settings" && <SettingsTab name={displayName} email={displayEmail} company={displayCompany} />}

          </div>
        </main>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-slate-900/95 backdrop-blur border-t border-slate-800 flex">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center scale-125">{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

/* ──────────────────────────── Overview Tab ──────────────────────────── */

function OverviewTab({
  name, company, email, history,
  setActiveTab,
}: {
  name: string; company: string; email: string
  history: { code: string; result: VerifyResult; time: string }[]
  setActiveTab: (t: Tab) => void
}) {
  return (
    <div className="dash-enter space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-black text-white">Welcome back</h1>
        <p className="text-slate-400 text-sm mt-1">Verify candidate identities instantly from your dashboard.</p>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 dash-enter dash-delay-1">
        <StatCard
          label="Lookups Today"
          value={history.length.toString()}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          }
          color="blue"
        />
        <StatCard
          label="Verified"
          value={history.filter(h => h.result.verified).length.toString()}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
        />
        <StatCard
          label="Not Found"
          value={history.filter(h => !h.result.verified).length.toString()}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          }
          color="red"
        />
      </div>

      {/* Verify CTA card */}
      <div
        className="dash-enter dash-delay-2 relative rounded-2xl overflow-hidden cursor-pointer group"
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #4f46e5 100%)" }}
        onClick={() => setActiveTab("verify")}
      >
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
        <div className="relative p-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Quick Action</p>
            <h3 className="text-white text-xl font-black mb-1">Verify a Candidate</h3>
            <p className="text-blue-200/80 text-sm">Enter the code a candidate shared with you to instantly confirm their identity is real and verified.</p>
          </div>
          <div className="shrink-0 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Recent lookups */}
      <div className="dash-enter dash-delay-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Recent Lookups</h2>
        {history.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 text-center">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No lookups yet. Verify a candidate code to see results here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((h, i) => (
              <div
                key={i}
                className="bg-slate-900 rounded-xl border border-slate-800 px-4 py-3 flex items-center gap-3"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${h.result.verified ? "bg-green-500/15" : "bg-red-500/15"}`}>
                  {h.result.verified ? (
                    <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-mono font-semibold">{h.code}</p>
                  <p className="text-slate-500 text-xs">{h.result.verified ? h.result.candidate?.name ?? "Verified" : "Not verified"}</p>
                </div>
                <span className="text-slate-600 text-xs">{h.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account summary */}
      <div className="dash-enter dash-delay-4 bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Account</h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-lg font-black shrink-0 ring-4 ring-violet-500/20">
            {name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-semibold">{name}</p>
            <p className="text-slate-400 text-sm">{company}</p>
            <p className="text-slate-500 text-xs">{email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: "blue" | "green" | "red" }) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
  }
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-slate-500 text-xs font-medium mt-0.5">{label}</p>
    </div>
  )
}

/* ──────────────────────────── Verify Tab ──────────────────────────── */

function VerifyTab({
  code, setCode, loading, result, onSubmit, onClear,
}: {
  code: string
  setCode: (v: string) => void
  loading: boolean
  result: VerifyResult | null
  onSubmit: (e: React.FormEvent) => void
  onClear: () => void
}) {
  return (
    <div className="dash-enter space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Verify a Candidate</h1>
        <p className="text-slate-400 text-sm mt-1">Enter the verification code a candidate has shared with you. The system checks it is real, current, and fully verified.</p>
      </div>

      {/* Main verify card */}
      <div className="dash-enter dash-delay-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        {/* Top accent */}
        <div className="h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

        <div className="p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Candidate Verification Code
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase())
                  if (result) onClear()
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 font-mono text-xl tracking-[0.25em] text-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-slate-600 placeholder:tracking-widest uppercase"
                placeholder="ATK-XXXX-XXXX"
                spellCheck={false}
                autoComplete="off"
              />
              <p className="text-slate-600 text-xs mt-2 text-center">Ask the candidate to share their code from the AuthentikMe dashboard</p>
            </div>

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full btn-shimmer text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-50 transition-opacity"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying…
                </span>
              ) : "Verify Identity →"}
            </button>
          </form>
        </div>
      </div>

      {/* Result card */}
      {result && (
        <div className={`dash-enter rounded-2xl border overflow-hidden ${result.verified ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
          <div className={`h-0.5 ${result.verified ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-red-500 to-rose-500"}`} />
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-5">
              {/* Big status icon */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${result.verified ? "bg-gradient-to-br from-green-400 to-emerald-600 shadow-green-500/25" : "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/25"}`}>
                {result.verified ? (
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>

              <div className="flex-1">
                <p className={`text-xl font-black mb-1 ${result.verified ? "text-green-300" : "text-red-300"}`}>
                  {result.verified ? "Identity Verified" : "Not Verified"}
                </p>

                {result.verified && result.candidate ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Full Name</p>
                        <p className="text-white font-semibold">{result.candidate.name ?? "N/A"}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Email Address</p>
                        <p className="text-white font-semibold">{result.candidate.email}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {[
                        { label: "Email confirmed", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                        { label: "Human check passed", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                        { label: "2FA verified", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
                      ].map((badge) => (
                        <span key={badge.label} className="inline-flex items-center gap-1.5 bg-green-500/15 border border-green-500/30 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={badge.icon} />
                          </svg>
                          {badge.label}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-slate-400 text-sm mt-1">{result.message ?? "This code was not found or the candidate has not completed full verification."}</p>
                )}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10">
              <button
                onClick={onClear}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                ← Verify another code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How it works strip */}
      {!result && (
        <div className="dash-enter dash-delay-2 bg-slate-900 rounded-2xl border border-slate-800 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">How It Works</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: "01", label: "Candidate Gets Code", desc: "After completing email, payment, and 2FA — they receive a unique code." },
              { step: "02", label: "Candidate Shares It", desc: "They copy it from their dashboard and paste it in an application or email." },
              { step: "03", label: "You Verify Instantly", desc: "Enter it above and get real-time confirmation the identity is genuine." },
            ].map((s) => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5">
                  {s.step}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{s.label}</p>
                  <p className="text-slate-500 text-xs leading-relaxed mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────── Settings Tab ──────────────────────────── */

function SettingsTab({ name, email, company }: { name: string; email: string; company: string }) {
  return (
    <div className="dash-enter space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your employer account details.</p>
      </div>

      {/* Profile card */}
      <div className="dash-enter dash-delay-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-violet-500 to-blue-500" />
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black ring-4 ring-violet-500/20">
                {name.slice(0, 1).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">{name}</p>
              <p className="text-violet-400 text-sm font-semibold">Employer Account</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-800 rounded-xl px-4 py-3.5 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Full Name</p>
                <p className="text-white font-medium mt-0.5">{name}</p>
              </div>
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div className="bg-slate-800 rounded-xl px-4 py-3.5 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Company</p>
                <p className="text-white font-medium mt-0.5">{company}</p>
              </div>
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div className="bg-slate-800 rounded-xl px-4 py-3.5">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Email</p>
              <p className="text-white font-medium mt-0.5">{email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="dash-enter dash-delay-2 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500" />
        <div className="p-6">
          <h2 className="text-white font-bold mb-4">Security</h2>
          <div className="bg-slate-800 rounded-xl px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/15 border border-blue-500/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Password</p>
                <p className="text-slate-500 text-xs">Last updated at account creation</p>
              </div>
            </div>
            <span className="text-xs text-slate-500 bg-slate-700 px-2.5 py-1 rounded-full">••••••••</span>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="dash-enter dash-delay-3 bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h2 className="text-white font-bold mb-4">Account Actions</h2>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Sign out of this account
        </button>
      </div>
    </div>
  )
}
