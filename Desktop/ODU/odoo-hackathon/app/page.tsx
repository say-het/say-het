import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <span className="font-semibold">Expensely</span>
          <nav className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm underline underline-offset-4">
              Dashboard
            </Link>
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-balance">
            Simple expense management with multi-step approvals
          </h1>
          <p className="text-muted-foreground text-pretty">
            Submit receipts, enforce approval rules, and keep managers and admins in the loop. This demo uses mock data
            with live interactions so you can explore the full workflow.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/dashboard">Open Dashboard</Link>
            </Button>
            <Button variant="secondary" asChild>
              <a href="#workflows">See Workflows</a>
            </Button>
          </div>
        </div>

        <div id="workflows" className="rounded-lg border bg-card">
          <Image
            src="/images/expense-workflows.png"
            alt="Expense management workflows: auth, submission, approval rules, and manager review."
            width={1200}
            height={400}
            className="w-full h-auto rounded-lg"
            priority
          />
        </div>
      </section>
    </main>
  )
}
