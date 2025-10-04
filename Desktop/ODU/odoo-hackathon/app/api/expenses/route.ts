import { NextResponse } from "next/server"
import { createExpense, listExpensesFor, updateExpense } from "@/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const role = searchParams.get("role") || "EMPLOYEE"
  const userId = searchParams.get("userId") || undefined
  const list = await listExpensesFor(role, userId)
  return NextResponse.json(list)
}

export async function POST(req: Request) {
  const body = await req.json()
  const expense = await createExpense({
    ownerId: body.ownerId,
    description: body.description,
    category: body.category,
    currency: body.currency,
    amount: body.amount,
    date: body.date,
    notes: body.notes,
  })
  return NextResponse.json(expense, { status: 201 })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const updated = await updateExpense(body.id, { status: body.status })
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(updated)
}
