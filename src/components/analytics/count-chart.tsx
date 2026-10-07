"use client"

import { humanizeToken } from "@/lib/utils"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type CountChartProps = {
  title: string
  data: Array<{ label: string; count: number }>
}

export function CountChart({ title, data }: CountChartProps) {
  const rows = data.map((item) => ({
    name: humanizeToken(item.label),
    count: item.count,
  }))

  return (
    <section className="bg-card ring-foreground/10 rounded-2xl p-5 ring-1">
      <h2 className="font-heading text-2xl">{title}</h2>
      <div className="mt-4 h-64">
        {rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">No chart data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
              <YAxis allowDecimals={false} width={32} />
              <Tooltip />
              <Bar dataKey="count" fill="#0f766e" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  )
}
