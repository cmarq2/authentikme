"use client"

const steps = [
  { label: "Email Verified" },
  { label: "reCAPTCHA Passed" },
  { label: "Authenticator Setup" },
  { label: "Government ID Analytics (AI)" },
]

export default function HeroVisual() {
  return (
    <div className="relative w-full max-w-[300px] select-none">
      <div
        className="relative rounded-2xl overflow-hidden bg-white/90 backdrop-blur-xl border border-white/60"
        style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.08), 0 24px 48px -12px rgba(15,23,42,0.35)" }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-900/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-blue-600 to-indigo-700 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <p className="text-slate-900 font-semibold text-[13px] leading-tight">Identity Verification</p>
              <p className="text-slate-500 text-[11px]">AuthentikMe</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Live</span>
        </div>

        <div className="px-5 py-4 space-y-2.5">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[13px] text-slate-700">{s.label}</span>
            </div>
          ))}

          {/* Verified badge */}
          <div className="!mt-4 rounded-xl px-3.5 py-2.5 flex items-center gap-3 bg-slate-900">
            <div className="relative w-2.5 h-2.5 shrink-0">
              <span className="pulse-ring absolute inset-0 rounded-full bg-emerald-400" />
              <span className="absolute inset-0 rounded-full bg-emerald-400" />
            </div>
            <div>
              <p className="text-white text-[13px] font-semibold leading-tight">Human Verified</p>
              <p className="text-slate-400 text-[11px]">Code ready to share with employers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
