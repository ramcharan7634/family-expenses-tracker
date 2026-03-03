'use client'

import { useEffect, useState } from 'react'
import { IndianRupee, TrendingUp, TrendingDown, PiggyBank, Loader2, Calendar } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { EarningsExpensesChart } from '@/components/charts/earnings-expenses-chart'
import { ContributionPieChart } from '@/components/charts/contribution-pie-chart'
import { ExpenseBarChart } from '@/components/charts/expense-bar-chart'
import { DailyTrendChart } from '@/components/charts/daily-trend-chart'
import { DailyEarningsTrendChart } from '@/components/charts/daily-earnings-trend-chart'
import { formatCurrency, formatPercentage } from '@/lib/utils'

interface StatsData {
  totalEarnings: number
  totalExpenses: number
  netSavings: number
  savingsPercentage: number
  individualEarnings: { jagan: number; sunitha: number; sai: number }
  monthlyData: Array<{ month: string; earnings: number; expenses: number; jaganEarnings: number; sunithaEarnings: number; saiEarnings: number }>
  dailyData: Array<{ date: string; dailyExpenses: number }>
  dailyEarningsData: Array<{ date: string; jaganEarnings: number; sunithaEarnings: number; saiEarnings: number }>
  recordCount: number
}

interface MonthOption {
  value: string
  label: string
}

// Helper function to format month value to display label
function formatMonthLabel(monthValue: string): string {
  const [year, month] = monthValue.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [availableMonths, setAvailableMonths] = useState<MonthOption[]>([])

  useEffect(() => {
    fetchMonths()
    fetchStats()
  }, [])

  useEffect(() => {
    fetchStats()
  }, [selectedMonth])

  const fetchMonths = async () => {
    try {
      const res = await fetch('/api/stats/months')
      const data = await res.json()
      
      if (Array.isArray(data) && data.length > 0) {
        const months: MonthOption[] = [
          { value: '', label: 'Last 6 Months' },
          ...data.map((monthValue: string) => ({
            value: monthValue,
            label: formatMonthLabel(monthValue),
          }))
        ]
        setAvailableMonths(months)
      } else {
        // Fallback if no months returned
        setAvailableMonths([{ value: '', label: 'Last 6 Months' }])
      }
    } catch (error) {
      console.error('Failed to fetch months:', error)
      setAvailableMonths([{ value: '', label: 'Last 6 Months' }])
    }
  }

  const fetchStats = async () => {
    setLoading(true)
    try {
      const monthParam = selectedMonth ? `&month=${selectedMonth}` : ''
      const res = await fetch(`/api/stats?months=6${monthParam}`)
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const contributionData = stats ? [
    { name: 'Jagan', value: stats.individualEarnings.jagan, color: 'hsl(var(--chart-1))' },
    { name: 'Sunitha', value: stats.individualEarnings.sunitha, color: 'hsl(var(--chart-2))' },
    { name: 'Sai Charan', value: stats.individualEarnings.sai, color: 'hsl(var(--chart-3))' },
  ] : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your family finances</p>
        </div>
        
        {/* Month Selection */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
{availableMonths.map((month: MonthOption) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="Total Earnings"
          value={formatCurrency(stats?.totalEarnings || 0)}
          icon={IndianRupee}
          iconColor="bg-green-500/10 text-green-500"
          delay={100}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(stats?.totalExpenses || 0)}
          icon={TrendingDown}
          iconColor="bg-red-500/10 text-red-500"
          delay={200}
        />
        <StatCard
          title="Net Savings"
          value={formatCurrency(stats?.netSavings || 0)}
          icon={TrendingUp}
          iconColor="bg-blue-500/10 text-blue-500"
          delay={300}
        />
        <StatCard
          title="Savings Rate"
          value={formatPercentage(stats?.savingsPercentage || 0)}
          icon={PiggyBank}
          iconColor="bg-purple-500/10 text-purple-500"
          delay={400}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Earnings vs Expenses */}
        <div className="rounded-xl border bg-card p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-4">Earnings vs Expenses</h3>
          <EarningsExpensesChart data={stats?.monthlyData || []} />
        </div>

        {/* Contribution Pie Chart */}
        <div className="rounded-xl border bg-card p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-4">Individual Contributions</h3>
          <ContributionPieChart data={contributionData} />
        </div>

        {/* Expense Bar Chart */}
        <div className="rounded-xl border bg-card p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Expenses</h3>
          <ExpenseBarChart data={stats?.monthlyData || []} />
        </div>

        {/* Daily Expenses Trend */}
        <div className="rounded-xl border bg-card p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Expenses Trend</h3>
          <DailyTrendChart data={stats?.dailyData || []} />
        </div>

        {/* Daily Earnings Trend */}
        <div className="rounded-xl border bg-card p-4 md:p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Daily Earnings Trend</h3>
          <DailyEarningsTrendChart data={stats?.dailyEarningsData || []} />
        </div>
      </div>

      {/* Record Count */}
      <div className="text-center text-sm text-muted-foreground">
        {stats?.recordCount || 0} records in database
      </div>
    </div>
  )
}
