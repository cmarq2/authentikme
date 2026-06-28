"use client"

const steps = [
  { label: "Email Verified" },
  { label: "reCAPTCHA Passed" },
  { label: "Authenticator Setup" },
]

export default function HeroVisual() {
  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      {/* Solid backing plate */}
      <div className="absolute -inset-3 bg-blue-600 rounded-[2rem] opacity-10" />
      <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 to-blue-400 rounded-[1.75rem] opacity-20" />
      <div className="absolute -inset-1 bg-blue-50 rounded-[1.5rem]" />
      {/* Outer soft glow */}
      <div className="absolute -inset-6 bg-blue-400/40 blur-3xl rounded-3xl -z-10" />

      {/* Main card */}
      <div className="relative bg-white rounded-3xl border border-blue-200 overflow-hidden" style={{ boxShadow: "0 8px 40px rgba(37,99,235,0.18), 0 2px 8px rgba(37,99,235,0.10)" }}>
        {/* Card header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Identity Verification</p>
              <p className="text-blue-200 text-xs">AuthentikMe</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-3">
          {/* Steps */}
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-700 font-medium">{s.label}</span>
            </div>
          ))}

          {/* Verified badge */}
          <div className="mt-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="relative w-3 h-3 shrink-0">
              <span className="pulse-ring absolute inset-0 rounded-full bg-green-400" />
              <span className="absolute inset-0 rounded-full bg-green-500" />
            </div>
            <div>
              <p className="text-green-800 text-sm font-bold">Human Verified</p>
              <p className="text-green-600 text-xs">Code ready to share with employers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating trust badge */}
      <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-2.5 flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-gray-900 text-xs font-bold">100% Human</p>
          <p className="text-gray-400 text-xs">Not a bot</p>
        </div>
      </div>
    </div>
  )
}
