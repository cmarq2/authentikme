import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="text-white font-bold text-xl tracking-tight">
          Authentik<span className="text-blue-300">Me</span>
        </div>
        <Link
          href="/login"
          className="text-blue-200 hover:text-white text-sm font-medium transition-colors"
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">
        <div className="inline-flex items-center gap-2 bg-blue-800 border border-blue-600 text-blue-200 text-sm px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          Fighting fraudulent job applications
        </div>

        <h1 className="text-5xl font-extrabold text-white max-w-3xl leading-tight mb-6">
          Prove You Are Real.<br />
          <span className="text-blue-300">Get Hired with Confidence.</span>
        </h1>

        <p className="text-blue-200 text-lg max-w-xl mb-12">
          Candidates verify their identity with email, reCAPTCHA, and Google Authenticator,
          then receive a unique code to share with employers for instant verification.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/candidate/signup"
            className="bg-white text-blue-900 font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg shadow-lg"
          >
            I'm a Candidate
          </Link>
          <Link
            href="/employer/signup"
            className="bg-blue-600 border border-blue-500 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-500 transition-colors text-lg shadow-lg"
          >
            I'm an Employer
          </Link>
        </div>

        {/* How it works */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl w-full text-left">
          {[
            {
              step: "1",
              title: "Verify Your Identity",
              desc: "Confirm your email, pass reCAPTCHA, and set up Google Authenticator.",
            },
            {
              step: "2",
              title: "Get Your Code",
              desc: "Receive a unique verification code tied to your verified identity.",
            },
            {
              step: "3",
              title: "Share With Employers",
              desc: "Employers enter your code in their dashboard for instant confirmation.",
            },
          ].map((item) => (
            <div key={item.step} className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/10">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-sm mb-3">
                {item.step}
              </div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-blue-200 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
