"use client"
import { useState } from "react"

export default function ApprovalActions({
  token,
  currentStatus,
}: {
  token: string
  currentStatus: string
}) {
  const [status, setStatus] = useState(currentStatus)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState<"approve" | "reject" | null>(null)

  async function decide(decision: "approve" | "reject") {
    setError("")
    setMessage("")
    setPending(decision)
    try {
      const res = await fetch("/api/admin/employer-approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, decision }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.")
        return
      }
      setStatus(data.status)
      setMessage(data.message)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-lg">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => decide("approve")}
          disabled={pending !== null || status === "APPROVED"}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {pending === "approve" ? "Approving…" : status === "APPROVED" ? "Approved" : "Approve"}
        </button>
        <button
          type="button"
          onClick={() => decide("reject")}
          disabled={pending !== null || status === "REJECTED"}
          className="flex-1 border border-red-300 text-red-700 hover:bg-red-50 font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {pending === "reject" ? "Rejecting…" : status === "REJECTED" ? "Rejected" : "Reject"}
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        You can revisit this link later to change the decision.
      </p>
    </div>
  )
}
