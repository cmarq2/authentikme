"use client"
import { useEffect, useRef, useState, Fragment } from "react"

const steps = [
  {
    num: "01",
    label: "Step 1",
    title: "Verify Your Identity",
    desc: "Confirm your email, pass reCAPTCHA, and set up Google Authenticator.",
    details: ["Email verification link", "reCAPTCHA human check", "Google Authenticator 2FA"],
    from: "#3B82F6",
    to: "#1D4ED8",
    glow: "rgba(59,130,246,0.45)",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    num: "02",
    label: "Step 2",
    title: "Get Your Unique Code",
    desc: "Receive a tamper-proof verification code tied exclusively to your identity.",
    details: ["Unique verification code", "Cryptographically secured", "Permanent identity trail"],
    from: "#8B5CF6",
    to: "#6D28D9",
    glow: "rgba(139,92,246,0.45)",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <circle cx="12" cy="16" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    num: "03",
    label: "Step 3",
    title: "Share With Employers",
    desc: "Employers enter your code in their dashboard for instant, real-time confirmation.",
    details: ["Instant employer access", "Real-time verification", "3× callback rate"],
    from: "#10B981",
    to: "#059669",
    glow: "rgba(16,185,129,0.45)",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3L22 4" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.unobserve(el) } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0c1220 0%, #0a0f1e 50%, #0c1220 100%)" }}
    >
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[700px] h-[700px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", top: "-10%", left: "10%" }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)", bottom: "0%", right: "15%" }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", bottom: "20%", left: "50%" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-20"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 border text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest"
            style={{ borderColor: "rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.08)", color: "#60A5FA" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            How It Works
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
            Three steps to <span className="gradient-text">standing out.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
            From unknown applicant to trusted candidate — verified in minutes.
          </p>
        </div>

        {/* Workflow row */}
        <div className="flex items-start">
          {steps.map((step, i) => (
            <Fragment key={step.num}>
              {/* Step column */}
              <div
                className="flex-1 flex flex-col items-center"
                style={{
                  opacity: active ? 1 : 0,
                  transform: active ? "translateY(0)" : "translateY(50px)",
                  transition: `opacity 0.7s ease ${i * 0.22 + 0.25}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.22 + 0.25}s`,
                }}
              >
                {/* Badge with expanding rings */}
                <div className="relative flex items-center justify-center mb-5" style={{ width: 64, height: 64 }}>
                  {active && [0, 1].map(j => (
                    <span
                      key={j}
                      className="absolute rounded-full"
                      style={{
                        inset: 0,
                        background: step.glow,
                        animation: `ringExpand 2.6s ease-out ${j * 0.9}s infinite`,
                      }}
                    />
                  ))}
                  <div
                    className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-white"
                    style={{
                      background: `linear-gradient(135deg, ${step.from} 0%, ${step.to} 100%)`,
                      boxShadow: `0 0 36px ${step.glow}, 0 4px 24px rgba(0,0,0,0.5)`,
                    }}
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Vertical drip line */}
                <div
                  className="w-px mb-0"
                  style={{
                    height: 28,
                    background: `linear-gradient(to bottom, ${step.from}90, transparent)`,
                    opacity: active ? 1 : 0,
                    transition: `opacity 0.5s ease ${i * 0.22 + 0.7}s`,
                  }}
                />

                {/* Card */}
                <div
                  className="w-full rounded-2xl p-6 transition-all duration-300 group cursor-default"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${step.from}28`,
                    boxShadow: `inset 0 0 40px ${step.from}06, 0 1px 0 ${step.from}20`,
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.border = `1px solid ${step.from}50`
                    el.style.boxShadow = `inset 0 0 40px ${step.from}10, 0 0 30px ${step.from}15, 0 1px 0 ${step.from}30`
                    el.style.transform = "translateY(-4px)"
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.border = `1px solid ${step.from}28`
                    el.style.boxShadow = `inset 0 0 40px ${step.from}06, 0 1px 0 ${step.from}20`
                    el.style.transform = "translateY(0)"
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: step.from }}>
                      {step.label}
                    </span>
                    <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${step.from}40, transparent)` }} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2.5 leading-tight">{step.title}</h3>
                  <p className="text-gray-400 text-base leading-relaxed mb-5">{step.desc}</p>
                  <ul className="space-y-2.5">
                    {step.details.map((d, di) => (
                      <li
                        key={di}
                        className="flex items-center gap-2.5 text-base"
                        style={{
                          opacity: active ? 1 : 0,
                          transform: active ? "translateX(0)" : "translateX(-10px)",
                          transition: `opacity 0.5s ease ${i * 0.22 + di * 0.12 + 0.85}s, transform 0.5s ease ${i * 0.22 + di * 0.12 + 0.85}s`,
                        }}
                      >
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: `linear-gradient(135deg, ${step.from}, ${step.to})` }}
                        >
                          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-300">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Animated connector between steps */}
              {i < steps.length - 1 && (
                <div className="flex-shrink-0 flex flex-col items-center gap-2" style={{ width: 72, marginTop: 32, padding: "0 8px" }}>
                  {/* Track line with animated fill and traveling dot */}
                  <div className="relative w-full" style={{ height: 2 }}>
                    {/* Track */}
                    <div className="absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
                    {/* Animated gradient fill */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${step.from}, ${steps[i + 1].from})`,
                        width: active ? "100%" : "0%",
                        transition: `width 1s cubic-bezier(0.4,0,0.2,1) ${i * 0.5 + 0.6}s`,
                      }}
                    />
                    {/* Traveling dot */}
                    {active && (
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#fff",
                          boxShadow: `0 0 10px ${steps[i + 1].glow}, 0 0 4px ${steps[i + 1].from}`,
                          animation: `travelDot 1.8s ease-in-out ${i * 0.5 + 1.7}s infinite`,
                        }}
                      />
                    )}
                  </div>
                  {/* Arrow chevron */}
                  <div
                    style={{
                      opacity: active ? 1 : 0,
                      transition: `opacity 0.4s ease ${i * 0.5 + 1.65}s`,
                      color: steps[i + 1].from,
                    }}
                  >
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                      <path d="M1 5h12M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              )}
            </Fragment>
          ))}
        </div>

        {/* Bottom note */}
        <div
          className="mt-14 text-center"
          style={{ opacity: active ? 1 : 0, transition: "opacity 0.7s ease 1.3s" }}
        >
          <p className="text-gray-600 text-sm">
            Average verification time:{" "}
            <span className="text-gray-400 font-semibold">under 3 minutes</span>
          </p>
        </div>
      </div>
    </section>
  )
}
