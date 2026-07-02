import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, emailVerified: true },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (user.emailVerified) {
    return NextResponse.json({ error: "Email already verified" }, { status: 400 })
  }

  const emailToken = crypto.randomBytes(32).toString("hex")
  await prisma.user.update({
    where: { id: session.user.id },
    data: { emailToken },
  })

  try {
    await sendVerificationEmail(user.email, emailToken)
  } catch (err) {
    console.error("resend-verification: sendVerificationEmail failed", err)
    return NextResponse.json({ error: "Failed to send verification email. Please try again later." }, { status: 502 })
  }

  return NextResponse.json({ message: "Verification email sent." })
}
