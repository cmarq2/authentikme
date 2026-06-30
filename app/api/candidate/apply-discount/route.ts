import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

const VALID_CODES: Record<string, string> = {
  FREE1202: "free_FREE1202",
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { code } = await req.json()
  const normalised = (code ?? "").trim().toUpperCase()
  const subscriptionId = VALID_CODES[normalised]

  if (!subscriptionId) {
    return NextResponse.json({ error: "Invalid discount code." }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 })
  if (user.stripePaid) return NextResponse.json({ error: "You already have an active subscription." }, { status: 400 })

  const allStepsDone = user.emailVerified && user.recaptchaDone && user.totpEnabled
  const verificationCode = allStepsDone
    ? `ATK-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`
    : null

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      stripePaid: true,
      stripeSubscriptionId: subscriptionId,
      ...(verificationCode ? { verificationCode } : {}),
    },
  })

  return NextResponse.json({ ok: true })
}
