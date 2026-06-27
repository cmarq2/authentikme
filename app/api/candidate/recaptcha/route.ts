import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

  await prisma.user.update({
    where: { id: session.user.id },
    data: { recaptchaDone: true },
  })

  return NextResponse.json({ message: "reCAPTCHA verified" })
}
