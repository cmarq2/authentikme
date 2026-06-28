import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-06-24.dahlia" })
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    if (!userId) return NextResponse.json({ ok: true })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || user.stripePaid) return NextResponse.json({ ok: true })

    // Generate verification code if all other steps are also complete
    const allStepsDone = user.emailVerified && user.recaptchaDone && user.totpEnabled
    const verificationCode = allStepsDone
      ? `ATK-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`
      : null

    await prisma.user.update({
      where: { id: userId },
      data: {
        stripePaid: true,
        stripeSessionId: session.id,
        ...(verificationCode ? { verificationCode } : {}),
      },
    })
  }

  return NextResponse.json({ ok: true })
}
