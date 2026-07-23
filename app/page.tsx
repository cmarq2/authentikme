import Link from "next/link"
import ScrollReveal from "./components/ScrollReveal"
import CountUp from "./components/CountUp"
import HeroVisual from "./components/HeroVisual"
import HowItWorks from "./components/HowItWorks"
import ComparisonSection from "./components/ComparisonSection"
import HeaderNav from "./components/HeaderNav"

const whyMatters = [
  { num: "01", title: "Prove You're Real", desc: "Our identity verification confirms you are a real, living person — not an AI-generated profile, not a spam account. Employers receive that confirmation the moment they view your profile." },
  { num: "02", title: "Build Employer Trust", desc: "A verified identity signals that you take your professional reputation seriously. Employers prioritise candidates they can trust — and a VeritySystem badge tells them exactly that before the first interview." },
  { num: "03", title: "Stand Out Instantly", desc: "In a market saturated with unverified applicants, your verified status cuts through the noise. Employers know you are genuine, qualified, and worth their time — before they even read your CV." },
]

const hesitateReasons = [
  { num: "01", title: "No Way to Confirm Identity", desc: "Without verification, employers have no means of confirming that the person behind an application actually exists. A name and email prove nothing. Verified identity proves everything." },
  { num: "02", title: "AI-Generated Profile Flood", desc: "Automated tools generate thousands of polished, convincing applications in minutes. Employers cannot tell humans from machines without a verification layer — so they default to distrust." },
  { num: "03", title: "Wasted Recruiter Time", desc: "Processing a single fraudulent application consumes an average of 23 hours across the hiring team. Multiply that across hundreds of unverified submissions and the cost becomes unsustainable." },
  { num: "04", title: "Credential Misrepresentation", desc: "Unverified candidates can claim any qualification, title, or experience without consequence. Employers who skip identity checks have no way to match a person to their stated credentials." },
  { num: "05", title: "Legal & Reputational Risk", desc: "Hiring someone who misrepresented their identity exposes companies to legal liability, data breaches, regulatory penalties, and reputational damage that can take years to recover from." },
  { num: "06", title: "Zero Accountability Trail", desc: "If an unverified hire goes wrong, there is no traceable record to investigate. Verified candidates carry a permanent, tamper-proof identity record — giving employers recourse if anything goes wrong." },
]

const processSteps = [
  { num: "01", title: "Register Your Identity", desc: "Create your account using your real credentials. Your information is encrypted and never shared with employers without your consent." },
  { num: "02", title: "Complete Human Verification", desc: "Set up Google Authenticator to confirm you are a live, real person. The same two-factor standard used by banks and global enterprises — applied to your job search." },
  { num: "03", title: "Earn Employer Confidence", desc: "Your verified status is visible to potential employers. They know instantly you are not a bot, not AI, not spam — just a real candidate they can trust and engage with directly." },
]


const hesitateIconPaths = [
  "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z",
  "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z",
  "M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z",
  "M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z",
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">

      {/* ── Header ── */}
      <HeaderNav />

      {/* ── Hero ── */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden dot-grid">
        {/* Gradient orbs */}
        <div className="orb w-[600px] h-[600px] bg-blue-400/20 -top-48 -left-48" />
        <div className="orb w-[400px] h-[400px] bg-violet-400/15 top-0 right-0" />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left */}
            <div style={{ animation: "slideInLeft 0.9s cubic-bezier(0.16,1,0.3,1) both" }}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
                <span className="relative w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75" />
                  <span className="relative block w-2 h-2 rounded-full bg-blue-500" />
                </span>
                Fighting Fraudulent Job Applications
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6 text-gray-900">
                Prove You Are<br />
                <span className="gradient-text">Real. The Authentik You.</span>
              </h1>

              <p className="text-gray-700 text-lg leading-relaxed mb-10 max-w-lg">
                Candidates verify their identity with email, reCAPTCHA, and Google Authenticator — then receive a unique code employers use for instant confirmation.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <Link href="/candidate/signup" className="btn-shimmer text-white font-bold px-8 py-4 rounded-2xl text-base text-center">
                  I&apos;m a Candidate →
                </Link>
                <Link href="/employer/signup" className="bg-gray-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-gray-800 transition-all hover:-translate-y-0.5 hover:shadow-xl text-base text-center">
                  I&apos;m an Employer
                </Link>
              </div>

              {/* Trust line */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex -space-x-2">
                  {["bg-blue-400", "bg-violet-400", "bg-green-400", "bg-orange-400"].map((c, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                      {["J", "A", "M", "S"][i]}
                    </div>
                  ))}
                </div>
                <span>Join <strong className="text-gray-700">2,400+</strong> verified candidates</span>
              </div>
            </div>

            {/* Right — animated visual */}
            <div style={{ animation: "slideInRight 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both" }}>
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ticker ── */}
      <section className="bg-gray-900 py-5 overflow-hidden border-y border-gray-800">
        <div className="flex">
          <div className="ticker-track flex items-center gap-12 whitespace-nowrap">
            {[
              "✓ 100% Human Verified",
              "✕ 0 Bots Approved",
              "↑ 3× More Callbacks",
              "⚡ Verified in Minutes",
              "🔒 Bank-Grade Security",
              "✓ 2,400+ Candidates Verified",
              "🛡 Tamper-Proof Identity",
              "📋 Instant Employer Access",
              "🔐 Two-Factor Authenticated",
              "✕ Zero Fraudulent Profiles",
              "⭐ Trusted by Top Recruiters",
              "✓ Real-Time Confirmation",
              "✓ 100% Human Verified",
              "✕ 0 Bots Approved",
              "↑ 3× More Callbacks",
              "⚡ Verified in Minutes",
              "🔒 Bank-Grade Security",
              "✓ 2,400+ Candidates Verified",
              "🛡 Tamper-Proof Identity",
              "📋 Instant Employer Access",
              "🔐 Two-Factor Authenticated",
              "✕ Zero Fraudulent Profiles",
              "⭐ Trusted by Top Recruiters",
              "✓ Real-Time Confirmation",
            ].map((item, i) => (
              <span key={i} className="text-sm font-semibold text-gray-400 px-4">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <HowItWorks />

      {/* ── Why It Matters ── */}
      <section id="why" className="py-16 sm:py-28 px-4 sm:px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left column */}
            <ScrollReveal direction="left">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-full mb-7 uppercase tracking-widest">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                Why It Matters
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-[1.08]">
                Verified Human.<br />
                <span className="gradient-text">Not a Bot.</span>
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-10">
                Employers are flooded with AI-generated applications and spam accounts. AuthentikMe proves you are neither — giving you an immediate, measurable edge over every unverified applicant.
              </p>

              {/* Inline stats */}
              <div className="flex items-center gap-8 mb-10 py-6 border-y border-gray-100">
                <div>
                  <div className="text-3xl font-black text-gray-900">3×</div>
                  <div className="text-gray-400 text-xs font-medium mt-0.5">More callbacks</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <div className="text-3xl font-black text-gray-900">100%</div>
                  <div className="text-gray-400 text-xs font-medium mt-0.5">Human verified</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <div className="text-3xl font-black text-gray-900">0</div>
                  <div className="text-gray-400 text-xs font-medium mt-0.5">Bots approved</div>
                </div>
              </div>

              <Link href="/candidate/signup" className="btn-shimmer text-white font-bold px-7 py-3.5 rounded-xl inline-block text-sm">
                Start Verification →
              </Link>
            </ScrollReveal>

            {/* Right column — numbered cards */}
            <div className="space-y-4">
              {whyMatters.map((item, i) => (
                <ScrollReveal key={item.num} delay={i * 120} direction="right">
                  <div className="group relative bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                    {/* Gradient accent top line */}
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
                    {/* Subtle tint on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="relative flex gap-5 items-start">
                      {/* Numbered badge */}
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-md shadow-blue-100 group-hover:shadow-blue-200 group-hover:scale-105 transition-all duration-300">
                        <span className="text-white text-xs font-black tracking-wide">{item.num}</span>
                      </div>
                      <div className="pt-0.5">
                        <h3 className="text-gray-900 font-bold text-base mb-2 group-hover:text-blue-900 transition-colors duration-300">{item.title}</h3>
                        <p className="text-gray-700 text-base leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Employer Reality — dark stats ── */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 bg-gray-950 overflow-hidden">
        <div className="orb w-[500px] h-[500px] bg-blue-600/10 -top-32 -right-32" />
        <div className="orb w-[400px] h-[400px] bg-violet-600/10 -bottom-32 -left-32" />

        <div className="relative max-w-6xl mx-auto">
          <ScrollReveal className="max-w-xl mb-16">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">The Employer Reality</p>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">The scale of the problem.</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Over 70% of hiring managers now report receiving AI-generated, fake, or spam applications — and the number is rising every quarter.
            </p>
            <p className="text-gray-600 text-xs mt-3">Industry hiring data, 2024 — LinkedIn Talent Report</p>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { stat: 33, suffix: "%", label: "of online applicants misrepresent their identity", prefix: "" },
              { stat: 17000, suffix: "", label: "average cost of a bad hire in lost time", prefix: "$" },
              { stat: 23, suffix: "h", label: "average time wasted per fraudulent application", prefix: "" },
              { stat: 70, suffix: "%", label: "of hiring managers report receiving fake applications", prefix: "" },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="glass rounded-2xl p-5 sm:p-7 text-center card-hover">
                  <div className="text-3xl lg:text-4xl font-black text-white mb-2">
                    <CountUp to={item.stat} prefix={item.prefix} suffix={item.suffix} />
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{item.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Employers Hesitate ── */}
      <section className="py-16 sm:py-28 px-4 sm:px-6 bg-gray-50 overflow-hidden relative">
        {/* Ambient orbs */}
        <div className="orb w-[500px] h-[500px] bg-blue-200/20 -top-32 -right-32" />
        <div className="orb w-80 h-80 bg-rose-200/15 bottom-0 -left-20" />
        <div className="max-w-6xl mx-auto relative">

          {/* Centered header */}
          <ScrollReveal className="text-center mb-10 sm:mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 text-base font-bold px-6 py-3 rounded-full mb-6 uppercase tracking-widest">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              The Problem
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-5 leading-tight tracking-tight">
              Why Employers Hesitate.
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Six reasons unverified candidates get skipped — before a human even reads their CV.
            </p>
          </ScrollReveal>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {hesitateReasons.map((item, i) => (
              <ScrollReveal key={item.num} delay={i * 110}>
                <div className="hesitate-card group h-full bg-white rounded-2xl p-7 relative overflow-hidden">
                  {/* Blue gradient top accent — always visible */}
                  <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-blue-400 via-violet-500 to-blue-500" />

                  {/* Blue tint wash on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="relative">
                    {/* Icon badge */}
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                      <svg
                        className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={hesitateIconPaths[i]} />
                      </svg>
                    </div>

                    <h3 className="text-gray-900 font-bold text-base mb-2.5 group-hover:text-blue-900 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 text-base leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Resolution banner */}
          <ScrollReveal className="mt-14">
            <div
              className="relative rounded-3xl px-5 sm:px-10 py-7 sm:py-9 overflow-hidden text-center"
              style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 45%, #7c3aed 100%)" }}
            >
              {/* Decorative orbs inside banner */}
              <div className="orb w-64 h-64 bg-white/8 -top-16 -right-16" />
              <div className="orb w-48 h-48 bg-white/6 -bottom-12 -left-12" />
              <div className="relative">
                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-3">The Solution</p>
                <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-black mb-3 leading-tight">
                  AuthentikMe eliminates every one<br className="hidden sm:block" /> of these risks — instantly.
                </h3>
                <p className="text-blue-200/80 text-sm mb-7 max-w-lg mx-auto">
                  One verification. Permanent trust. Employers see a verified badge and know immediately you're real.
                </p>
                <Link
                  href="/candidate/signup"
                  className="inline-flex items-center bg-white text-blue-700 font-bold px-7 py-3 rounded-xl text-sm hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Get Verified Now →
                </Link>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ── The Process ── */}
      <section
        id="process"
        className="py-16 sm:py-28 px-4 sm:px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #020617 0%, #0a0f2e 30%, #0f0a1e 65%, #020617 100%)" }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Layered orbs for depth */}
        <div className="orb w-[900px] h-[900px] bg-blue-600/10 -top-52 left-1/2 -translate-x-1/2" />
        <div className="orb w-[450px] h-[450px] bg-violet-600/14 top-1/4 -left-28" />
        <div className="orb w-[380px] h-[380px] bg-indigo-600/12 bottom-10 -right-16" />
        <div className="orb w-[260px] h-[260px] bg-cyan-500/8 top-1/2 right-1/4" />

        <div className="relative max-w-6xl mx-auto">
          {/* Header */}
          <ScrollReveal className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              The Process
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Verified in minutes.<br />
              <span className="gradient-text">Trusted by employers.</span>
            </h2>
          </ScrollReveal>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-14">
            {processSteps.map((item, i) => (
              <ScrollReveal key={item.num} delay={i * 140}>
                <div
                  className="process-card group relative h-full rounded-2xl p-8 overflow-hidden backdrop-blur-xl border border-white/10 transition-all duration-500 hover:border-blue-500/50 hover:-translate-y-2"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                  }}
                >
                  {/* Top shimmer line — visible on hover */}
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                  {/* Bottom ambient glow — visible on hover */}
                  <div className="absolute bottom-0 inset-x-0 h-2/5 bg-gradient-to-t from-blue-600/12 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative">
                    {/* Badge with glow ring on hover */}
                    <div className="relative w-14 h-14 mb-7">
                      <div className="absolute inset-0 rounded-2xl bg-blue-500/0 group-hover:bg-blue-500/30 group-hover:blur-md transition-all duration-400 scale-125" />
                      <div
                        className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg group-hover:scale-105 transition-transform duration-300"
                        style={{ background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)", boxShadow: "0 4px 20px rgba(59,130,246,0.35)" }}
                      >
                        {item.num}
                      </div>
                    </div>

                    <h3 className="text-white font-bold text-xl mb-3 group-hover:text-blue-100 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Stats row */}
          <ScrollReveal>
            <div
              className="grid grid-cols-1 sm:grid-cols-3 rounded-3xl overflow-hidden border border-white/10"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}
            >
              {[
                { value: "100%", label: "Human-Verified Candidates" },
                { value: "0",    label: "Bots or AI Accounts Passed" },
                { value: "3×",   label: "Higher Employer Callback Rate" },
              ].map((item, i) => (
                <div
                  key={item.value}
                  className={`py-7 sm:py-10 text-center transition-colors duration-300 hover:bg-white/5 ${i > 0 ? "border-t sm:border-t-0 sm:border-l border-white/10" : ""}`}
                >
                  <div
                    className="text-4xl lg:text-5xl font-black mb-2"
                    style={{ background: "linear-gradient(135deg, #60A5FA, #818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  >
                    {item.value}
                  </div>
                  <p className="text-gray-400 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Comparison ── */}
      <ComparisonSection />

      {/* ── CTA ── */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 bg-gray-950 overflow-hidden text-center">
        <div className="orb w-[800px] h-[800px] bg-blue-600/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-2xl mx-auto">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 glass text-blue-300 text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              Start Today
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-5 leading-tight">
              Ready to be<br /><span className="gradient-text">Verified?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Join candidates who have already proven their humanity to employers — and left the bots behind.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/candidate/signup" className="btn-shimmer text-white font-bold px-10 py-4 rounded-2xl text-base">
                Get Verified Now →
              </Link>
              <Link href="/employer/signup" className="glass text-gray-300 font-semibold px-10 py-4 rounded-2xl hover:text-white transition-colors text-base">
                I&apos;m an Employer
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 border-t border-gray-800/50 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-extrabold text-lg text-white">
            Authentik<span className="text-blue-500">Me</span>
          </div>
          <p className="text-gray-600 text-sm">© 2026 AuthentikMe. All rights reserved.</p>
          <div className="flex gap-5 text-sm text-gray-600">
            <a href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-gray-400 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
