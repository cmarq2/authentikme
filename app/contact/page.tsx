import type { Metadata } from "next"
import Image from "next/image"
import HeaderNav from "../components/HeaderNav"
import SiteFooter from "../components/SiteFooter"
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the AuthentikMe team — questions about candidate verification, employer accounts, partnerships, or press.",
  alternates: { canonical: "/contact" },
}

const channels = [
  {
    title: "Candidates",
    desc: "Questions about verification, your code, or your payment.",
    icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  },
  {
    title: "Employers",
    desc: "Account approval, verifying candidate codes, and team access.",
    icon: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
  },
  {
    title: "Partnerships & press",
    desc: "Integrations, job boards, recruiters, and media enquiries.",
    icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] text-slate-900 antialiased">
      <HeaderNav overDark />

      {/* ── Hero ── */}
      <section className="relative pt-36 sm:pt-44 pb-40 sm:pb-48 px-4 sm:px-6 overflow-hidden bg-slate-950">
        <Image
          src="/images/contact-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-2xl" style={{ animation: "fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both" }}>
            <p className="eyebrow text-blue-300 mb-6">Contact</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.035em] leading-[1.02] text-white mb-6">
              Let&apos;s talk about <span className="gradient-text-light text-[1.08em]">trust.</span>
            </h1>
            <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-xl">
              Whether you&apos;re a candidate, an employer, or a potential partner — send us a message and a real person on our team will get back to you.
            </p>
          </div>
        </div>
      </section>

      {/* ── Form + side panel ── */}
      <section className="relative px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto -mt-28 sm:-mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] rounded-[28px] overflow-hidden bg-white border border-slate-900/[0.06] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_40px_80px_-30px_rgba(15,23,42,0.35)]">

            {/* Form */}
            <div className="p-6 sm:p-10 lg:p-12">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mb-2">Send us a message</h2>
              <p className="text-slate-500 text-[15px] mb-8">Fields marked <span className="text-blue-600">*</span> are required.</p>
              <ContactForm />
            </div>

            {/* Side panel */}
            <aside className="relative min-h-[420px] lg:min-h-0 bg-slate-950 overflow-hidden">
              <Image
                src="/images/contact-team.jpg"
                alt="A team meeting around a conference table"
                fill
                sizes="(min-width: 1024px) 460px, 100vw"
                className="object-cover object-center opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/40" />

              <div className="relative h-full flex flex-col justify-end p-6 sm:p-10">
                <p className="eyebrow text-blue-300 mb-5">How we can help</p>
                <ul className="space-y-5">
                  {channels.map(c => (
                    <li key={c.title} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 backdrop-blur flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                          <path d={c.icon} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium text-[15px]">{c.title}</p>
                        <p className="text-slate-400 text-sm leading-relaxed">{c.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 text-sm text-slate-300">
                  <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  Your details are only used to reply to your message.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
