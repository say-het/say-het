export type Role = "EMPLOYEE" | "MANAGER" | "ADMIN"
export type ExpenseStatus = "DRAFT" | "WAITING_APPROVAL" | "APPROVED" | "REJECTED"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  managerId?: string | null
}

export interface Expense {
  id: string
  ownerId: string
  description: string
  category: string
  currency: string
  amount: number
  date: string // ISO
  status: ExpenseStatus
  notes?: string
}

export interface Approval {
  id: string
  expenseId: string
  approverId: string
  decision?: "APPROVED" | "REJECTED"
  comment?: string
  decidedAt?: string // ISO
}

export interface ApprovalRules {
  id: string
  name: string
  minPercentToApprove: number // 0-100
  steps: Array<{ step: number; approverRole: Role }>
}
