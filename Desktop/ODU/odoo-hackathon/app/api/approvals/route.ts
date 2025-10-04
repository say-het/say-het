import { NextResponse } from "next/server"
import { addApproval, updateExpense } from "@/lib/db"

export async function POST(req: Request) {
  const body = await req.json()
  const decision = body.decision as "APPROVED" | "REJECTED"
  // Record an approval and update expense status
  await addApproval({ expenseId: body.expenseId, approverId: "manager-demo" })
  const status = decision === "APPROVED" ? "APPROVED" : "REJECTED"
  const updated = await updateExpense(body.expenseId, { status })
  return NextResponse.json(updated)
}
