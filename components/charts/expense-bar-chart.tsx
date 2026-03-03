'use client'

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts'

interface ExpenseBarChartProps {
  data: Array<{
    month: string
    expenses: number
  }>
}

export function ExpenseBarChart({ data }: ExpenseBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="month" 
          className="text-xs fill-muted-foreground"
          tickLine={false}
          axisLine={false}
          fontSize={10}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          className="text-xs fill-muted-foreground"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          fontSize={10}
          width={45}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Expenses']}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar 
          dataKey="expenses" 
          fill="hsl(var(--chart-4))" 
          radius={[4, 4, 0, 0]}
          name="Expenses"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
