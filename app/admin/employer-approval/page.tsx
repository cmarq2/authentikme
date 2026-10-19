import Link from "next/link"
import { prisma } from "@/lib/prisma"
import ApprovalActions from "./ApprovalActions"

export const dynamic = "force-dynamic"

export default async function EmployerApprovalPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token

  const employer = token
    ? await prisma.user.findUnique({ where: { employerApprovalToken: token } })
    : null

  if (!employer || employer.role !== "EMPLOYER") {
    return (
      <Shell>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Link not valid</h1>
        <p className="text-sm text-gray-600">
          This approval link doesn&apos;t match a pending employer account. It may have been
          superseded by a newer request.
        </p>
      </Shell>
    )
  }

  const fmt = (d: Date | null) =>
    d ? new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "—"

  return (
    <Shell>
      <h1 className="text-xl font-bold text-gray-900 mb-1">Employer approval</h1>
      <p className="text-sm text-gray-500 mb-6">
        This account cannot sign in until you approve it.
      </p>

      <dl className="text-sm border border-gray-200 rounded-xl divide-y divide-gray-200 mb-6">
        <Row label="Company" value={employer.company ?? "—"} />
        <Row label="Contact" value={employer.name ?? "—"} />
        <Row label="Email" value={employer.email} />
        <Row label="Signup IP" value={employer.signupIp ?? "—"} />
        <Row label="Registered" value={fmt(employer.createdAt)} />
        <Row label="Terms accepted" value={fmt(employer.termsAcceptedAt)} />
        <Row label="Current status" value={employer.employerApprovalStatus} />
        {employer.employerApprovalDecidedAt && (
          <Row label="Last decision" value={fmt(employer.employerApprovalDecidedAt)} />
        )}
      </dl>

      <ApprovalActions token={token!} currentStatus={employer.employerApprovalStatus} />
    </Shell>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-3">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-gray-900 font-medium text-right break-all">{value}</dd>
    </div>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-gray-900">
            Authentik<span className="text-blue-600">Me</span>
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">{children}</div>
      </div>
    </div>
  )
}
