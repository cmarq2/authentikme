import Stripe from "stripe"

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-06-24.dahlia" })
}

function nextSixteenthTimestamp(): number {
  const now = new Date()
  const anchor = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 16))
  if (anchor.getTime() <= now.getTime()) {
    anchor.setUTCMonth(anchor.getUTCMonth() + 1)
  }
  return Math.floor(anchor.getTime() / 1000)
}

export async function createSubscriptionCheckoutSession(
  stripe: Stripe,
  userId: string,
  promotionCodeId?: string
) {
  return stripe.checkout.sessions.create({
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
      {
        price_data: {
          currency: "usd",
          unit_amount: Number(process.env.FIRST_PAYMENT_FEE_CENTS) || 199,
          product_data: {
            name: "First Payment",
            description: "Initial verification fee for your first, partial billing period",
          },
        },
        quantity: 1,
      },
    ],
    subscription_data: {
      billing_cycle_anchor: nextSixteenthTimestamp(),
      proration_behavior: "none",
    },
    ...(promotionCodeId
      ? { discounts: [{ promotion_code: promotionCodeId }] }
      : { allow_promotion_codes: true }),
    metadata: { userId },
    success_url: `${process.env.NEXTAUTH_URL}/candidate/dashboard?payment=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/candidate/dashboard?payment=cancelled`,
  })
}
