"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const unverified = [
  "Identity unknown — could be AI-generated, a bot, or a spam account.",
  "No credential validation — claimed qualifications can't be matched to a real person.",
  "Zero accountability — no identity trail if something goes wrong after hire.",
  "Recruiter scepticism — unverified profiles are filtered before a human reads them.",
  "Lost in the noise — buried under thousands of fake and AI applications.",
]

const verified = [
  "Confirmed real human — two-factor auth and identity checks prove you're genuine.",
  "Trusted from first contact — employers engage knowing your profile is real.",
  "Full accountability trail — your verified identity is permanent and tamper-proof.",
  "Prioritised by recruiters — verified candidates rise to the top of every shortlist.",
  "Stand above the noise — while others are filtered out, you're already in the conversation.",
]

export default function ComparisonSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el) } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} id="compare" className="py-28 px-6 bg-white overflow-hidden relative">
      {/* Ambient orbs */}
      <div className="orb w-96 h-96 bg-rose-200/20 -top-24 -left-24" />
      <div className="orb w-96 h-96 bg-blue-200/20 -top-24 -right-24" />

      <div className="max-w-6xl mx-auto relative">

        {/* Header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-600 text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
            The Difference Is Clear
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
            Unverified vs. Verified.
          </h2>
          <p className="text-gray-700 text-lg max-w-lg mx-auto leading-relaxed">
            Employers don&apos;t see your effort — they see your signal. Make it the right one.
          </p>
        </div>

        {/* Cards row */}
        <div className="flex flex-col md:flex-row items-stretch gap-0">

          {/* ── Unverified card ── */}
          <div
            className="flex-1 relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-40px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s",
              border: "2px solid rgba(251,113,133,0.35)",
              background: "linear-gradient(160deg, rgba(255,241,242,0.8) 0%, rgba(255,255,255,0.95) 100%)",
              boxShadow: "0 4px 24px rgba(244,63,94,0.06)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 60px rgba(244,63,94,0.14), 0 4px 24px rgba(244,63,94,0.06)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(244,63,94,0.06)" }}
          >
            {/* Red gradient top accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 to-red-400" />

            <div className="p-8 pt-9">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #fb7185, #e11d48)", boxShadow: "0 4px 16px rgba(225,29,72,0.3)" }}
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-black text-gray-900 text-base">Unverified Candidate</p>
                  <p className="text-rose-400 text-xs font-semibold">Without AuthentikMe</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs font-bold bg-rose-100 text-rose-600 px-3 py-1 rounded-full border border-rose-200">High Risk</span>
                </div>
              </div>

              {/* List */}
              <ul className="space-y-3.5">
                {unverified.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-base leading-relaxed"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateX(0)" : "translateX(-16px)",
                      transition: `opacity 0.5s ease ${i * 100 + 500}ms, transform 0.5s ease ${i * 100 + 500}ms`,
                    }}
                  >
                    <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* VS divider */}
          <div className="hidden md:flex flex-col items-center justify-center w-16 shrink-0 gap-3 z-10">
            <div className="flex-1 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg shrink-0"
              style={{
                background: "linear-gradient(135deg, #e11d48, #9333ea, #2563eb)",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.5s ease 0.8s",
              }}
            >
              VS
            </div>
            <div className="flex-1 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
          </div>

          {/* ── Verified card ── */}
          <div
            className="flex-1 relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(40px)",
              transition: "opacity 0.7s ease 0.2s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s",
              border: "2px solid rgba(59,130,246,0.35)",
              background: "linear-gradient(160deg, rgba(239,246,255,0.9) 0%, rgba(255,255,255,0.95) 100%)",
              boxShadow: "0 4px 24px rgba(59,130,246,0.07)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 60px rgba(59,130,246,0.16), 0 4px 24px rgba(59,130,246,0.07)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(59,130,246,0.07)" }}
          >
            {/* Blue gradient top accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-violet-500" />

            {/* Background orb */}
            <div className="orb w-56 h-56 bg-blue-300/20 -top-16 -right-16" />

            <div className="relative p-8 pt-9">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <p className="font-black text-gray-900 text-base">Verified Candidate</p>
                  <p className="text-blue-500 text-xs font-semibold">With AuthentikMe</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200">Trusted</span>
                </div>
              </div>

              {/* List */}
              <ul className="space-y-3.5">
                {verified.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-base leading-relaxed"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateX(0)" : "translateX(16px)",
                      transition: `opacity 0.5s ease ${i * 100 + 600}ms, transform 0.5s ease ${i * 100 + 600}ms`,
                    }}
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom CTA strip */}
        <div
          className="mt-12 text-center"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.7s ease 1.2s",
          }}
        >
          <Link
            href="/candidate/signup"
            className="btn-shimmer inline-flex items-center text-white font-bold px-8 py-4 rounded-2xl text-sm"
          >
            Become a Verified Candidate →
          </Link>
        </div>

      </div>
    </section>
  )
}
