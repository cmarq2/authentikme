import Link from "next/link"
import { LogoMark } from "./HeaderNav"

export default function SiteFooter() {
  return (
    <footer className="bg-slate-950 border-t border-white/[0.06] pt-14 pb-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10 pb-10 border-b border-white/[0.06]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 font-semibold text-lg text-white tracking-tight mb-4">
              <LogoMark />
              <span>Authentik<span className="text-blue-400">Me</span></span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Identity verification for job seekers. Prove you&apos;re real — and give employers the confidence to say yes.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-sm">
            <div>
              <p className="text-slate-300 font-medium mb-4">Candidates</p>
              <ul className="space-y-3 text-slate-500">
                <li><Link href="/candidate/signup" className="hover:text-slate-300 transition-colors">Get verified</Link></li>
                <li><Link href="/login" className="hover:text-slate-300 transition-colors">Sign in</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-slate-300 font-medium mb-4">Employers</p>
              <ul className="space-y-3 text-slate-500">
                <li><Link href="/employer/signup" className="hover:text-slate-300 transition-colors">Create account</Link></li>
                <li><Link href="/contact" className="hover:text-slate-300 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-slate-300 font-medium mb-4">Legal</p>
              <ul className="space-y-3 text-slate-500">
                <li><Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="text-slate-600 text-sm pt-8">© 2026 AuthentikMe. All rights reserved.</p>
      </div>
    </footer>
  )
}
