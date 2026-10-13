import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"
import { LogoMark } from "./HeaderNav"

export type AuthPanel = "signin" | "candidate" | "employer"

const panels: Record<AuthPanel, { image: string; alt: string; eyebrow: string; title: ReactNode; benefits: string[] }> = {
  signin: {
    image: "/images/auth-signin.jpg",
    alt: "A smiling professional in a modern office",
    eyebrow: "Welcome back",
    title: <>Your verified identity, <span className="gradient-text-light text-[1.08em]">ready when you are.</span></>,
    benefits: [
      "Share your verification code with any employer",
      "Track your verification status in one place",
      "Protected by two-factor authentication",
    ],
  },
  candidate: {
    image: "/images/auth-candidate.jpg",
    alt: "A confident young professional in a light blazer",
    eyebrow: "For candidates",
    title: <>Stand out as a <span className="gradient-text-light text-[1.08em]">verified professional.</span></>,
    benefits: [
      "A verified badge employers trust before the first interview",
      "One unique code to share on every application",
      "Bank-grade 2FA and AI-screened government ID",
      "Set up in minutes, cancel anytime",
    ],
  },
  employer: {
    image: "/images/auth-employer.jpg",
    alt: "A team joining hands across a meeting table",
    eyebrow: "For employers",
    title: <>Hire people you can <span className="gradient-text-light text-[1.08em]">actually trust.</span></>,
    benefits: [
      "Confirm a candidate's identity in seconds with their code",
      "Filter out AI-generated and fraudulent applicants",
      "A tamper-proof identity record for every verified hire",
      "Instant, real-time confirmation from your dashboard",
    ],
  },
}

function CheckIcon() {
  return (
    <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-400/15 border border-emerald-300/30 flex items-center justify-center shrink-0">
      <svg className="w-3 h-3 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  )
}

/** Split-screen layout for sign-in / sign-up pages: form on the left, photo + benefits on the right. */
export default function AuthShell({
  panel,
  title,
  subtitle,
  children,
}: {
  panel: AuthPanel
  title: ReactNode
  subtitle?: ReactNode
  children: ReactNode
}) {
  const p = panels[panel]

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.1fr_1fr] bg-[#F8F7F4] text-slate-900 antialiased">
      {/* ── Form side ── */}
      <div className="relative flex flex-col px-5 sm:px-10 lg:px-14 xl:px-20 py-6 sm:py-8 min-h-screen">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-[19px] tracking-tight text-slate-900 hover:opacity-80 transition-opacity">
            <LogoMark />
            <span>Authentik<span className="text-blue-600">Me</span></span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to site
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center py-10 sm:py-14">
          <div className="w-full max-w-[440px]" style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both" }}>
            <h1 className="text-[2rem] sm:text-[2.4rem] font-semibold tracking-[-0.03em] leading-[1.1] text-slate-900 mb-3">{title}</h1>
            {subtitle && <p className="text-slate-500 text-[15px] leading-relaxed mb-8">{subtitle}</p>}
            {children}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Secure, encrypted connection
          </span>
          <span className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-700 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-700 transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-slate-700 transition-colors">Help</Link>
          </span>
        </div>
      </div>

      {/* ── Photo + benefits side (desktop) ── */}
      <aside className="hidden lg:block p-3">
        <div className="sticky top-3 h-[calc(100vh-1.5rem)] rounded-[28px] overflow-hidden bg-slate-950 photo-frame">
          <Image key={p.image} src={p.image} alt={p.alt} fill priority quality={88} sizes="50vw" className="object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-10 xl:p-12">
            <p className="eyebrow text-blue-300 mb-5">{p.eyebrow}</p>
            <h2 className="text-white text-3xl xl:text-[2.6rem] font-semibold tracking-[-0.03em] leading-[1.1] mb-7 max-w-md">{p.title}</h2>
            <ul className="space-y-3.5 max-w-md">
              {p.benefits.map(b => (
                <li key={b} className="flex gap-3 text-slate-200 text-[15px] leading-snug">
                  <CheckIcon />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  )
}

/** Centered confirmation card used after a successful sign-up. */
export function AuthSuccess({
  tone = "success",
  title,
  children,
  action,
}: {
  tone?: "success" | "pending"
  title: ReactNode
  children: ReactNode
  action: ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4] px-4 py-12">
      <div className="w-full max-w-md text-center" style={{ animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
        <Link href="/" className="inline-flex items-center gap-2.5 font-semibold text-[19px] tracking-tight text-slate-900 mb-8">
          <LogoMark />
          <span>Authentik<span className="text-blue-600">Me</span></span>
        </Link>
        <div className="bg-white rounded-[24px] border border-slate-900/[0.06] shadow-[0_30px_60px_-30px_rgba(15,23,42,0.3)] px-8 py-10">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 border ${tone === "success" ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"}`}>
            {tone === "success" ? (
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-3">{title}</h2>
          <div className="text-slate-600 text-[15px] leading-relaxed mb-8">{children}</div>
          {action}
        </div>
      </div>
    </div>
  )
}
