import { NextResponse } from "next/server"
import { getRules, updateRules } from "@/lib/db"

export async function GET() {
  const r = await getRules()
  return NextResponse.json(r)
}

export async function POST(req: Request) {
  const body = await req.json()
  const updated = await updateRules({
    name: body.name,
    minPercentToApprove: Number(body.minPercentToApprove ?? undefined),
    steps: body.steps,
  })
  return NextResponse.json(updated)
}
