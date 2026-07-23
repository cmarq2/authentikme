import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/lib/email"
import { getClientIp } from "@/lib/ip"
import crypto from "crypto"

export async function POST(req: Request) {
  const { name, email, password, agreedToTerms } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
  }
  if (!agreedToTerms) {
    return NextResponse.json({ error: "You must agree to the Terms of Service to create an account" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const emailToken = crypto.randomBytes(32).toString("hex")
  const ip = getClientIp(req.headers)
  const now = new Date()

  await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "CANDIDATE",
      emailToken,
      signupIp: ip,
      termsAcceptedAt: now,
      termsAcceptedIp: ip,
    },
  })

  try {
    await sendVerificationEmail(email.toLowerCase(), emailToken)
  } catch (err) {
    console.error("register: sendVerificationEmail failed", err)
  }

  return NextResponse.json({ message: "Account created. Check your email to verify." })
}
