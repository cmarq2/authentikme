import { del } from "@vercel/blob"
import { prisma } from "@/lib/prisma"
import { allStepsDone } from "@/lib/verification"

async function deleteIdDocument(userId: string, url: string) {
  try {
    await del(url)
  } catch (err) {
    console.error("Failed to delete ID document blob", err)
  }
  await prisma.user.update({
    where: { id: userId },
    data: { idDocumentUrl: null, idUploadedAt: null },
  })
}

// Once every verification step is complete, the government ID has served its
// purpose and is deleted immediately rather than left in storage.
export async function purgeIdDocumentIfVerified(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user?.idDocumentUrl) return
  if (!allStepsDone(user)) return
  await deleteIdDocument(userId, user.idDocumentUrl)
}

// Hard cap: even if verification is never completed, no ID document is
// retained for more than 24 hours.
export async function purgeExpiredIdDocuments() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const expired = await prisma.user.findMany({
    where: { idDocumentUrl: { not: null }, idUploadedAt: { lt: cutoff } },
    select: { id: true, idDocumentUrl: true },
  })

  for (const user of expired) {
    await deleteIdDocument(user.id, user.idDocumentUrl!)
  }

  return expired.length
}
