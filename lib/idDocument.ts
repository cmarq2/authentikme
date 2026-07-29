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

async function deleteBackIdDocument(userId: string, url: string) {
  try {
    await del(url)
  } catch (err) {
    console.error("Failed to delete back ID document blob", err)
  }
  await prisma.user.update({
    where: { id: userId },
    data: { idBackDocumentUrl: null, idBackUploadedAt: null },
  })
}

// Once every verification step is complete, the government ID has served its
// purpose and is deleted immediately rather than left in storage.
export async function purgeIdDocumentIfVerified(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return
  if (!allStepsDone(user)) return
  if (user.idDocumentUrl) await deleteIdDocument(userId, user.idDocumentUrl)
  if (user.idBackDocumentUrl) await deleteBackIdDocument(userId, user.idBackDocumentUrl)
}

// Hard cap: even if verification is never completed, no ID document is
// retained for more than 24 hours.
export async function purgeExpiredIdDocuments() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const expiredFront = await prisma.user.findMany({
    where: { idDocumentUrl: { not: null }, idUploadedAt: { lt: cutoff } },
    select: { id: true, idDocumentUrl: true },
  })
  for (const user of expiredFront) {
    await deleteIdDocument(user.id, user.idDocumentUrl!)
  }

  const expiredBack = await prisma.user.findMany({
    where: { idBackDocumentUrl: { not: null }, idBackUploadedAt: { lt: cutoff } },
    select: { id: true, idBackDocumentUrl: true },
  })
  for (const user of expiredBack) {
    await deleteBackIdDocument(user.id, user.idBackDocumentUrl!)
  }

  return expiredFront.length + expiredBack.length
}
