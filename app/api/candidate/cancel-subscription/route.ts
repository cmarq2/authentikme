import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getClientIp } from "@/lib/ip"
import { sendLegacySubscriptionCancelEmail } from "@/lib/email"
import Stripe from "stripe"

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Payment not configured." }, { status: 503 })
  }
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.stripePaid) {
    return NextResponse.json({ error: "No active subscription found." }, { status: 400 })
  }

  // Only call Stripe for real (paid) subscriptions, not free discount ones
  const isFreeAccount = !user.stripeSubscriptionId || user.stripeSubscriptionId.startsWith("free_")
  let needsManualStripeCancel = false
  if (!isFreeAccount) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-06-24.dahlia" })
    try {
      await stripe.subscriptions.cancel(user.stripeSubscriptionId!)
    } catch (err) {
      // Legacy subscriptions were created in the previous Stripe account, which the current
      // key can't see. Still cancel on our side, and flag it for a manual cancel in Stripe.
      if (err instanceof Stripe.errors.StripeError && err.code === "resource_missing") {
        needsManualStripeCancel = true
        console.error(`Legacy subscription ${user.stripeSubscriptionId} not found in current Stripe account; cancel it manually`)
      } else {
        console.error("Stripe subscription cancel failed:", err)
        return NextResponse.json({ error: "We couldn't cancel your subscription right now. Please try again or contact support." }, { status: 502 })
      }
    }
  }

  await prisma.subscriptionEvent.create({
    data: {
      userId: user.id,
      type: "canceled",
      source: "user",
      ipAddress: getClientIp(req.headers),
      stripeSubscriptionId: user.stripeSubscriptionId,
    },
  })

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      stripePaid: false,
      stripeSubscriptionId: null,
      verificationCode: null,
    },
  })

  if (needsManualStripeCancel) {
    try {
      await sendLegacySubscriptionCancelEmail({
        email: user.email,
        name: user.name,
        stripeSubscriptionId: user.stripeSubscriptionId!,
      })
    } catch (err) {
      console.error("Failed to send legacy subscription cancel alert:", err)
    }
  }

  return NextResponse.json({ ok: true })
}
