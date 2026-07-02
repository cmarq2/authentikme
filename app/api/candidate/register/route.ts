import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const emailToken = crypto.randomBytes(32).toString("hex")

  await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "CANDIDATE",
      emailToken,
    },
  })

  try {
    await sendVerificationEmail(email.toLowerCase(), emailToken)
  } catch (err) {
    console.error("register: sendVerificationEmail failed", err)
  }

  return NextResponse.json({ message: "Account created. Check your email to verify." })
}
