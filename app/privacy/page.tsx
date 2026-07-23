import Link from "next/link"

export const metadata = {
  title: "Privacy Policy – AuthentikMe",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-900">
            Authentik<span className="text-blue-500">Me</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 space-y-8 text-sm leading-relaxed text-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-500">Last updated: July 23, 2026</p>
          </div>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
            <p className="mb-2">
              <strong>Account information:</strong> name, email address, and a securely hashed password.
              We never store your password in plain text.
            </p>
            <p className="mb-2">
              <strong>Identity verification data:</strong> a government-issued ID document you upload,
              the result of a bot/human check, and a two-factor authentication secret used to confirm
              your identity.
            </p>
            <p className="mb-2">
              <strong>Payment information:</strong> processed directly by our payment provider, Stripe.
              We do not receive or store your card number; we retain only Stripe-issued references
              (customer ID, subscription ID, session ID) needed to manage your subscription.
            </p>
            <p>
              <strong>Technical and account activity data:</strong> your IP address at signup and at the
              moment you accept our Terms of Service, IP address and device/browser information for each
              login, and records of subscription changes (including cancellations).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Government ID Retention</h2>
            <p>
              Your uploaded ID document is deleted immediately once all verification steps are complete
              &mdash; it has served its purpose and there is no reason to keep it. If verification is never
              completed, the document is automatically deleted no later than 24 hours after upload,
              regardless of status. Employers who receive your verification code never see the ID document
              itself, only confirmation that verification was completed.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. How We Use Your Information</h2>
            <p>
              We use your information to create and secure your account, verify your identity, process
              subscription payments, communicate with you (account verification, password resets, and
              service-related notices), maintain the security and integrity of the service, and respond to
              payment disputes or fraud investigations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Who We Share Information With</h2>
            <p>
              We share information only with the service providers needed to run AuthentikMe: Stripe
              (payment processing), Google reCAPTCHA (bot detection), and Vercel (hosting and secure file
              storage for ID documents prior to deletion). We do not sell your personal information. An
              employer you share your verification code with only sees that your identity was verified
              &mdash; never your ID document, password, or payment details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Cookies and Sessions</h2>
            <p>
              We use a session cookie to keep you signed in. We do not use third-party advertising or
              tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Data Retention</h2>
            <p>
              We retain account and activity records for as long as your account is active and as needed
              to comply with legal obligations, resolve disputes, and enforce our agreements. ID documents
              follow the shorter retention schedule described in Section 2.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal information at any
              time by contacting us at{" "}
              <a href="mailto:noreply@authentikme.com" className="text-blue-600 hover:underline">
                noreply@authentikme.com
              </a>
              . You can cancel your subscription at any time from your account dashboard; see our{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              for details on cancellation and billing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Children&apos;s Privacy</h2>
            <p>
              AuthentikMe is intended for use by job candidates and employers who are at least 18 years
              old. We do not knowingly collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Continued use of the service after an
              update constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Contact</h2>
            <p>
              Questions about this policy or your data can be sent to{" "}
              <a href="mailto:noreply@authentikme.com" className="text-blue-600 hover:underline">
                noreply@authentikme.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline font-medium">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
