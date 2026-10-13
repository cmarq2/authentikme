"use client"
import React, { ReactNode } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { LogoMark } from "./HeaderNav"

export type DashNavItem<T extends string> = {
  id: T
  label: string
  icon: ReactNode
  badge?: ReactNode
}

/** Shared premium chrome for the candidate and employer dashboards. */
export default function DashboardShell<T extends string>({
  navItems,
  activeTab,
  onTabChange,
  user,
  status,
  children,
}: {
  navItems: DashNavItem<T>[]
  activeTab: T
  onTabChange: (t: T) => void
  user: { name: string; email: string; role: string }
  status?: ReactNode
  children: ReactNode
}) {
  const initial = (user.name || user.email || "?").slice(0, 1).toUpperCase()
  const activeLabel = navItems.find(n => n.id === activeTab)?.label ?? ""

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-slate-900 antialiased md:flex">

      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 flex-col border-r border-slate-900/[0.06] bg-white/70 backdrop-blur-xl md:sticky md:top-0 md:h-screen">
        <div className="px-6 h-[72px] flex items-center border-b border-slate-900/[0.05]">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-[18px] tracking-tight text-slate-900 hover:opacity-80 transition-opacity">
            <LogoMark />
            <span>Authentik<span className="text-blue-600">Me</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Menu</p>
          {navItems.map(item => {
            const active = item.id === activeTab
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
                  active
                    ? "bg-slate-900 text-white shadow-[0_8px_20px_-8px_rgba(15,23,42,0.5)]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-900/[0.04]"
                }`}
              >
                <span className={`w-5 h-5 flex items-center justify-center ${active ? "text-white" : "text-slate-400"}`}>{item.icon}</span>
                {item.label}
                {item.badge && <span className="ml-auto">{item.badge}</span>}
              </button>
            )
          })}
        </nav>

        {/* Profile + sign out */}
        <div className="p-4 border-t border-slate-900/[0.05]">
          <div className="flex items-center gap-3 rounded-2xl bg-white border border-slate-900/[0.06] p-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-white flex items-center justify-center font-semibold select-none shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-slate-900 truncate">{user.name || user.email}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.role}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              title="Sign out"
              aria-label="Sign out"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-[64px] md:h-[72px] flex items-center justify-between gap-4 px-4 sm:px-8 lg:px-12 bg-[#F8F7F4]/80 backdrop-blur-xl border-b border-slate-900/[0.05]">
          <Link href="/" className="md:hidden flex items-center gap-2 font-semibold text-[17px] tracking-tight text-slate-900">
            <LogoMark className="w-6 h-6" />
            <span>Authentik<span className="text-blue-600">Me</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-[13px] text-slate-500">
            <span>Dashboard</span>
            <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span className="text-slate-900 font-medium">{activeLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            {status}
            <div className="md:hidden w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-white flex items-center justify-center text-sm font-semibold select-none">
              {initial}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 sm:py-10 pb-28 md:pb-12">
          <div className="max-w-5xl">{children}</div>
        </main>
      </div>

      {/* ── Mobile tab bar ── */}
      <nav className="md:hidden fixed bottom-3 inset-x-3 z-30 flex rounded-2xl bg-slate-950/95 backdrop-blur-xl p-1.5 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.6)]">
        {navItems.map(item => {
          const active = item.id === activeTab
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-[11px] font-medium transition-colors ${
                active ? "bg-white/10 text-white" : "text-slate-400"
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

/** Page heading used at the top of each dashboard tab. */
export function DashHeading({ title, subtitle, aside }: { title: ReactNode; subtitle?: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 dash-enter">
      <div>
        <h1 className="text-[2rem] sm:text-[2.5rem] font-semibold tracking-[-0.035em] leading-[1.08] text-slate-900">{title}</h1>
        {subtitle && <p className="text-slate-500 text-[15px] mt-2 max-w-xl">{subtitle}</p>}
      </div>
      {aside}
    </div>
  )
}

/** Standard white surface card. */
export function DashCard({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`bg-white rounded-[22px] border border-slate-900/[0.06] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.12)] ${className}`}>
      {children}
    </div>
  )
}

/** Small uppercase label used for card section titles. */
export function DashLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 ${className}`}>{children}</p>
}

/** Membership-style identity card used to display a verification code. */
export function IdentityCard({
  holder,
  code,
  locked,
  footer,
}: {
  holder: string
  code: string | null
  locked?: boolean
  footer?: ReactNode
}) {
  return (
    <div className="relative rounded-[26px] overflow-hidden text-white shadow-[0_30px_60px_-24px_rgba(15,23,42,0.65)] grain"
      style={{ background: "radial-gradient(120% 120% at 100% 0%, #1e3a8a 0%, #0f172a 45%, #020617 100%)" }}>
      {/* Decorative sheen + guilloché rings */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full border border-white/[0.07]" />
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-white/[0.07]" />
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border border-white/[0.07]" />
      {!locked && <div className="absolute inset-0 pointer-events-none"><div className="shimmer-sweep h-full" /></div>}

      <div className="relative p-6 sm:p-8">
        <div className="flex items-start justify-between mb-10 sm:mb-14">
          <div className="flex items-center gap-2.5">
            <LogoMark className="w-8 h-8" />
            <div className="leading-tight">
              <p className="text-[14px] font-semibold tracking-tight">AuthentikMe</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-blue-200/70">Verified Identity</p>
            </div>
          </div>
          {locked ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Locked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 border border-emerald-300/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              Verified
            </span>
          )}
        </div>

        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400 mb-2">Verification code</p>
        <p className={`font-mono font-semibold text-[1.65rem] sm:text-[2.1rem] tracking-[0.18em] ${locked ? "text-white/25 blur-[3px] select-none" : "text-white"}`}>
          {code ?? "ATK-XXXX-XXXX"}
        </p>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400 mb-1">Card holder</p>
            <p className="text-[15px] font-medium truncate">{holder}</p>
          </div>
          {footer}
        </div>
      </div>
    </div>
  )
}
