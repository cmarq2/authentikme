import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmployerApprovedEmail, sendEmployerRejectedEmail } from "@/lib/email"

// Approve or reject a pending employer. Authorised by the single-account approval token
// that was emailed to the admin mailbox at signup — no session required.
export async function POST(req: Request) {
  const { token, decision } = await req.json()

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Approval token required" }, { status: 400 })
  }
  if (decision !== "approve" && decision !== "reject") {
    return NextResponse.json({ error: "decision must be 'approve' or 'reject'" }, { status: 400 })
  }

  const employer = await prisma.user.findUnique({ where: { employerApprovalToken: token } })
  if (!employer || employer.role !== "EMPLOYER") {
    return NextResponse.json({ error: "This approval link is no longer valid." }, { status: 404 })
  }

  const status = decision === "approve" ? "APPROVED" : "REJECTED"

  await prisma.user.update({
    where: { id: employer.id },
    data: {
      employerApprovalStatus: status,
      employerApprovalDecidedAt: new Date(),
    },
  })

  try {
    if (decision === "approve") {
      await sendEmployerApprovedEmail(employer.email, employer.company ?? "your company")
    } else {
      await sendEmployerRejectedEmail(employer.email, employer.company ?? "your company")
    }
  } catch (err) {
    console.error("admin/employer-approval: notification email failed", err)
    return NextResponse.json({
      status,
      message: `Employer ${decision === "approve" ? "approved" : "rejected"}, but the notification email to ${employer.email} failed to send.`,
    })
  }

  return NextResponse.json({
    status,
    message:
      decision === "approve"
        ? `${employer.company ?? employer.email} approved. They've been emailed and can now sign in.`
        : `${employer.company ?? employer.email} rejected. They've been emailed and cannot sign in.`,
  })
}
