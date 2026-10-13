import { NextResponse } from "next/server"
import { sendContactFormEmail } from "@/lib/email"

const TOPICS = ["Candidate", "Employer", "Partnership", "Press", "Other"]

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "")
  const name = str(body.name)
  const email = str(body.email)
  const message = str(body.message)
  const company = str(body.company)
  const topic = TOPICS.includes(str(body.topic)) ? str(body.topic) : ""

  // Honeypot: real visitors never fill this hidden field. Pretend success so bots move on.
  if (str(body.website)) {
    return NextResponse.json({ message: "Message sent." })
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
  }
  if (name.length > 120 || email.length > 200 || company.length > 160 || message.length > 5000) {
    return NextResponse.json({ error: "One of the fields is too long" }, { status: 400 })
  }

  try {
    await sendContactFormEmail({ name, email, message, company, topic })
  } catch (err) {
    console.error("contact: sendContactFormEmail failed", err)
    return NextResponse.json({ error: "Failed to send message. Please try again later." }, { status: 502 })
  }

  return NextResponse.json({ message: "Message sent." })
}
