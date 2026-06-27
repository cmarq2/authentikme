import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateTotpSecret, getTotpQrCode } from "@/lib/totp"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || user.role !== "CANDIDATE") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (!user.emailVerified) {
    return NextResponse.json({ error: "Verify your email first" }, { status: 400 })
  }
  if (!user.recaptchaDone) {
    return NextResponse.json({ error: "Complete reCAPTCHA first" }, { status: 400 })
  }
  if (user.totpEnabled) {
    return NextResponse.json({ error: "Authenticator already set up" }, { status: 400 })
  }

  const secret = generateTotpSecret(user.email)

  await prisma.user.update({
    where: { id: user.id },
    data: { totpSecret: secret.base32 },
  })

  const qrCode = await getTotpQrCode(secret.otpauth_url!)

  return NextResponse.json({ secret: secret.base32, qrCode })
}
