import { NextResponse } from "next/server"
import { createUser, getUsers } from "@/lib/db"

export async function POST(req: Request) {
  const { email, name } = await req.json()
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

  // Try find user by email
  const users = await getUsers()
  let user = users.find((u) => u.email === email)
  if (!user) {
    user = await createUser({ name: name ?? email.split("@")[0], email, role: "EMPLOYEE" })
  }

  // Set a simple session cookie with user id
  const res = NextResponse.json({ ok: true, user })
  // cookie expires in 7 days
  const maxAge = 60 * 60 * 24 * 7
  res.cookies.set("session_userId", user.id, { httpOnly: true, path: "/", maxAge })
  return res
}
