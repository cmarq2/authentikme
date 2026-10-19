import type { Metadata } from "next"
import Link from "next/link"
import HeaderNav from "../components/HeaderNav"
import SiteFooter from "../components/SiteFooter"
import ScrollReveal from "../components/ScrollReveal"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing. Individuals get verified for a one-time $12.99. Recruiters verify candidates for $199.99 a month.",
  alternates: { canonical: "/pricing" },
}

const individualFeatures = [
  "Government-issued ID verification",
  "Google Authenticator human verification",
  "Verified badge on your profile",
  "Unique ATK code to share with employers",
  "Encrypted data — never shared without consent",
]

const recruiterFeatures = [
  "Instantly confirm candidate ATK codes",
  "See verified identity status before the interview",
  "Screen out AI-generated and fake applicants",
  "Tamper-proof identity record for every verified hire",
  "Priority support from our team",
]

const faqs = [
  {
    q: "Is the individual fee a subscription?",
    a: "No. Individuals pay $12.99 once, when they complete the payment step of verification. There are no recurring charges.",
  },
  {
    q: "How is the recruiter plan billed?",
    a: "The recruiter plan is $199.99 per month, billed monthly in USD.",
  },
  {
    q: "Do candidates pay to be looked up by recruiters?",
    a: "No. Once a candidate is verified, any approved recruiter can confirm their ATK code at no extra cost to the candidate.",
  },
  {
    q: "Why do recruiter accounts need approval?",
    a: "Every recruiter account is reviewed by our team before it can sign in, so candidates know only genuine employers can view their verified status.",
  },
]

const headingCls = "font-semibold tracking-[-0.035em] leading-[1.05]"

function Check({ light = false }: { light?: boolean }) {
  return (
    <span className={`mt-0.5 w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${light ? "bg-blue-500/20 text-blue-300" : "bg-blue-50 text-blue-600"}`}>
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  )
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] text-slate-900 antialiased">
      <HeaderNav />

      {/* ── Hero + plans ── */}
      <section className="relative pt-36 sm:pt-44 pb-20 sm:pb-28 px-4 sm:px-6 overflow-hidden grain">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(55% 45% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)" }} />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16" style={{ animation: "fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both" }}>
            <p className="eyebrow text-blue-700 mb-6">Pricing</p>
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl ${headingCls} text-slate-900 mb-6`}>
              Simple pricing. <span className="gradient-text text-[1.08em]">Real trust.</span>
            </h1>
            <p className="text-slate-600 text-lg sm:text-xl leading-relaxed">
              One flat price to prove you&apos;re real. One monthly plan to know every candidate is.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* Individual */}
            <div className="relative h-full rounded-[28px] bg-white border border-slate-900/[0.08] shadow-[0_24px_48px_-24px_rgba(15,23,42,0.18)] p-8 sm:p-10 flex flex-col" style={{ animation: "fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}>
              <p className="text-sm font-semibold text-blue-700 mb-2">Individual</p>
              <p className="text-slate-600 text-[15px] leading-relaxed mb-8">For candidates and contractors who want employers to trust them from the first application.</p>

              <div className="flex items-end gap-2 mb-1">
                <span className="text-6xl font-semibold tracking-tight text-slate-900">$12.99</span>
              </div>
              <p className="text-slate-500 text-sm mb-8">One-time payment · no subscription</p>

              <Link href="/candidate/signup" className="btn-shimmer text-white font-medium px-7 py-4 rounded-full text-[15px] text-center inline-flex items-center justify-center gap-2 mb-9">
                Get Verified <span aria-hidden>→</span>
              </Link>

              <ul className="space-y-3.5 mt-auto">
                {individualFeatures.map(f => (
                  <li key={f} className="flex gap-3 text-[15px] text-slate-700">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recruiter */}
            <div className="relative h-full rounded-[28px] bg-slate-950 border border-white/10 shadow-[0_30px_60px_-20px_rgba(30,58,138,0.55)] p-8 sm:p-10 flex flex-col overflow-hidden grain" style={{ animation: "fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(70% 50% at 100% 0%, rgba(59,130,246,0.28) 0%, transparent 70%)" }} />

              <div className="relative flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-blue-300">Recruiter</p>
                  <span className="text-[11px] font-medium tracking-wide uppercase text-white bg-white/10 border border-white/15 rounded-full px-2.5 py-1">For hiring teams</span>
                </div>
                <p className="text-slate-400 text-[15px] leading-relaxed mb-8">For recruiters and employers who need to know every applicant is a real, verified person.</p>

                <div className="flex items-end gap-2 mb-1">
                  <span className="text-6xl font-semibold tracking-tight text-white">$199.99</span>
                  <span className="text-slate-400 text-lg mb-2">/month</span>
                </div>
                <p className="text-slate-500 text-sm mb-8">Billed monthly · account approval required</p>

                <Link href="/employer/signup" className="bg-white text-slate-900 font-medium px-7 py-4 rounded-full text-[15px] text-center inline-flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-lg mb-9">
                  Start as a Recruiter <span aria-hidden>→</span>
                </Link>

                <ul className="space-y-3.5 mt-auto">
                  {recruiterFeatures.map(f => (
                    <li key={f} className="flex gap-3 text-[15px] text-slate-300">
                      <Check light />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p className="text-center text-slate-500 text-sm mt-8">All prices in USD. Payments are processed securely by Stripe.</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white border-t border-slate-900/[0.06]">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <p className="eyebrow text-blue-700 mb-5">Questions</p>
            <h2 className={`text-4xl sm:text-5xl ${headingCls} text-slate-900`}>
              Pricing, <span className="gradient-text text-[1.08em]">answered.</span>
            </h2>
          </ScrollReveal>

          <div className="divide-y divide-slate-900/[0.07] border-y border-slate-900/[0.07]">
            {faqs.map((item, i) => (
              <ScrollReveal key={item.q} delay={i * 90}>
                <div className="py-7">
                  <h3 className="text-slate-900 font-semibold text-lg mb-2 tracking-tight">{item.q}</h3>
                  <p className="text-slate-600 text-[15px] leading-relaxed">{item.a}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="text-center mt-12">
            <p className="text-slate-600">
              Still have questions? <Link href="/contact" className="text-blue-700 font-medium hover:underline underline-offset-2">Contact our team</Link>
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
