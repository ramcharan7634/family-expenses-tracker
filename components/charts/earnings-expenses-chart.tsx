'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface EarningsExpensesChartProps {
  data: {
    month: string
    earnings: number
    expenses: number
    jaganEarnings?: number
    sunithaEarnings?: number
    saiEarnings?: number
  }[]
}

export function EarningsExpensesChart({ data }: EarningsExpensesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="month" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="jaganEarnings"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2 }}
          name="Jagan"
        />
        <Line
          type="monotone"
          dataKey="sunithaEarnings"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2 }}
          name="Sunitha"
        />
        <Line
          type="monotone"
          dataKey="saiEarnings"
          stroke="hsl(var(--chart-3))"
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2 }}
          name="Sai Charan"
        />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="hsl(var(--chart-4))"
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--chart-4))', strokeWidth: 2 }}
          name="Expenses"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
