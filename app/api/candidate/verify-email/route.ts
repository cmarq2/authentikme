import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Token missing" }, { status: 400 })
  }

  const user = await prisma.user.findFirst({
    where: { emailToken: token },
  })

  if (!user) {
    return NextResponse.json({ error: "Invalid or expired verification link" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, emailToken: null },
  })

  return NextResponse.json({ message: "Email verified successfully" })
}
