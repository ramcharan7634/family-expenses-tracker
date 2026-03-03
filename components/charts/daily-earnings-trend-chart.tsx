'use client'

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts'

interface DailyEarningsTrendChartProps {
  data: Array<{
    date: string
    jaganEarnings: number
    sunithaEarnings: number
    saiEarnings: number
  }>
}

export function DailyEarningsTrendChart({ data }: DailyEarningsTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="date" 
          className="text-xs fill-muted-foreground"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            const date = new Date(value)
            return `${date.getMonth() + 1}/${date.getDate()}`
          }}
          fontSize={10}
        />
        <YAxis 
          className="text-xs fill-muted-foreground"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
          fontSize={10}
          width={40}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: number) => [`₹${value}`, '']}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Line 
          type="monotone" 
          dataKey="jaganEarnings" 
          stroke="hsl(var(--chart-1))" 
          strokeWidth={2}
          dot={false}
          name="Jagan"
        />
        <Line 
          type="monotone" 
          dataKey="sunithaEarnings" 
          stroke="hsl(var(--chart-2))" 
          strokeWidth={2}
          dot={false}
          name="Sunitha"
        />
        <Line 
          type="monotone" 
          dataKey="saiEarnings" 
          stroke="hsl(var(--chart-3))" 
          strokeWidth={2}
          dot={false}
          name="Sai Charan"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
