"use client"
import { useState } from "react"
import Link from "next/link"

export default function HeaderNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-extrabold text-xl tracking-tight text-gray-900 hover:opacity-80 transition-opacity">
          Authentik<span className="text-blue-600">Me</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <a href="#why" className="hover:text-gray-900 transition-colors">Why It Matters</a>
          <a href="#process" className="hover:text-gray-900 transition-colors">Process</a>
          <a href="#compare" className="hover:text-gray-900 transition-colors">Compare</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors hidden sm:block">
            Sign in
          </Link>
          <Link href="/candidate/signup" className="btn-shimmer text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl">
            Get Verified
          </Link>
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl px-4 py-3 space-y-1">
          <a href="#why" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
            Why It Matters
          </a>
          <a href="#process" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
            Process
          </a>
          <a href="#compare" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
            Compare
          </a>
          <div className="pt-1 border-t border-gray-100">
            <Link href="/login" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
