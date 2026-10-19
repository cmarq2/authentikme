import Link from "next/link"
import Image from "next/image"
import ScrollReveal from "./components/ScrollReveal"
import CountUp from "./components/CountUp"
import HeroVisual from "./components/HeroVisual"
import HowItWorks from "./components/HowItWorks"
import ComparisonSection from "./components/ComparisonSection"
import ProcessVisual from "./components/ProcessVisual"
import HeaderNav from "./components/HeaderNav"
import SiteFooter from "./components/SiteFooter"

const whyMatters = [
  { num: "01", title: "Prove You're Real", desc: "Our identity verification confirms you are a real, living person — not an AI-generated profile, not a spam account. Employers receive that confirmation the moment they view your profile." },
  { num: "02", title: "Build Employer Trust", desc: "A verified identity signals that you take your professional reputation seriously. Employers prioritise candidates they can trust — and a verified badge tells them exactly that before the first interview." },
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
  { num: "03", title: "Earn Employer Confidence", desc: "Your verified status is visible to potential employers. They know instantly you are a verified professional — a real, accountable candidate they can trust and engage with directly." },
]

const tickerItems = [
  "100% Identity Verified",
  "Verified Professionals & Contractors",
  "3× More Callbacks",
  "Verified in Minutes",
  "Bank-Grade Security",
  "2,400+ Candidates Verified",
  "Tamper-Proof Identity",
  "Instant Employer Access",
  "Two-Factor Authenticated",
  "AI Fraud Screening",
  "Real-Time Confirmation",
]

const hesitateIconPaths = [
  "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z",
  "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z",
  "M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z",
  "M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z",
]

const headingCls = "font-semibold tracking-[-0.035em] leading-[1.05]"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">

      {/* ── Header ── */}
      <HeaderNav />

      {/* ── Hero ── */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden bg-[#F8F7F4] grain">
        {/* Soft light wash */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(60% 50% at 75% 30%, rgba(59,130,246,0.10) 0%, transparent 70%), radial-gradient(40% 40% at 10% 90%, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-12 items-center">
            {/* Left */}
            <div style={{ animation: "slideInLeft 0.9s cubic-bezier(0.16,1,0.3,1) both" }}>
              <div className="inline-flex items-center gap-2.5 bg-white border border-slate-900/10 text-slate-700 text-[12px] font-medium pl-2 pr-3.5 py-1.5 rounded-full mb-8 shadow-sm">
                <span className="relative flex w-2 h-2 ml-1">
                  <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-60" />
                  <span className="relative block w-2 h-2 rounded-full bg-blue-600" />
                </span>
                Fighting fraudulent job applications
              </div>

              <h1 className={`text-[2.6rem] sm:text-6xl lg:text-[4.1rem] ${headingCls} mb-7 text-slate-900`}>
                Prove you are real.<br />
                <span className="gradient-text text-[1.08em]">The Authentik You.</span>
              </h1>

              <p className="text-slate-600 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
                Candidates verify their identity with email, reCAPTCHA, and Google Authenticator — then receive a unique code employers use for instant confirmation.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <Link href="/candidate/signup" className="btn-shimmer text-white font-medium px-7 py-4 rounded-full text-[15px] text-center inline-flex items-center justify-center gap-2">
                  I&apos;m a Candidate
                  <span aria-hidden>→</span>
                </Link>
                <Link href="/employer/signup" className="bg-white text-slate-900 font-medium px-7 py-4 rounded-full border border-slate-900/10 hover:border-slate-900/25 hover:shadow-md transition-all text-[15px] text-center">
                  I&apos;m an Employer
                </Link>
              </div>

              {/* Trust line */}
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3, 4].map(n => (
                    <Image
                      key={n}
                      src={`/images/avatar-${n}.jpg`}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border-[2.5px] border-[#F8F7F4] object-cover"
                    />
                  ))}
                </div>
                <div className="leading-tight">
                  <div className="flex items-center gap-0.5 text-amber-500 mb-0.5" aria-hidden>
                    {[0, 1, 2, 3, 4].map(i => (
                      <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" /></svg>
                    ))}
                  </div>
                  <span>Join <strong className="text-slate-900 font-semibold">2,400+</strong> verified candidates</span>
                </div>
              </div>
            </div>

            {/* Right — photo with floating verification card */}
            <div className="relative" style={{ animation: "slideInRight 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both" }}>
              <div className="relative ml-auto w-full max-w-[460px]">
                <div className="photo-frame rounded-[28px] aspect-[4/5] bg-slate-200">
                  <Image
                    src="/images/hero-professional.jpg"
                    alt="A confident professional ready for her next role"
                    fill
                    priority
                    sizes="(min-width: 1024px) 460px, 90vw"
                    className="object-cover object-[50%_30%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
                </div>

                {/* Floating "verified" chip */}
                <div className="absolute top-6 -right-3 sm:-right-6 bg-white/95 backdrop-blur rounded-2xl shadow-xl shadow-slate-900/15 border border-white px-3.5 py-2.5 flex items-center gap-2.5 float">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="leading-tight">
                    <p className="text-slate-900 text-[13px] font-semibold">100% Verified</p>
                    <p className="text-slate-500 text-[11px]">Identity confirmed</p>
                  </div>
                </div>

                {/* Verification card overlapping the photo */}
                <div className="relative -mt-40 sm:-mt-48 sm:absolute sm:mt-0 sm:bottom-8 sm:-left-16 lg:-left-20 mx-auto sm:mx-0 w-fit">
                  <HeroVisual />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <section className="bg-white py-5 overflow-hidden border-y border-slate-900/[0.06]">
        <div className="flex [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="ticker-track flex items-center whitespace-nowrap">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="flex items-center text-[13px] font-medium text-slate-500 tracking-wide">
                <span className="px-7">{item}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <HowItWorks />

      {/* ── Why It Matters ── */}
      <section id="why" className="py-20 sm:py-32 px-4 sm:px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Left — photo */}
            <ScrollReveal direction="left" className="relative">
              <div className="photo-frame rounded-[28px] aspect-[4/5] sm:aspect-[5/6] bg-slate-200">
                <Image
                  src="/images/verified-professionals.jpg"
                  alt="Two confident professionals in blazers standing in a modern office"
                  fill
                  quality={90}
                  sizes="(min-width: 1024px) 540px, 92vw"
                  className="object-cover object-center"
                />
              </div>
              {/* Stat card */}
              <div className="absolute -bottom-6 right-4 sm:-right-6 bg-white rounded-2xl border border-slate-900/[0.06] shadow-2xl shadow-slate-900/15 p-5 sm:p-6 w-[230px]">
                <p className="text-slate-500 text-xs font-medium mb-1">Employer callback rate</p>
                <p className="text-4xl font-semibold tracking-tight text-slate-900">3×</p>
                <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500" />
                </div>
                <p className="text-slate-400 text-[11px] mt-2">Verified vs. unverified candidates</p>
              </div>
            </ScrollReveal>

            {/* Right — copy */}
            <div>
              <ScrollReveal direction="right">
                <p className="eyebrow text-blue-700 mb-6">Why It Matters</p>
                <h2 className={`text-4xl sm:text-5xl ${headingCls} text-slate-900 mb-6`}>
                  Verified professionals.<br />
                  <span className="gradient-text text-[1.08em]">Trusted from day one.</span>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-10">
                  Employers are flooded with AI-generated applications and spam accounts. AuthentikMe proves you are neither — giving you an immediate, measurable edge over every unverified applicant.
                </p>
              </ScrollReveal>

              <div className="divide-y divide-slate-900/[0.07] border-y border-slate-900/[0.07] mb-10">
                {whyMatters.map((item, i) => (
                  <ScrollReveal key={item.num} delay={i * 120} direction="right">
                    <div className="group flex gap-6 py-6">
                      <span className="font-serif italic text-2xl text-blue-600/70 w-8 shrink-0 leading-none pt-0.5">{item.num}</span>
                      <div>
                        <h3 className="text-slate-900 font-semibold text-lg mb-1.5 tracking-tight">{item.title}</h3>
                        <p className="text-slate-600 text-[15px] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal direction="right">
                <Link href="/candidate/signup" className="btn-shimmer text-white font-medium px-7 py-3.5 rounded-full inline-flex items-center gap-2 text-[15px]">
                  Start Verification <span aria-hidden>→</span>
                </Link>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ── Employer Reality — dark stats ── */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 bg-slate-950 overflow-hidden grain">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(50% 60% at 85% 0%, rgba(59,130,246,0.14) 0%, transparent 70%)" }} />

        <div className="relative max-w-6xl mx-auto">
          <ScrollReveal className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-end mb-14 sm:mb-16">
            <div>
              <p className="eyebrow text-blue-300 mb-5">The Employer Reality</p>
              <h2 className={`text-3xl sm:text-5xl ${headingCls} text-white`}>
                The scale of <span className="gradient-text-light text-[1.08em]">the problem.</span>
              </h2>
            </div>
            <div>
              <p className="text-slate-400 text-lg leading-relaxed">
                Over 70% of hiring managers now report receiving AI-generated, fake, or spam applications — and the number is rising every quarter.
              </p>
              <p className="text-slate-600 text-xs mt-3">Industry hiring data, 2024 — LinkedIn Talent Report</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-white/10">
            {[
              { stat: 33, suffix: "%", label: "of online applicants misrepresent their identity", prefix: "" },
              { stat: 17000, suffix: "", label: "average cost of a bad hire in lost time", prefix: "$" },
              { stat: 23, suffix: "h", label: "average time wasted per fraudulent application", prefix: "" },
              { stat: 70, suffix: "%", label: "of hiring managers report receiving fake applications", prefix: "" },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className={`pt-8 pb-2 pr-6 ${i % 2 === 1 ? "pl-6 border-l border-white/10" : ""} ${i === 2 ? "lg:pl-6 lg:border-l lg:border-white/10" : ""}`}>
                  <div className="text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-3">
                    <CountUp to={item.stat} prefix={item.prefix} suffix={item.suffix} />
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-[200px]">{item.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Employers Hesitate ── */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 bg-[#F8F7F4] overflow-hidden relative">
        <div className="max-w-6xl mx-auto relative">

          <ScrollReveal className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
            <p className="eyebrow text-rose-600 mb-6">The Problem</p>
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl ${headingCls} text-slate-900 mb-5`}>
              Why employers <span className="gradient-text text-[1.08em]">hesitate.</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Six reasons unverified candidates get skipped — before a human even reads their CV.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {hesitateReasons.map((item, i) => (
              <ScrollReveal key={item.num} delay={i * 90}>
                <div className="hesitate-card group h-full bg-white rounded-2xl p-7 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-7">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-900/[0.06] flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-300">
                      <svg className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                        <path d={hesitateIconPaths[i]} />
                      </svg>
                    </div>
                    <span className="font-serif italic text-xl text-slate-300">{item.num}</span>
                  </div>
                  <h3 className="text-slate-900 font-semibold text-lg mb-2.5 tracking-tight">{item.title}</h3>
                  <p className="text-slate-600 text-[15px] leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Resolution banner — photo backed */}
          <ScrollReveal className="mt-14">
            <div className="relative rounded-[28px] overflow-hidden photo-frame">
              <Image
                src="/images/handshake.jpg"
                alt="An employer and a verified candidate shaking hands"
                fill
                sizes="(min-width: 1152px) 1152px, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-blue-950/10" />
              <div className="relative px-6 sm:px-14 py-12 sm:py-16 max-w-2xl">
                <p className="eyebrow text-blue-300 mb-5">The Solution</p>
                <h3 className={`text-white text-3xl sm:text-4xl ${headingCls} mb-4`}>
                  AuthentikMe eliminates every one of these risks — <span className="gradient-text-light text-[1.08em]">instantly.</span>
                </h3>
                <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
                  One verification. Permanent trust. Employers see a verified badge and know immediately you&apos;re real.
                </p>
                <Link
                  href="/candidate/signup"
                  className="inline-flex items-center gap-2 bg-white text-slate-900 font-medium px-7 py-3.5 rounded-full text-[15px] hover:bg-slate-100 transition-colors shadow-lg"
                >
                  Get Verified Now <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ── The Process ── */}
      <section id="process" className="py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden bg-slate-950 grain">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(60% 50% at 50% 0%, rgba(59,130,246,0.16) 0%, transparent 70%)" }} />

        <div className="relative max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-14 sm:mb-20">
            <p className="eyebrow text-blue-300 mb-6">The Process</p>
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl ${headingCls} text-white`}>
              Verified in minutes.<br />
              <span className="gradient-text-light text-[1.08em]">Trusted by employers.</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            {processSteps.map((item, i) => (
              <ScrollReveal key={item.num} delay={i * 140}>
                <div className="process-card group relative h-full rounded-2xl p-8 overflow-hidden border border-white/[0.08] bg-white/[0.03] transition-all duration-500 hover:border-blue-400/30 hover:-translate-y-1">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <ProcessVisual step={i} />
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="font-serif italic text-3xl text-blue-300/80 leading-none">{item.num}</span>
                    <h3 className="text-white font-semibold text-xl tracking-tight">{item.title}</h3>
                  </div>
                  <p className="text-slate-400 text-[15px] leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03]">
              {[
                { value: "100%", label: "Identity-Verified Professionals" },
                { value: "<3 min", label: "Average Time to Get Verified" },
                { value: "3×",   label: "Higher Employer Callback Rate" },
              ].map((item, i) => (
                <div
                  key={item.value}
                  className={`py-9 sm:py-11 text-center ${i > 0 ? "border-t sm:border-t-0 sm:border-l border-white/[0.08]" : ""}`}
                >
                  <div className="text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-2">{item.value}</div>
                  <p className="text-slate-400 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Comparison ── */}
      <ComparisonSection />

      {/* ── Pricing preview ── */}
      <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#F8F7F4] border-t border-slate-900/[0.06]">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-12 sm:mb-14">
            <p className="eyebrow text-blue-700 mb-6">Pricing</p>
            <h2 className={`text-4xl sm:text-5xl ${headingCls} text-slate-900`}>
              Simple pricing. <span className="gradient-text text-[1.08em]">Real trust.</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ScrollReveal delay={0}>
              <div className="h-full rounded-[24px] bg-white border border-slate-900/[0.08] shadow-[0_24px_48px_-24px_rgba(15,23,42,0.18)] p-8 flex flex-col">
                <p className="text-sm font-semibold text-blue-700 mb-4">Individual</p>
                <p className="text-5xl font-semibold tracking-tight text-slate-900 mb-1">$12.99</p>
                <p className="text-slate-500 text-sm mb-8">One-time payment · no subscription</p>
                <Link href="/candidate/signup" className="btn-shimmer mt-auto text-white font-medium px-7 py-3.5 rounded-full text-[15px] text-center inline-flex items-center justify-center gap-2">
                  Get Verified <span aria-hidden>→</span>
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <div className="relative h-full rounded-[24px] bg-slate-950 border border-white/10 shadow-[0_30px_60px_-20px_rgba(30,58,138,0.55)] p-8 flex flex-col overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(70% 50% at 100% 0%, rgba(59,130,246,0.28) 0%, transparent 70%)" }} />
                <p className="relative text-sm font-semibold text-blue-300 mb-4">Recruiter</p>
                <p className="relative text-5xl font-semibold tracking-tight text-white mb-1">$199.99<span className="text-slate-400 text-lg font-normal ml-1.5">/month</span></p>
                <p className="relative text-slate-500 text-sm mb-8">Billed monthly · account approval required</p>
                <Link href="/employer/signup" className="relative mt-auto bg-white text-slate-900 font-medium px-7 py-3.5 rounded-full text-[15px] text-center inline-flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-lg">
                  Start as a Recruiter <span aria-hidden>→</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal className="text-center mt-8">
            <Link href="/pricing" className="text-blue-700 font-medium text-[15px] hover:underline underline-offset-2">
              Compare plans and FAQs →
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA — photo backed ── */}
      <section className="relative py-24 sm:py-36 px-4 sm:px-6 overflow-hidden text-center bg-slate-950">
        <Image
          src="/images/office.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/80 to-slate-950" />

        <div className="relative max-w-2xl mx-auto">
          <ScrollReveal>
            <p className="eyebrow text-blue-300 mb-7">Start Today</p>
            <h2 className={`text-5xl sm:text-7xl ${headingCls} text-white mb-6`}>
              Ready to be <span className="gradient-text-light text-[1.08em]">verified?</span>
            </h2>
            <p className="text-slate-300 text-lg mb-10 leading-relaxed">
              Join the professionals and contractors who have verified their identity — and give every employer a reason to trust you first.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/candidate/signup" className="btn-shimmer text-white font-medium px-9 py-4 rounded-full text-[15px] inline-flex items-center justify-center gap-2">
                Get Verified Now <span aria-hidden>→</span>
              </Link>
              <Link href="/employer/signup" className="bg-white/10 backdrop-blur border border-white/15 text-white font-medium px-9 py-4 rounded-full hover:bg-white/15 transition-colors text-[15px]">
                I&apos;m an Employer
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <SiteFooter />

    </div>
  )
}
