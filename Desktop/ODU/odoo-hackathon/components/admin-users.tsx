"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User } from "@/lib/types"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function AdminUsers() {
  const { data, mutate } = useSWR<User[]>("/api/users", fetcher)
  const [form, setForm] = useState({ name: "", email: "", role: "EMPLOYEE" as User["role"] })

  async function addUser() {
    await fetch("/api/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    })
    setForm({ name: "", email: "", role: "EMPLOYEE" })
    mutate()
  }

  return (
    <Card className="p-4 grid gap-4">
      <div>
        <h3 className="font-semibold">Members</h3>
        <p className="text-sm text-muted-foreground">Invite members and assign roles.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="grid gap-1">
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="grid gap-1">
          <Label>Email</Label>
          <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="grid gap-1">
          <Label>Role</Label>
          <select
            className="border rounded-md px-2 py-2 bg-background"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as User["role"] })}
          >
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="MANAGER">MANAGER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={addUser}>Add member</Button>
      </div>
    </Card>
  )
}
