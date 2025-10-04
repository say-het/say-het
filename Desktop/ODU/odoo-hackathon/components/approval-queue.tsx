"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Expense } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ApprovalQueue({ managerId }: { managerId: string }) {
  const { data, mutate, isLoading } = useSWR<Expense[]>(`/api/expenses?role=MANAGER&userId=${managerId}`, fetcher)

  async function decide(expenseId: string, decision: "APPROVED" | "REJECTED") {
    await fetch("/api/approvals", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ expenseId, decision }),
    })
    mutate()
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Approvals to review</h2>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3">Owner</th>
              <th className="text-left p-3">Category</th>
              <th className="text-right p-3">Amount</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="p-3" colSpan={5}>
                  Loading...
                </td>
              </tr>
            )}
            {data?.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-3">{e.ownerId}</td>
                <td className="p-3">{e.category}</td>
                <td className="p-3 text-right">
                  {e.amount.toFixed(2)} {e.currency}
                </td>
                <td className="p-3">{e.status.replace("_", " ")}</td>
                <td className="p-3 text-right">
                  <Button size="sm" className="mr-2" onClick={() => decide(e.id, "APPROVED")}>
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => decide(e.id, "REJECTED")}>
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
            {!isLoading && data?.length === 0 && (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={5}>
                  No items.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
