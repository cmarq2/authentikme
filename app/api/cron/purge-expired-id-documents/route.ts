import { NextResponse } from "next/server"
import { purgeExpiredIdDocuments } from "@/lib/idDocument"

export async function GET(req: Request) {
  const auth = req.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const purged = await purgeExpiredIdDocuments()
  return NextResponse.json({ purged })
}
