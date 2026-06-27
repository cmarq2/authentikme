import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { verifyTotpToken } from "@/lib/totp"
import crypto from "crypto"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { token } = await req.json()
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.totpSecret) {
    return NextResponse.json({ error: "Set up authenticator first" }, { status: 400 })
  }

  const valid = verifyTotpToken(user.totpSecret, token)
  if (!valid) {
    return NextResponse.json({ error: "Invalid code. Open your authenticator app and try again." }, { status: 400 })
  }

  const verificationCode =
    user.verificationCode ??
    "ATK-" + crypto.randomBytes(4).toString("hex").toUpperCase() +
    "-" + crypto.randomBytes(4).toString("hex").toUpperCase()

  await prisma.user.update({
    where: { id: user.id },
    data: { totpEnabled: true, verificationCode },
  })

  return NextResponse.json({ message: "Authenticator verified", verificationCode })
}
