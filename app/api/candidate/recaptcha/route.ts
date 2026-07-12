import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { allStepsDone, generateVerificationCode } from "@/lib/verification"
import { purgeIdDocumentIfVerified } from "@/lib/idDocument"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { recaptchaToken } = await req.json()
  if (!recaptchaToken) {
    return NextResponse.json({ error: "reCAPTCHA token required" }, { status: 400 })
  }

  const verifyRes = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    { method: "POST" }
  )
  const data = await verifyRes.json()

  if (!data.success) {
    return NextResponse.json({ error: "reCAPTCHA verification failed. Please try again." }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 })

  const done = allStepsDone({ ...user, recaptchaDone: true })
  const verificationCode = user.verificationCode ?? (done ? generateVerificationCode() : null)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { recaptchaDone: true, ...(verificationCode ? { verificationCode } : {}) },
  })

  await purgeIdDocumentIfVerified(session.user.id)

  return NextResponse.json({ message: "reCAPTCHA verified" })
}
