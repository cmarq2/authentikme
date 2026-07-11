import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"
import { allStepsDone, generateVerificationCode } from "@/lib/verification"
import crypto from "crypto"

const MAX_SIZE_BYTES = 4 * 1024 * 1024 // 4MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 })
  }

  const ext = ALLOWED_TYPES[file.type]
  if (!ext) {
    return NextResponse.json({ error: "Please upload a JPG, PNG, or WEBP photo of your ID." }, { status: 400 })
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Photo is too large. Please retake it and try again." }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 })

  const pathname = `id-documents/${session.user.id}/${crypto.randomUUID()}.${ext}`

  let blob
  try {
    blob = await put(pathname, file, { access: "private", contentType: file.type })
  } catch (err) {
    console.error("upload-id: blob upload failed", err)
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 502 })
  }

  const done = allStepsDone({ ...user, idUploaded: true })
  const verificationCode = user.verificationCode ?? (done ? generateVerificationCode() : null)

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      idUploaded: true,
      idDocumentUrl: blob.url,
      ...(verificationCode ? { verificationCode } : {}),
    },
  })

  return NextResponse.json({ message: "ID uploaded." })
}
