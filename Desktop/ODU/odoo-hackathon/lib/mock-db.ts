// Simple in-memory mock DB for demo purposes only
import type { Approval, ApprovalRules, Expense, User } from "./types"

let userIdSeq = 3
let expenseIdSeq = 3
let approvalIdSeq = 1

export const users: User[] = [
  { id: "1", name: "Sarah", email: "sarah@example.com", role: "ADMIN" },
  { id: "2", name: "Mark", email: "mark@example.com", role: "MANAGER" },
  { id: "3", name: "Ramesh", email: "ramesh@example.com", role: "EMPLOYEE", managerId: "2" },
]

export const expenses: Expense[] = [
  {
    id: "1",
    ownerId: "3",
    description: "Restaurant",
    category: "Food",
    currency: "USD",
    amount: 42.65,
    date: new Date().toISOString(),
    status: "WAITING_APPROVAL",
    notes: "Team lunch",
  },
  {
    id: "2",
    ownerId: "3",
    description: "Ride",
    category: "Transport",
    currency: "USD",
    amount: 18.1,
    date: new Date().toISOString(),
    status: "DRAFT",
  },
]

export const approvals: Approval[] = []

export const rules: ApprovalRules = {
  id: "1",
  name: "Default Misc Expenses",
  minPercentToApprove: 50,
  steps: [
    { step: 1, approverRole: "MANAGER" },
    { step: 2, approverRole: "ADMIN" },
  ],
}

export function createUser(u: Omit<User, "id">): User {
  const user = { ...u, id: String(++userIdSeq) }
  users.push(user)
  return user
}

export function createExpense(e: Omit<Expense, "id" | "status"> & { status?: Expense["status"] }): Expense {
  const ex: Expense = { ...e, id: String(++expenseIdSeq), status: e.status ?? "DRAFT" }
  expenses.push(ex)
  return ex
}

export function updateExpense(id: string, patch: Partial<Expense>): Expense | undefined {
  const idx = expenses.findIndex((e) => e.id === id)
  if (idx === -1) return undefined
  expenses[idx] = { ...expenses[idx], ...patch }
  return expenses[idx]
}

export function listExpensesFor(role: string, userId?: string) {
  if (role === "EMPLOYEE" && userId) return expenses.filter((e) => e.ownerId === userId)
  if (role === "MANAGER") {
    const teamIds = users.filter((u) => u.managerId === userId).map((u) => u.id)
    return expenses.filter((e) => teamIds.includes(e.ownerId) && e.status === "WAITING_APPROVAL")
  }
  if (role === "ADMIN") return expenses
  return expenses
}

export function addApproval(a: Omit<Approval, "id" | "decidedAt">): Approval {
  const rec: Approval = { ...a, id: String(++approvalIdSeq) }
  approvals.push(rec)
  return rec
}
