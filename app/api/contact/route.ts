import { NextResponse } from "next/server"
import { sendContactFormEmail } from "@/lib/email"

export async function POST(req: Request) {
  const { name, email, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
  }

  try {
    await sendContactFormEmail({ name, email, message })
  } catch (err) {
    console.error("contact: sendContactFormEmail failed", err)
    return NextResponse.json({ error: "Failed to send message. Please try again later." }, { status: 502 })
  }

  return NextResponse.json({ message: "Message sent." })
}
