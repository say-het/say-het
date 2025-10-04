import { NextResponse } from "next/server"
import { createUser, getUsers } from "@/lib/db"

export async function GET() {
  const list = await getUsers()
  return NextResponse.json(list)
}

export async function POST(req: Request) {
  const body = await req.json()
  const user = await createUser({ name: body.name, email: body.email, role: body.role })
  return NextResponse.json(user, { status: 201 })
}
