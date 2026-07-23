import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getStripe, createSubscriptionCheckoutSession } from "@/lib/stripe"

export async function POST() {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: "Payment not configured yet." }, { status: 503 })
  }
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const checkoutSession = await createSubscriptionCheckoutSession(stripe, session.user.id)

  return NextResponse.json({ url: checkoutSession.url })
}
