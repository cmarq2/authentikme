import Link from "next/link"

export const metadata = {
  title: "Terms of Service – AuthentikMe",
}

export default function TermsPage() {
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-500">Last updated: July 23, 2026</p>
          </div>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
            <p>
              By creating an account with AuthentikMe, checking the agreement box at signup, and/or using
              our identity verification service, you agree to be bound by these Terms of Service. If you
              do not agree, do not create an account or use the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Description of Service</h2>
            <p>
              AuthentikMe provides an identity verification service for job candidates. Verification
              includes email confirmation, a human/bot check, government ID document review, and
              two-factor authentication setup. Once all steps are complete, we issue a unique verification
              code that the candidate may share with prospective employers to confirm their identity was
              verified by AuthentikMe.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Fees</h2>
            <p>
              AuthentikMe Identity Verification is a one-time fee of $12.99 USD, charged once when you
              complete the payment step of verification. There is no subscription and no recurring charge.
              Prices may change with notice posted to this page; any change does not affect fees already
              paid. Accounts that signed up under a previous monthly plan continue to be billed under that
              plan until it is cancelled.
            </p>
            <p className="mt-3">
              Recruiter and employer accounts are offered on a recruiter plan of $199.99 USD per month,
              billed monthly. Current pricing for all plans is shown on our{" "}
              <Link href="/pricing" className="text-blue-600 hover:underline">pricing page</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Legacy Monthly Plans</h2>
            <p>
              If your account is on a previous monthly subscription, you may cancel it at any time from your
              account dashboard. Cancellation takes effect immediately: your subscription is terminated at
              the moment you cancel, no further charges will be made, and your verified badge/code is
              deactivated.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Refund Policy</h2>
            <p>
              Payments are non-refundable, including the one-time verification fee, except where
              required by law. If you believe you were charged in error, contact us first at{" "}
              <a href="mailto:noreply@authentikme.com" className="text-blue-600 hover:underline">
                noreply@authentikme.com
              </a>{" "}
              before initiating a payment dispute with your bank or card issuer &mdash; we will work with you
              to resolve billing issues directly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Account Records</h2>
            <p>
              To operate the service and respond to billing inquiries, we retain records associated with
              your account, including your signup date and IP address, the timestamp and IP address at which
              you accepted these Terms, email verification status, login history (timestamp, IP address, and
              device/browser information), and payment/subscription records processed through our payment
              provider (Stripe). This information may be used to verify account activity, respond to payment
              disputes, and enforce these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the service after an update
              constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Contact</h2>
            <p>
              Questions about these Terms or your account can be sent to{" "}
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
