import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const auth = req.headers.get("authorization")
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")
  if (!email) {
    return NextResponse.json({ error: "email query param is required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      loginEvents: {
        orderBy: { createdAt: "desc" },
        take: 100,
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "No account found for that email" }, { status: 404 })
  }

  return NextResponse.json({
    account: {
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      signupIp: user.signupIp,
    },
    termsAcceptance: {
      acceptedAt: user.termsAcceptedAt,
      acceptedIp: user.termsAcceptedIp,
    },
    emailVerification: {
      verified: user.emailVerified,
      verifiedAt: user.emailVerifiedAt,
    },
    identityVerification: {
      recaptchaDone: user.recaptchaDone,
      idUploaded: user.idUploaded,
      idUploadedAt: user.idUploadedAt,
      totpEnabled: user.totpEnabled,
      verificationCode: user.verificationCode,
    },
    billing: {
      stripePaid: user.stripePaid,
      stripeSessionId: user.stripeSessionId,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
    },
    loginHistory: user.loginEvents.map((event) => ({
      timestamp: event.createdAt,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
    })),
  })
}
