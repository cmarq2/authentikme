"use client"
import { useState } from "react"
import Link from "next/link"

const topics = ["Candidate", "Employer", "Partnership", "Press", "Other"] as const

const inputCls =
  "w-full bg-white border border-slate-900/[0.12] rounded-xl px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
const labelCls = "block text-[13px] font-medium text-slate-700 mb-2"

export default function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [topic, setTopic] = useState<(typeof topics)[number]>("Candidate")
  const [message, setMessage] = useState("")
  const [website, setWebsite] = useState("") // honeypot — humans never see this field
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, topic, message, website }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Something went wrong. Please try again."); return }
      setSuccess(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="py-10 text-center sm:text-left" style={{ animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 mx-auto sm:mx-0">
          <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2">
          Message sent — <span className="gradient-text">thank you.</span>
        </h3>
        <p className="text-slate-600 text-[15px] leading-relaxed mb-8 max-w-md">
          We&apos;ve received your message and will reply to <strong className="text-slate-900 font-medium">{email}</strong> as soon as we can.
        </p>
        <Link href="/" className="btn-shimmer inline-flex items-center gap-2 text-white font-medium px-7 py-3.5 rounded-full text-[15px]">
          Back to home <span aria-hidden>→</span>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Topic */}
      <fieldset>
        <legend className={labelCls}>I&apos;m reaching out as <span className="text-blue-600">*</span></legend>
        <div className="flex flex-wrap gap-2">
          {topics.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              aria-pressed={topic === t}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                topic === t
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-600 border-slate-900/[0.12] hover:border-slate-900/30 hover:text-slate-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-name" className={labelCls}>Full name <span className="text-blue-600">*</span></label>
          <input id="cf-name" type="text" required maxLength={120} autoComplete="name" value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Jane Smith" />
        </div>
        <div>
          <label htmlFor="cf-email" className={labelCls}>Email address <span className="text-blue-600">*</span></label>
          <input id="cf-email" type="email" required maxLength={200} autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="you@company.com" />
        </div>
      </div>

      <div>
        <label htmlFor="cf-company" className={labelCls}>Company <span className="text-slate-400 font-normal">(optional)</span></label>
        <input id="cf-company" type="text" maxLength={160} autoComplete="organization" value={company} onChange={e => setCompany(e.target.value)} className={inputCls} placeholder="Acme Inc." />
      </div>

      <div>
        <label htmlFor="cf-message" className={labelCls}>Message <span className="text-blue-600">*</span></label>
        <textarea id="cf-message" required rows={6} maxLength={5000} value={message} onChange={e => setMessage(e.target.value)} className={`${inputCls} resize-none`} placeholder="Tell us how we can help…" />
      </div>

      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} />
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-shimmer text-white font-medium px-8 py-4 rounded-full text-[15px] inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Sending…
            </>
          ) : (
            <>Send message <span aria-hidden>→</span></>
          )}
        </button>
        <p className="text-slate-500 text-[13px]">
          By sending, you agree to our <Link href="/privacy" className="underline underline-offset-2 hover:text-slate-800">privacy policy</Link>.
        </p>
      </div>
    </form>
  )
}
