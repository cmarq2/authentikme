import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const SECRET = "authentikme-seed-2026"

export async function POST(req: Request) {
  const { secret } = await req.json()
  if (secret !== SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const email = "testcandidate@demo.authentikme.com"
  const verificationCode = "ATK-TEST1234-DEMO5678"

  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        stripePaid: true,
        recaptchaDone: true,
        totpEnabled: true,
        verificationCode,
      },
    })
  } else {
    const hashed = await bcrypt.hash("TestCandidate123!", 12)
    await prisma.user.create({
      data: {
        name: "Alex Johnson",
        email,
        password: hashed,
        role: "CANDIDATE",
        emailVerified: true,
        stripePaid: true,
        recaptchaDone: true,
        totpEnabled: true,
        verificationCode,
      },
    })
  }

  return NextResponse.json({ ok: true, verificationCode, email })
}
