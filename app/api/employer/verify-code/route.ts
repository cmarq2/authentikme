import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { code } = await req.json()
  if (!code) {
    return NextResponse.json({ error: "Verification code required" }, { status: 400 })
  }

  const candidate = await prisma.user.findFirst({
    where: {
      verificationCode: code.toUpperCase().trim(),
      role: "CANDIDATE",
      emailVerified: true,
      totpEnabled: true,
    },
  })

  if (!candidate) {
    return NextResponse.json({
      verified: false,
      message: "Code not found or candidate has not completed full verification.",
    })
  }

  return NextResponse.json({
    verified: true,
    candidate: {
      name: candidate.name,
      email: candidate.email,
    },
  })
}
