"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function AdminRules() {
  const { data, mutate } = useSWR(`/api/rules`, fetcher)

  async function save() {
    await fetch("/api/rules", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    })
    mutate()
  }

  return (
    <Card className="p-4 grid gap-4">
      <div>
        <h3 className="font-semibold">Approval rules</h3>
        <p className="text-sm text-muted-foreground">Define percentage required and multi-step approvers.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="grid gap-1">
          <Label>Rule name</Label>
          <Input value={data?.name ?? ""} onChange={(e) => mutate({ ...data, name: e.target.value }, false)} />
        </div>
        <div className="grid gap-1">
          <Label>Minimum approval percentage</Label>
          <Input
            type="number"
            value={data?.minPercentToApprove ?? 50}
            onChange={(e) => mutate({ ...data, minPercentToApprove: Number(e.target.value) }, false)}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Steps</Label>
        <div className="grid gap-2">
          {data?.steps?.map((s: any, i: number) => (
            <div key={i} className="grid md:grid-cols-3 gap-2">
              <Input
                value={s.step}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  const steps = [...data.steps]
                  steps[i] = { ...steps[i], step: v }
                  mutate({ ...data, steps }, false)
                }}
              />
              <select
                className="border rounded-md px-2 py-2 bg-background"
                value={s.approverRole}
                onChange={(e) => {
                  const steps = [...data.steps]
                  steps[i] = { ...steps[i], approverRole: e.target.value as any }
                  mutate({ ...data, steps }, false)
                }}
              >
                <option value="MANAGER">MANAGER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
              </select>
              <Button
                variant="destructive"
                onClick={() => {
                  const steps = data.steps.filter((_: any, idx: number) => idx !== i)
                  mutate({ ...data, steps }, false)
                }}
              >
                Remove
              </Button>
            </div>
          ))}
          <div>
            <Button
              variant="secondary"
              onClick={() =>
                mutate(
                  {
                    ...data,
                    steps: [...(data?.steps ?? []), { step: (data?.steps?.length ?? 0) + 1, approverRole: "MANAGER" }],
                  },
                  false,
                )
              }
            >
              Add step
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={save}>Save rules</Button>
      </div>
    </Card>
  )
}
