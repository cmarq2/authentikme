"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

const navLinks = [
  { href: "/#why", label: "Why It Matters" },
  { href: "/#process", label: "Process" },
  { href: "/#compare", label: "Compare" },
  { href: "/pricing", label: "Pricing" },
]

export function LogoMark({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <span className={`${className} rounded-lg bg-gradient-to-b from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm shadow-blue-900/20`}>
      <svg className="w-[60%] h-[60%] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    </span>
  )
}

export default function HeaderNav({ overDark = false }: { overDark?: boolean }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Light text while the header floats transparently over a dark hero image
  const light = overDark && !scrolled && !open

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-white/85 backdrop-blur-xl border-b border-slate-900/5 shadow-[0_1px_0_rgba(15,23,42,0.02)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className={`flex items-center gap-2.5 font-semibold text-[19px] tracking-tight ${light ? "text-white" : "text-slate-900"} hover:opacity-80 transition-opacity`}>
          <LogoMark />
          <span>Authentik<span className={light ? "text-blue-300" : "text-blue-600"}>Me</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className={`hidden md:flex items-center gap-9 text-[14px] transition-colors ${light ? "text-white/75 [&_a:hover]:text-white" : "text-slate-600 [&_a:hover]:text-slate-900"}`}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="transition-colors">{l.label}</a>
          ))}
          <Link href="/contact" className="transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className={`text-[14px] font-medium transition-colors hidden sm:block px-3 py-2 ${light ? "text-white/85 hover:text-white" : "text-slate-700 hover:text-slate-900"}`}>
            Sign in
          </Link>
          <Link href="/candidate/signup" className={`text-[14px] font-medium px-4 sm:px-5 py-2.5 rounded-full transition-colors shadow-sm ${light ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-slate-900 text-white hover:bg-slate-800"}`}>
            Get Verified
          </Link>
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-lg transition-colors ${light ? "text-white hover:bg-white/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors">
              {l.label}
            </a>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors">
            Contact
          </Link>
          <div className="pt-1 border-t border-slate-100">
            <Link href="/login" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
