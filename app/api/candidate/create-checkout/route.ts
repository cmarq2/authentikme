import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"

function nextSixteenthTimestamp(): number {
  const now = new Date()
  const anchor = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 16))
  if (anchor.getTime() <= now.getTime()) {
    anchor.setUTCMonth(anchor.getUTCMonth() + 1)
  }
  return Math.floor(anchor.getTime() / 1000)
}

export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Payment not configured yet." }, { status: 503 })
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-06-24.dahlia" })
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Number(process.env.VERIFICATION_FEE_CENTS) || 499,
          recurring: { interval: "month" },
          product_data: {
            name: "AuthentikMe Identity Verification",
            description: "Monthly subscription to maintain your verified ATK identity badge",
          },
        },
        quantity: 1,
      },
    ],
    subscription_data: {
      billing_cycle_anchor: nextSixteenthTimestamp(),
    },
    metadata: { userId: session.user.id },
    success_url: `${process.env.NEXTAUTH_URL}/candidate/dashboard?payment=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/candidate/dashboard?payment=cancelled`,
  })

  return NextResponse.json({ url: checkoutSession.url })
}
