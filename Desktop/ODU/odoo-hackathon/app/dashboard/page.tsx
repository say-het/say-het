"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExpenseView } from "@/components/expense-view"
import { ApprovalQueue } from "@/components/approval-queue"
import { AdminUsers } from "@/components/admin-users"
import { AdminRules } from "@/components/admin-rules"
import type { Role } from "@/lib/types"

const roles: Role[] = ["EMPLOYEE", "MANAGER", "ADMIN"]

export default function DashboardPage() {
  // Pretend logged-in user is Ramesh (employee) by default for demo
  const [role, setRole] = useState<Role>("EMPLOYEE")
  const [userId, setUserId] = useState<string>("3") // Ramesh

  return (
    <main className="min-h-dvh">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Expensely</span>
            <span className="text-muted-foreground text-sm">Demo</span>
          </div>
          <div className="flex items-center gap-2">
            {roles.map((r) => (
              <Button
                key={r}
                size="sm"
                variant={role === r ? "default" : "secondary"}
                onClick={() => {
                  setRole(r)
                  if (r === "EMPLOYEE") setUserId("3")
                  if (r === "MANAGER") setUserId("2")
                  if (r === "ADMIN") setUserId("1")
                }}
              >
                {r}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6 grid gap-6">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            This dashboard switches views to simulate each role. Use the buttons above to toggle Employee, Manager, or
            Admin.
          </p>
        </Card>

        {role === "EMPLOYEE" && <ExpenseView userId={userId} />}
        {role === "MANAGER" && <ApprovalQueue managerId={userId} />}
        {role === "ADMIN" && (
          <div className="grid gap-6 md:grid-cols-2">
            <AdminUsers />
            <AdminRules />
          </div>
        )}
      </section>
    </main>
  )
}
