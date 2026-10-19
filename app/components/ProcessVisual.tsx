"use client"

import { useEffect, useState } from "react"

/* ── 01 — Register: fields type in, then the vault locks ── */
function RegisterVisual() {
  return (
    <div className="pv-stage">
      <div className="pv-panel w-[78%] px-3.5 py-3 space-y-1.5">
        {[
          { label: "Full name", w: "72%", delay: "0s" },
          { label: "Email", w: "88%", delay: "0.6s" },
          { label: "Password", w: "54%", delay: "1.2s", dots: true },
        ].map(f => (
          <div key={f.label}>
            <p className="text-[8px] uppercase tracking-[0.14em] text-slate-500 mb-0.5">{f.label}</p>
            <div className="h-5 rounded-md border border-white/10 bg-white/[0.04] px-2 flex items-center overflow-hidden">
              <div
                className={`pv-type h-1.5 rounded-full ${f.dots ? "pv-dots" : "bg-gradient-to-r from-blue-300/80 to-indigo-300/60"}`}
                style={{ ["--w" as string]: f.w, animationDelay: f.delay }}
              />
              <span className="pv-caret ml-0.5 w-px h-3 bg-blue-300" style={{ animationDelay: f.delay }} />
            </div>
          </div>
        ))}
      </div>

      {/* Lock badge */}
      <div className="pv-lock absolute right-[6%] bottom-[10%] w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path className="pv-shackle" d="M8 11V7a4 4 0 0 1 8 0v4" />
          <rect x="5" y="11" width="14" height="10" rx="2" />
        </svg>
        <span className="pv-lock-ring absolute inset-0 rounded-xl border border-blue-300" />
      </div>
    </div>
  )
}

/* ── 02 — Authenticator: rolling 6-digit code with countdown ring ── */
const CYCLE = 4000

function randomCode() {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10))
}

function AuthenticatorVisual() {
  const [code, setCode] = useState([4, 8, 2, 9, 1, 6])
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setInterval(() => {
      setCode(randomCode())
      setTick(t => t + 1)
    }, CYCLE)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="pv-stage">
      <div className="pv-panel w-[82%] px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 9.5C8 19.3 5 15.5 5 11V6l7-3Z" /></svg>
            </span>
            <span className="text-[10px] font-medium text-slate-300">AuthentikMe</span>
          </div>
          <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-70" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[8px] font-medium tracking-wide text-emerald-300">LIVE</span>
          </span>
          {/* Countdown ring — restarts every code */}
          <svg key={tick} className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <circle
              className="pv-countdown"
              cx="10" cy="10" r="8" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray="50.27"
              style={{ animationDuration: `${CYCLE}ms` }}
            />
          </svg>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          {code.map((d, i) => (
            <span key={i} className={`flex ${i === 3 ? "ml-2" : ""}`}>
              <span className="relative w-6 h-9 rounded-md bg-white/[0.05] border border-white/10 overflow-hidden flex items-center justify-center">
                <span
                  key={`${tick}-${i}`}
                  className="pv-digit text-lg font-semibold tabular-nums text-white"
                  style={{ animationDelay: `${i * 55}ms` }}
                >
                  {d}
                </span>
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── 03 — Employer confidence: badge stamps, rings radiate, employer sees it ── */
function TrustVisual() {
  return (
    <div className="pv-stage">
      {/* Radiating rings */}
      {[0, 1, 2].map(i => (
        <span key={i} className="pv-radiate absolute w-16 h-16 rounded-full border border-blue-400/40" style={{ animationDelay: `${i * 1}s` }} />
      ))}

      {/* Orbiting employer avatars */}
      <div className="pv-orbit absolute w-36 h-36">
        {[0, 120, 240].map((deg, i) => (
          <span
            key={deg}
            className="absolute left-1/2 top-1/2 -ml-3 -mt-3 w-6 h-6 rounded-full border border-white/15 bg-slate-800 flex items-center justify-center"
            style={{ transform: `rotate(${deg}deg) translateY(-72px) rotate(-${deg}deg)` }}
          >
            <svg className="pv-counter-orbit w-3 h-3 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              {i === 0 && <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1" />}
              {i === 1 && <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21a8 8 0 0 1 16 0" />}
              {i === 2 && <path d="M20 7H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1ZM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />}
            </svg>
          </span>
        ))}
      </div>

      {/* Center verified badge */}
      <div className="pv-badge relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.45)]">
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <path className="pv-check" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Confirmation toast */}
      <div className="pv-toast absolute bottom-[8%] left-1/2 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 shadow-lg shadow-black/30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className="text-[10px] font-semibold text-slate-900 whitespace-nowrap">Identity confirmed</span>
      </div>
    </div>
  )
}

export default function ProcessVisual({ step }: { step: number }) {
  if (step === 0) return <RegisterVisual />
  if (step === 1) return <AuthenticatorVisual />
  return <TrustVisual />
}
