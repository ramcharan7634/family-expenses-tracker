'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContributionPieChart } from '@/components/charts/contribution-pie-chart'
import { ExpenseBarChart } from '@/components/charts/expense-bar-chart'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { Loader2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, User, DollarSign, Percent, Calendar } from 'lucide-react'

interface AnalyticsData {
  individualSavings: Array<{
    name: string
    earnings: number
    expenses: number
    savings: number
    savingsRate: number
  }>
  expenseRatios: Array<{ name: string; value: number; percentage: number }>
  monthlyComparison: Array<{
    month: string
    earnings: number
    expenses: number
    savings: number
    savingsRate: number
  }>
  savingsTrends: Array<{
    month: string
    savings: number
    cumulativeSavings: number
  }>
  contributionPercentages: Array<{ name: string; percentage: number }>
  suggestions: string[]
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

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [availableMonths, setAvailableMonths] = useState<MonthOption[]>([])

  useEffect(() => {
    fetchMonths()
    fetchAnalytics()
  }, [])

  useEffect(() => {
    fetchAnalytics()
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

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const monthParam = selectedMonth ? `&month=${selectedMonth}` : ''
      const res = await fetch(`/api/analytics?months=6${monthParam}`)
      const data = await res.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Detailed financial insights and trends</p>
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="individuals">Individuals</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
                <CardDescription>How expenses are split across family members</CardDescription>
              </CardHeader>
              <CardContent>
                <ContributionPieChart
                  data={(analytics?.expenseRatios || []).map(r => ({ 
                    name: r.name, 
                    value: r.value,
                    color: r.name === 'Jagan' ? 'hsl(var(--chart-1))' : 
                           r.name === 'Sunitha' ? 'hsl(var(--chart-2))' : 
                           r.name === 'Sai Charan' ? 'hsl(var(--chart-3))' : 
                           'hsl(var(--chart-4))'
                  }))}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Comparison</CardTitle>
                <CardDescription>Earnings vs Expenses by month</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseBarChart
                  data={analytics?.monthlyComparison.map(m => ({ month: m.month, expenses: m.expenses })) || []}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Individuals Tab */}
        <TabsContent value="individuals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {analytics?.individualSavings.map((person, index) => (
              <Card key={person.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {person.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Earnings</span>
                    <span className="font-semibold text-green-500">
                      {formatCurrency(person.earnings)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expenses</span>
                    <span className="font-semibold text-red-500">
                      {formatCurrency(person.expenses)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Savings</span>
                    <span className="font-semibold">
                      {formatCurrency(person.savings)}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Savings Rate</span>
                      <span className={`font-bold ${person.savingsRate >= 20 ? 'text-green-500' : 'text-yellow-500'}`}>
                        {formatPercentage(person.savingsRate)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Savings Trend</CardTitle>
              <CardDescription>Cumulative savings over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.savingsTrends.map((trend, index) => (
                  <div key={trend.month} className="flex items-center justify-between">
                    <span className="font-medium">{trend.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">
                        Monthly: {formatCurrency(trend.savings)}
                      </span>
                      <span className="font-semibold">
                        Cumulative: {formatCurrency(trend.cumulativeSavings)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Insights</CardTitle>
              <CardDescription>AI-powered suggestions to improve your finances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-muted/50"
                  >
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <p>{suggestion}</p>
                  </div>
                ))}
                {(!analytics?.suggestions || analytics.suggestions.length === 0) && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <p>Great job! Your finances are looking healthy.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
