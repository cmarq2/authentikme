"use client"
import React, { Suspense, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import DashboardShell, { DashCard, DashHeading, DashLabel, type DashNavItem } from "../../components/DashboardShell"

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

    const body = await res.json()
    const data: VerifyResult = res.ok
      ? body
      : { verified: false, message: body.error || "Verification failed. Please try again." }
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
      id: "verify", label: "Verify Code",
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
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
      user={{ name: displayName, email: displayEmail, role: displayCompany }}
      status={
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-900/10 px-3 py-1.5 text-[12px] font-medium text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Employer account
        </span>
      }
    >
      {activeTab === "overview" && <OverviewTab name={displayName} company={displayCompany} email={displayEmail} history={history} setActiveTab={setActiveTab} />}
      {activeTab === "verify" && <VerifyTab code={code} setCode={setCode} loading={loading} result={result} onSubmit={handleVerify} onClear={clearVerify} />}
      {activeTab === "settings" && <SettingsTab name={displayName} email={displayEmail} company={displayCompany} />}
    </DashboardShell>
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
  const firstName = name.split(" ")[0]
  const verifiedCount = history.filter(h => h.result.verified).length

  return (
    <div>
      <DashHeading
        title={<>Welcome back, <span className="gradient-text text-[1.08em]">{firstName}.</span></>}
        subtitle="Verify candidate identities instantly from your dashboard."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Verify CTA */}
        <button
          onClick={() => setActiveTab("verify")}
          className="lg:col-span-7 group relative text-left rounded-[26px] overflow-hidden text-white grain dash-enter dash-delay-1 shadow-[0_30px_60px_-24px_rgba(15,23,42,0.65)]"
          style={{ background: "radial-gradient(120% 120% at 100% 0%, #1e3a8a 0%, #0f172a 45%, #020617 100%)" }}
        >
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full border border-white/[0.07]" />
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-white/[0.07]" />
          <div className="relative p-7 sm:p-9 h-full flex flex-col">
            <p className="eyebrow text-blue-300 mb-5">Quick action</p>
            <h2 className="text-3xl sm:text-[2.2rem] font-semibold tracking-[-0.03em] leading-[1.1] mb-3">
              Verify a <span className="gradient-text-light text-[1.08em]">candidate.</span>
            </h2>
            <p className="text-slate-300 text-[15px] leading-relaxed max-w-md mb-8">
              Enter the code a candidate shared with you to instantly confirm their identity is real and verified.
            </p>
            <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-white text-slate-900 px-5 py-3 text-[14px] font-semibold group-hover:bg-blue-50 transition-colors">
              Enter a code
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </div>
        </button>

        {/* Session stats */}
        <div className="lg:col-span-5 grid grid-cols-3 lg:grid-cols-1 gap-3 dash-enter dash-delay-2">
          <StatCard label="Lookups" value={history.length} tone="slate" />
          <StatCard label="Verified" value={verifiedCount} tone="emerald" />
          <StatCard label="Not found" value={history.length - verifiedCount} tone="rose" />
        </div>

        {/* Recent lookups */}
        <DashCard className="lg:col-span-7 p-6 dash-enter dash-delay-3">
          <div className="flex items-center justify-between mb-4">
            <DashLabel>Recent lookups</DashLabel>
            {history.length > 0 && <span className="text-[12px] text-slate-400">Last {history.length}</span>}
          </div>
          {history.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-900/[0.06] flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <p className="text-slate-500 text-[14px]">No lookups yet. Verify a candidate code to see results here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-900/[0.05]">
              {history.map((h, i) => (
                <li key={i} className="flex items-center gap-3 py-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${h.result.verified ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
                    {h.result.verified ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 text-[14px] font-mono font-semibold tracking-wide">{h.code}</p>
                    <p className="text-slate-500 text-[12px] truncate">{h.result.verified ? h.result.candidate?.name ?? "Verified" : "Not verified"}</p>
                  </div>
                  <span className="text-slate-400 text-[12px] tabular-nums">{h.time}</span>
                </li>
              ))}
            </ul>
          )}
        </DashCard>

        {/* Account */}
        <DashCard className="lg:col-span-5 p-6 dash-enter dash-delay-4">
          <DashLabel className="mb-5">Account</DashLabel>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-white text-lg font-semibold shrink-0">
              {name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-slate-900 font-semibold tracking-tight truncate">{name}</p>
              <p className="text-slate-600 text-[13px] truncate">{company}</p>
              <p className="text-slate-400 text-[12px] truncate">{email}</p>
            </div>
          </div>
        </DashCard>
      </div>
    </div>
  )
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: "slate" | "emerald" | "rose" }) {
  const dot = { slate: "bg-blue-500", emerald: "bg-emerald-500", rose: "bg-rose-500" }[tone]
  return (
    <DashCard className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1">
      <span className="flex items-center gap-2 text-[12px] sm:text-[13px] text-slate-500">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
        {label}
      </span>
      <span className="text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums text-slate-900">{value}</span>
    </DashCard>
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
    <div className="max-w-3xl">
      <DashHeading
        title={<>Verify a <span className="gradient-text text-[1.08em]">candidate.</span></>}
        subtitle="Enter the verification code a candidate has shared with you. We check that it is real, current, and fully verified."
      />

      {/* Main verify card */}
      <DashCard className="p-6 sm:p-9 dash-enter dash-delay-1">
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="verify-code" className="auth-label text-center">Candidate verification code</label>
            <input
              id="verify-code"
              type="text"
              required
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase())
                if (result) onClear()
              }}
              className="w-full bg-[#F8F7F4] border border-slate-900/[0.1] rounded-2xl px-5 py-5 font-mono text-xl sm:text-2xl tracking-[0.25em] text-center text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition placeholder:text-slate-300 placeholder:tracking-widest uppercase"
              placeholder="ATK-XXXX-XXXX"
              spellCheck={false}
              autoComplete="off"
            />
            <p className="text-slate-400 text-[12px] mt-2.5 text-center">Ask the candidate to share their code from their AuthentikMe dashboard</p>
          </div>

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full btn-shimmer text-white font-medium py-4 rounded-full text-[15px] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying…
              </span>
            ) : "Verify identity →"}
          </button>
        </form>
      </DashCard>

      {/* Result card */}
      {result && (
        <div className={`mt-5 dash-enter rounded-[22px] border p-6 sm:p-8 ${result.verified ? "bg-white border-emerald-500/30 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]" : "bg-white border-rose-500/30 shadow-[0_0_0_4px_rgba(244,63,94,0.06)]"}`}>
          <div className="flex items-start gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${result.verified ? "bg-emerald-500" : "bg-rose-500"}`}>
              {result.verified ? (
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-2xl font-semibold tracking-tight mb-1 ${result.verified ? "text-emerald-700" : "text-rose-700"}`}>
                {result.verified ? "Identity verified" : "Not verified"}
              </p>

              {result.verified && result.candidate ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div className="rounded-xl bg-[#F8F7F4] border border-slate-900/[0.06] p-4">
                      <DashLabel className="mb-1">Full name</DashLabel>
                      <p className="text-slate-900 font-semibold">{result.candidate.name ?? "N/A"}</p>
                    </div>
                    <div className="rounded-xl bg-[#F8F7F4] border border-slate-900/[0.06] p-4 min-w-0">
                      <DashLabel className="mb-1">Email address</DashLabel>
                      <p className="text-slate-900 font-semibold truncate">{result.candidate.email}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      { label: "Email confirmed", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                      { label: "Human check passed", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                      { label: "2FA verified", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
                    ].map((badge) => (
                      <span key={badge.label} className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[12px] font-semibold px-3 py-1.5 rounded-full">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={badge.icon} />
                        </svg>
                        {badge.label}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-slate-500 text-[14px] mt-1">{result.message ?? "This code was not found or the candidate has not completed full verification."}</p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-900/[0.06]">
            <button onClick={onClear} className="text-slate-500 hover:text-slate-900 text-[14px] font-medium transition-colors">
              ← Verify another code
            </button>
          </div>
        </div>
      )}

      {/* How it works */}
      {!result && (
        <DashCard className="mt-5 p-6 sm:p-7 dash-enter dash-delay-2">
          <DashLabel className="mb-5">How it works</DashLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", label: "Candidate gets a code", desc: "After completing email, payment, and 2FA, they receive a unique code." },
              { step: "02", label: "Candidate shares it", desc: "They copy it from their dashboard into an application or email." },
              { step: "03", label: "You verify instantly", desc: "Enter it above for real-time confirmation that the identity is genuine." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <span className="font-serif italic text-2xl text-blue-600/70 leading-none pt-0.5 w-7 shrink-0">{s.step}</span>
                <div>
                  <p className="text-slate-900 text-[15px] font-semibold tracking-tight mb-1">{s.label}</p>
                  <p className="text-slate-500 text-[13px] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </DashCard>
      )}
    </div>
  )
}

/* ──────────────────────────── Settings Tab ──────────────────────────── */

function SettingsTab({ name, email, company }: { name: string; email: string; company: string }) {
  const rows = [
    { label: "Full name", value: name },
    { label: "Company", value: company },
    { label: "Email", value: email },
  ]
  return (
    <div className="max-w-2xl">
      <DashHeading
        title={<>Account <span className="gradient-text text-[1.08em]">settings.</span></>}
        subtitle="Manage your employer account details."
      />

      {/* Profile */}
      <DashCard className="overflow-hidden mb-4 dash-enter dash-delay-1">
        <div className="p-6 flex items-center gap-4 border-b border-slate-900/[0.05]">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-white text-2xl font-semibold">
              {name.slice(0, 1).toUpperCase()}
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-white" />
          </div>
          <div className="min-w-0">
            <p className="text-slate-900 font-semibold text-lg tracking-tight truncate">{name}</p>
            <p className="text-blue-600 text-[13px] font-medium">Employer account</p>
          </div>
        </div>
        <dl className="divide-y divide-slate-900/[0.05]">
          {rows.map(r => (
            <div key={r.label} className="px-6 py-4 flex items-center justify-between gap-4">
              <dt className="text-[13px] text-slate-500">{r.label}</dt>
              <dd className="text-[14px] font-medium text-slate-900 truncate">{r.value}</dd>
            </div>
          ))}
        </dl>
      </DashCard>

      {/* Security */}
      <DashCard className="p-6 mb-4 dash-enter dash-delay-2">
        <DashLabel className="mb-4">Security</DashLabel>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-900 text-[14px] font-semibold">Password</p>
              <p className="text-slate-500 text-[12px]">Last updated at account creation</p>
            </div>
          </div>
          <Link href="/forgot-password" className="auth-link text-[13px]">Reset</Link>
        </div>
      </DashCard>

      {/* Sign out */}
      <DashCard className="p-6 dash-enter dash-delay-3">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2.5 text-slate-600 hover:text-rose-600 text-[14px] font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Sign out of this account
        </button>
      </DashCard>
    </div>
  )
}
