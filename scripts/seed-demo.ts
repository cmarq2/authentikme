import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("Demo1234!", 12)

  // Candidate — fully verified, has a verification code ready
  await prisma.user.upsert({
    where: { email: "candidate@demo.com" },
    update: {},
    create: {
      email: "candidate@demo.com",
      name: "Demo Candidate",
      password,
      role: "CANDIDATE",
      emailVerified: true,
      recaptchaDone: true,
      totpEnabled: true,
      verificationCode: "ATK-DEMO0001-CAND0001",
    },
  })
  console.log("✓ Demo candidate created — candidate@demo.com / Demo1234!")

  // Employer — ready to log in and verify codes
  await prisma.user.upsert({
    where: { email: "employer@demo.com" },
    update: {},
    create: {
      email: "employer@demo.com",
      name: "Demo Employer",
      company: "Demo Corp",
      password,
      role: "EMPLOYER",
      emailVerified: true,
    },
  })
  console.log("✓ Demo employer created  — employer@demo.com / Demo1234!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
