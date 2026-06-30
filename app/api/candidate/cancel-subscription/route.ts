import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST() {
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
  if (!isFreeAccount) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-06-24.dahlia" })
    await stripe.subscriptions.cancel(user.stripeSubscriptionId!)
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      stripePaid: false,
      stripeSubscriptionId: null,
      verificationCode: null,
    },
  })

  return NextResponse.json({ ok: true })
}
