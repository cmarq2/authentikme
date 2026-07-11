import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function sendContactFormEmail(data: { name: string; email: string; message: string }) {
  const name = escapeHtml(data.name)
  const email = escapeHtml(data.email)
  const message = escapeHtml(data.message)
  await transporter.sendMail({
    from: `"AuthentikMe Contact Form" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    replyTo: data.email,
    subject: `New contact form message from ${data.name}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
        <div style="background:#1e3a8a;padding:16px 24px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">AuthentikMe</h1>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 8px 8px;">
          <h2 style="color:#111827;margin-top:0;">New contact form submission</h2>
          <p style="color:#4b5563;margin:0 0 4px;"><strong>Name:</strong> ${name}</p>
          <p style="color:#4b5563;margin:0 0 16px;"><strong>Email:</strong> ${email}</p>
          <p style="color:#4b5563;white-space:pre-wrap;border-top:1px solid #e5e7eb;padding-top:16px;">${message}</p>
        </div>
      </div>
    `,
  })
}

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/candidate/verify-email?token=${token}`
  await transporter.sendMail({
    from: `"AuthentikMe" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verify your email – AuthentikMe",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
        <div style="background:#1e3a8a;padding:16px 24px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">AuthentikMe</h1>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 8px 8px;">
          <h2 style="color:#111827;margin-top:0;">Verify your email address</h2>
          <p style="color:#4b5563;">Click the button below to verify your email and continue setting up your AuthentikMe identity verification.</p>
          <a href="${verifyUrl}" style="display:inline-block;background:#2563eb;color:white;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0;">Verify Email Address</a>
          <p style="color:#9ca3af;font-size:13px;margin-top:24px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  })
}
