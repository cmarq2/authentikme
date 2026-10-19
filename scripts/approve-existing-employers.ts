/**
 * One-off migration helper.
 *
 * Employer approval was added after launch, and the new column defaults every row to
 * PENDING — which would lock out employers who already had working accounts. Run this
 * once, right after `npm run db:push`, to grandfather in every employer that existed
 * before the gate went live. New signups are unaffected: they are created PENDING
 * explicitly by /api/employer/register.
 *
 *   npx tsx scripts/approve-existing-employers.ts
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const pending = await prisma.user.findMany({
    where: { role: "EMPLOYER", employerApprovalStatus: "PENDING" },
    select: { id: true, email: true, company: true, createdAt: true },
  })

  if (pending.length === 0) {
    console.log("No pending employer accounts — nothing to do.")
    return
  }

  console.log(`Grandfathering ${pending.length} pre-existing employer account(s):`)
  for (const employer of pending) {
    console.log(`  • ${employer.email} (${employer.company ?? "no company"}) — created ${employer.createdAt.toISOString()}`)
  }

  const result = await prisma.user.updateMany({
    where: { role: "EMPLOYER", employerApprovalStatus: "PENDING" },
    data: { employerApprovalStatus: "APPROVED", employerApprovalDecidedAt: new Date() },
  })

  console.log(`✓ Approved ${result.count} employer account(s).`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
