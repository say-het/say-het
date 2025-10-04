import clientPromise from "./mongo"
import type { Approval, ApprovalRules, Expense, User } from "./types"
import { ObjectId } from "mongodb"

const DB_NAME = process.env.MONGODB_DB || "odoo-hackathon"

async function getCollections() {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  return {
    users: db.collection<User>("users"),
    expenses: db.collection<Expense>("expenses"),
    approvals: db.collection<Approval>("approvals"),
    rules: db.collection<ApprovalRules>("rules"),
  }
}

export async function getUsers(): Promise<User[]> {
  const { users } = await getCollections()
  return users.find().toArray()
}

export async function createUser(u: Omit<User, "id">): Promise<User> {
  const { users } = await getCollections()
  const res = await users.insertOne({ ...u } as any)
  return { ...u, id: res.insertedId.toString() }
}

export async function getRules(): Promise<ApprovalRules | null> {
  const { rules } = await getCollections()
  const r = await rules.findOne({})
  return r ?? null
}

export async function updateRules(patch: Partial<ApprovalRules>): Promise<ApprovalRules> {
  const { rules } = await getCollections()
  const existing = await rules.findOne({})
  if (!existing) {
    const toInsert: ApprovalRules = { id: "1", name: patch.name ?? "Default", minPercentToApprove: patch.minPercentToApprove ?? 50, steps: patch.steps ?? [] }
    await rules.insertOne(toInsert as any)
    return toInsert
  }
  const updated = { ...existing, ...patch }
  await rules.updateOne({ _id: (existing as any)._id }, { $set: updated })
  return updated
}

export async function createExpense(e: Omit<Expense, "id" | "status"> & { status?: Expense["status"] }): Promise<Expense> {
  const { expenses } = await getCollections()
  const doc = { ...e, status: e.status ?? "DRAFT" }
  const res = await expenses.insertOne(doc as any)
  return { ...doc, id: res.insertedId.toString() }
}

export async function updateExpense(id: string, patch: Partial<Expense>): Promise<Expense | undefined> {
  const { expenses } = await getCollections()
  const objId = ObjectId.isValid(id) ? new ObjectId(id) : undefined
  const query: any = objId ? { _id: objId } : { id }
  const existing = await expenses.findOne(query as any)
  if (!existing) return undefined
  const updated = { ...existing, ...patch }
  await expenses.updateOne(query as any, { $set: updated })
  // ensure returned shape uses string id
  return { ...updated, id: existing.id ?? existing._id?.toString() }
}

export async function listExpensesFor(role: string, userId?: string) {
  const { expenses, users } = await getCollections()
  if (role === "EMPLOYEE" && userId) return expenses.find({ ownerId: userId }).toArray()
  if (role === "MANAGER") {
    const team = await users.find({ managerId: userId }).toArray()
  const teamIds = team.map((t: User) => t.id)
    return expenses.find({ ownerId: { $in: teamIds }, status: "WAITING_APPROVAL" }).toArray()
  }
  if (role === "ADMIN") return expenses.find().toArray()
  return expenses.find().toArray()
}

export async function addApproval(a: Omit<Approval, "id" | "decidedAt">): Promise<Approval> {
  const { approvals } = await getCollections()
  const rec = { ...a, decidedAt: new Date().toISOString() }
  const res = await approvals.insertOne(rec as any)
  return { ...rec, id: res.insertedId.toString() }
}

export async function getAllUsersForRoute(): Promise<User[]> {
  return getUsers()
}

export default {
  getUsers,
  createUser,
  getRules,
  updateRules,
  createExpense,
  updateExpense,
  listExpensesFor,
  addApproval,
}
