"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PlusCircle, Loader2 } from "lucide-react"
import type { Expense } from "@/lib/types"

const StatusBadge = ({ status }: { status: string }) => {
  const variant = {
    DRAFT: "secondary",
    WAITING_APPROVAL: "outline",
    APPROVED: "default",
    REJECTED: "destructive",
  }[status] as "default" | "secondary" | "destructive" | "outline"

  return (
    <Badge variant={variant}>
      {status.replace("_", " ")}
    </Badge>
  )
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ExpenseView({ userId }: { userId: string }) {
  const { data, mutate, isLoading } = useSWR<Expense[]>(`/api/expenses?role=EMPLOYEE&userId=${userId}`, fetcher)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState<string | null>(null)

  const totalAmount = data?.reduce((sum, exp) => sum + exp.amount, 0) || 0
  const pendingCount = data?.filter(e => e.status === "WAITING_APPROVAL").length || 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-24" /> : `$${totalAmount.toFixed(2)}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All your submitted expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : pendingCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting manager review
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Expenses</CardTitle>
              <CardDescription>
                Manage and track all your expense submissions
              </CardDescription>
            </div>
            <Button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              {showForm ? "Close" : "New Expense"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6">
              <NewExpenseForm
                ownerId={userId}
                onCreated={() => {
                  setShowForm(false)
                  mutate()
                }}
              />
            </div>
          )}

          <div className="rounded-md border">
            <div className="w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-12 px-4 text-right align-middle font-medium">Amount</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Currency</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <>
                      {[1, 2, 3].map((i) => (
                        <tr key={i} className="border-b">
                          <td className="p-4" colSpan={7}>
                            <Skeleton className="h-8 w-full" />
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                  {data?.map((e) => (
                    <tr key={e.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">{e.description}</td>
                      <td className="p-4 align-middle">{e.category}</td>
                      <td className="p-4 align-middle">{new Date(e.date).toLocaleDateString()}</td>
                      <td className="p-4 align-middle text-right font-medium">{e.amount.toFixed(2)}</td>
                      <td className="p-4 align-middle">{e.currency}</td>
                      <td className="p-4 align-middle">
                        <StatusBadge status={e.status} />
                      </td>
                      <td className="p-4 align-middle text-right">
                        {e.status === "DRAFT" && (
                          <Button
                            size="sm"
                            disabled={submitting === e.id}
                            onClick={async () => {
                              setSubmitting(e.id)
                              await fetch(`/api/expenses`, {
                                method: "PATCH",
                                headers: { "content-type": "application/json" },
                                body: JSON.stringify({ id: e.id, status: "WAITING_APPROVAL" }),
                              })
                              await mutate()
                              setSubmitting(null)
                            }}
                          >
                            {submitting === e.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!isLoading && data?.length === 0 && (
                    <tr>
                      <td className="p-4 text-center text-muted-foreground" colSpan={7}>
                        No expenses yet. Click "New Expense" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function NewExpenseForm({ ownerId, onCreated }: { ownerId: string; onCreated: () => void }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    description: "",
    category: "Food",
    currency: "USD",
    amount: "0",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  })

  async function submit() {
    if (!form.description) return
    if (parseFloat(form.amount) <= 0) return

    try {
      setLoading(true)
      await fetch("/api/expenses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ownerId,
          description: form.description,
          category: form.category,
          currency: form.currency,
          amount: Number.parseFloat(form.amount || "0"),
          date: form.date,
          notes: form.notes,
        }),
      })
      onCreated()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle>New Expense</CardTitle>
        <CardDescription>
          Fill in the details of your expense below
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g., Business lunch with client"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Supplies">Supplies</SelectItem>
                <SelectItem value="Lodging">Lodging</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              inputMode="decimal"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="INR">INR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any additional details (optional)"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onCreated}>
            Cancel
          </Button>
          <Button 
            onClick={submit} 
            disabled={loading || !form.description || parseFloat(form.amount) <= 0}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Draft
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
