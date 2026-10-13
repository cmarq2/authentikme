import Stripe from "stripe"

/** One-time candidate verification fee, in cents. */
export const VERIFICATION_FEE_CENTS = 1999

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-06-24.dahlia" })
}

export async function createVerificationCheckoutSession(
  stripe: Stripe,
  userId: string,
  promotionCodeId?: string
) {
  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_creation: "always",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: VERIFICATION_FEE_CENTS,
          product_data: {
            name: "AuthentikMe Identity Verification",
            description: "One-time fee to verify your identity and issue your verified ATK badge",
          },
        },
        quantity: 1,
      },
    ],
    ...(promotionCodeId
      ? { discounts: [{ promotion_code: promotionCodeId }] }
      : { allow_promotion_codes: true }),
    metadata: { userId },
    payment_intent_data: { metadata: { userId } },
    success_url: `${process.env.NEXTAUTH_URL}/candidate/dashboard?payment=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/candidate/dashboard?payment=cancelled`,
  })
}
