import { getUsers } from "./db"

export async function getUserFromRequest(req: Request) {
  try {
    // Next.js provides cookies on the Request via headers
    const cookie = req.headers.get("cookie") || ""
  const match = cookie.match(/session_userId=([^;]+)/)
  const id = match?.[1]
    if (!id) return null
    const users = await getUsers()
    return users.find((u) => u.id === id) ?? null
  } catch (e) {
    return null
  }
}
