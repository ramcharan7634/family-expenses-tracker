import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const months = parseInt(searchParams.get('months') || '6')
    const selectedMonth = searchParams.get('month') // Format: YYYY-MM

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()

    if (selectedMonth) {
      // Filter by specific month
      const [year, month] = selectedMonth.split('-').map(Number)
      startDate.setFullYear(year, month - 1, 1)
      startDate.setHours(0, 0, 0, 0)
      endDate.setFullYear(year, month, 0) // Last day of month
      endDate.setHours(23, 59, 59, 999)
    } else {
      startDate.setMonth(startDate.getMonth() - months)
    }

    const records = await prisma.financeRecord.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    if (records.length === 0) {
      return NextResponse.json({
        individualSavings: [],
        expenseRatios: [],
        monthlyComparison: [],
        savingsTrends: [],
        contributionPercentages: [],
        suggestions: [],
      })
    }

    // Calculate individual savings
    const individuals = [
      { name: 'Jagan', earnings: 0, expenses: 0 },
      { name: 'Sunitha', earnings: 0, expenses: 0 },
      { name: 'Sai Charan', earnings: 0, expenses: 0 },
    ]

    records.forEach((record: { jaganEarnings: number; jaganExpenses: number; sunithaEarnings: number; sunithaExpenses: number; saiEarnings: number; saiExpenses: number; dailyExpenses: number }) => {
      individuals[0].earnings += record.jaganEarnings
      individuals[0].expenses += record.jaganExpenses
      individuals[1].earnings += record.sunithaEarnings
      individuals[1].expenses += record.sunithaExpenses
      individuals[2].earnings += record.saiEarnings
      individuals[2].expenses += record.saiExpenses
    })

    const individualSavings = individuals.map((ind) => ({
      name: ind.name,
      earnings: Math.round(ind.earnings),
      expenses: Math.round(ind.expenses),
      savings: Math.round(ind.earnings - ind.expenses),
      savingsRate:
        ind.earnings > 0
          ? Math.round(((ind.earnings - ind.expenses) / ind.earnings) * 1000) / 10
          : 0,
    }))

    // Calculate expense ratios
    let totalExpenses = 0
    const expenseBreakdown = {
      jagan: 0,
      sunitha: 0,
      sai: 0,
      daily: 0,
    }

    records.forEach((record: { jaganExpenses: number; sunithaExpenses: number; saiExpenses: number; dailyExpenses: number }) => {
      expenseBreakdown.jagan += record.jaganExpenses
      expenseBreakdown.sunitha += record.sunithaExpenses
      expenseBreakdown.sai += record.saiExpenses
      expenseBreakdown.daily += record.dailyExpenses
      totalExpenses +=
        record.jaganExpenses +
        record.sunithaExpenses +
        record.saiExpenses +
        record.dailyExpenses
    })

    const expenseRatios = [
      { name: 'Jagan', value: Math.round(expenseBreakdown.jagan), percentage: totalExpenses > 0 ? Math.round((expenseBreakdown.jagan / totalExpenses) * 1000) / 10 : 0 },
      { name: 'Sunitha', value: Math.round(expenseBreakdown.sunitha), percentage: totalExpenses > 0 ? Math.round((expenseBreakdown.sunitha / totalExpenses) * 1000) / 10 : 0 },
      { name: 'Sai Charan', value: Math.round(expenseBreakdown.sai), percentage: totalExpenses > 0 ? Math.round((expenseBreakdown.sai / totalExpenses) * 1000) / 10 : 0 },
      { name: 'Daily', value: Math.round(expenseBreakdown.daily), percentage: totalExpenses > 0 ? Math.round((expenseBreakdown.daily / totalExpenses) * 1000) / 10 : 0 },
    ]

    // Monthly comparison
    const monthlyMap = new Map<string, { earnings: number; expenses: number }>()
    records.forEach((record: { date: Date; jaganEarnings: number; sunithaEarnings: number; saiEarnings: number; jaganExpenses: number; sunithaExpenses: number; saiExpenses: number; dailyExpenses: number }) => {
      const monthKey = `${record.date.getFullYear()}-${String(record.date.getMonth() + 1).padStart(2, '0')}`
      const monthData = monthlyMap.get(monthKey) || { earnings: 0, expenses: 0 }
      monthData.earnings +=
        record.jaganEarnings +
        record.sunithaEarnings +
        record.saiEarnings
      monthData.expenses +=
        record.jaganExpenses +
        record.sunithaExpenses +
        record.saiExpenses +
        record.dailyExpenses
      monthlyMap.set(monthKey, monthData)
    })

    const monthlyComparison = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, data]) => ({
        month: new Date(key + '-01').toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        earnings: Math.round(data.earnings),
        expenses: Math.round(data.expenses),
        savings: Math.round(data.earnings - data.expenses),
        savingsRate:
          data.earnings > 0
            ? Math.round(((data.earnings - data.expenses) / data.earnings) * 1000) / 10
            : 0,
      }))

    // Savings trend
    let runningSavings = 0
    const savingsTrends = monthlyComparison.map((month) => {
      runningSavings += month.savings
      return {
        month: month.month,
        savings: month.savings,
        cumulativeSavings: runningSavings,
      }
    })

    // Contribution percentages
    const totalEarnings =
      individuals[0].earnings +
      individuals[1].earnings +
      individuals[2].earnings
    const contributionPercentages = individuals.map((ind) => ({
      name: ind.name,
      percentage:
        totalEarnings > 0
          ? Math.round((ind.earnings / totalEarnings) * 1000) / 10
          : 0,
    }))

    // Generate suggestions
    const suggestions: string[] = []

    // Find highest spender
    const highestSpender = [...individualSavings].sort(
      (a, b) => b.expenses - a.expenses
    )[0]
    if (highestSpender) {
      suggestions.push(
        `${highestSpender.name} has the highest expenses (₹${highestSpender.expenses.toLocaleString()}). Consider reviewing their spending habits.`
      )
    }

    // Find best saver
    const bestSaver = [...individualSavings].sort(
      (a, b) => b.savingsRate - a.savingsRate
    )[0]
    if (bestSaver && bestSaver.savingsRate > 0) {
      suggestions.push(
        `${bestSaver.name} is the best saver with a ${bestSaver.savingsRate}% savings rate!`
      )
    }

    // Check for expense increase
    if (monthlyComparison.length >= 2) {
      const lastMonth = monthlyComparison[monthlyComparison.length - 1]
      const prevMonth = monthlyComparison[monthlyComparison.length - 2]
      const expenseIncrease = lastMonth.expenses - prevMonth.expenses
      if (expenseIncrease > 0) {
        suggestions.push(
          `Expenses increased by ₹${expenseIncrease.toLocaleString()} compared to last month.`
        )
      }
    }

    // Savings improvement suggestion
    const avgSavingsRate =
      monthlyComparison.reduce((acc, m) => acc + m.savingsRate, 0) /
      monthlyComparison.length
    if (avgSavingsRate < 20) {
      suggestions.push(
        'Your average savings rate is below 20%. Consider reducing discretionary expenses to improve savings.'
      )
    }

    return NextResponse.json({
      individualSavings,
      expenseRatios,
      monthlyComparison,
      savingsTrends,
      contributionPercentages,
      suggestions,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
