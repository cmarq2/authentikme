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

export async function sendContactFormEmail(data: {
  name: string
  email: string
  message: string
  company?: string
  topic?: string
}) {
  const name = escapeHtml(data.name)
  const email = escapeHtml(data.email)
  const message = escapeHtml(data.message)
  const company = data.company ? escapeHtml(data.company) : ""
  const topic = data.topic ? escapeHtml(data.topic) : ""
  await transporter.sendMail({
    from: `"AuthentikMe Contact Form" <${process.env.SMTP_USER}>`,
    // CONTACT_EMAIL lets contact messages go to a personal inbox instead of the sending mailbox.
    to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
    replyTo: data.email,
    subject: `${data.topic ? `[${data.topic}] ` : ""}New contact form message from ${data.name}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
        <div style="background:#1e3a8a;padding:16px 24px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">AuthentikMe</h1>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 8px 8px;">
          <h2 style="color:#111827;margin-top:0;">New contact form submission</h2>
          <p style="color:#4b5563;margin:0 0 4px;"><strong>Name:</strong> ${name}</p>
          <p style="color:#4b5563;margin:0 0 4px;"><strong>Email:</strong> ${email}</p>
          ${company ? `<p style="color:#4b5563;margin:0 0 4px;"><strong>Company:</strong> ${company}</p>` : ""}
          ${topic ? `<p style="color:#4b5563;margin:0 0 4px;"><strong>Reaching out as:</strong> ${topic}</p>` : ""}
          <div style="height:12px;"></div>
          <p style="color:#4b5563;white-space:pre-wrap;border-top:1px solid #e5e7eb;padding-top:16px;">${message}</p>
        </div>
      </div>
    `,
  })
}

// Where employer approval requests are sent. Defaults to the mailbox the app already
// sends from (noreply@authentikme.com) unless ADMIN_EMAIL overrides it.
function adminEmail() {
  return process.env.ADMIN_EMAIL || process.env.SMTP_USER
}

export async function sendEmployerApprovalRequestEmail(data: {
  name: string
  company: string
  email: string
  signupIp: string | null
  token: string
}) {
  const reviewUrl = `${process.env.NEXTAUTH_URL}/admin/employer-approval?token=${data.token}`
  const name = escapeHtml(data.name)
  const company = escapeHtml(data.company)
  const email = escapeHtml(data.email)
  const ip = escapeHtml(data.signupIp ?? "unknown")

  await transporter.sendMail({
    from: `"AuthentikMe" <${process.env.SMTP_USER}>`,
    to: adminEmail(),
    replyTo: data.email,
    subject: `Employer approval needed: ${data.company}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
        <div style="background:#1e3a8a;padding:16px 24px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">AuthentikMe</h1>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 8px 8px;">
          <h2 style="color:#111827;margin-top:0;">New employer account awaiting approval</h2>
          <p style="color:#4b5563;margin:0 0 4px;"><strong>Company:</strong> ${company}</p>
          <p style="color:#4b5563;margin:0 0 4px;"><strong>Contact:</strong> ${name}</p>
          <p style="color:#4b5563;margin:0 0 4px;"><strong>Email:</strong> ${email}</p>
          <p style="color:#4b5563;margin:0 0 16px;"><strong>Signup IP:</strong> ${ip}</p>
          <p style="color:#4b5563;">They cannot sign in until you approve them. Open the review page to approve or reject:</p>
          <a href="${reviewUrl}" style="display:inline-block;background:#2563eb;color:white;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0;">Review This Employer</a>
          <p style="color:#9ca3af;font-size:13px;margin-top:24px;">This link is private — anyone with it can approve or reject this one account.</p>
        </div>
      </div>
    `,
  })
}

export async function sendEmployerApprovedEmail(to: string, company: string) {
  await transporter.sendMail({
    from: `"AuthentikMe" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your employer account is approved – AuthentikMe",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
        <div style="background:#1e3a8a;padding:16px 24px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">AuthentikMe</h1>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 8px 8px;">
          <h2 style="color:#111827;margin-top:0;">You're approved</h2>
          <p style="color:#4b5563;">The employer account for <strong>${escapeHtml(company)}</strong> has been approved. You can now sign in and start verifying candidate codes.</p>
          <a href="${process.env.NEXTAUTH_URL}/login" style="display:inline-block;background:#2563eb;color:white;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0;">Sign In</a>
        </div>
      </div>
    `,
  })
}

export async function sendEmployerRejectedEmail(to: string, company: string) {
  await transporter.sendMail({
    from: `"AuthentikMe" <${process.env.SMTP_USER}>`,
    to,
    subject: "Update on your AuthentikMe employer application",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
        <div style="background:#1e3a8a;padding:16px 24px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">AuthentikMe</h1>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 8px 8px;">
          <h2 style="color:#111827;margin-top:0;">We couldn't approve this account</h2>
          <p style="color:#4b5563;">Thanks for your interest in AuthentikMe. We weren't able to approve the employer account for <strong>${escapeHtml(company)}</strong> at this time.</p>
          <p style="color:#4b5563;">If you believe this was a mistake, reply to this email and we'll take another look.</p>
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

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
  await transporter.sendMail({
    from: `"AuthentikMe" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset your password – AuthentikMe",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
        <div style="background:#1e3a8a;padding:16px 24px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">AuthentikMe</h1>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 8px 8px;">
          <h2 style="color:#111827;margin-top:0;">Reset your password</h2>
          <p style="color:#4b5563;">Click the button below to choose a new password for your AuthentikMe account.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:white;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0;">Reset Password</a>
          <p style="color:#9ca3af;font-size:13px;margin-top:24px;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  })
}
