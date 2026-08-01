import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const monthsParam = searchParams.get('months')
    const selectedMonth = searchParams.get('month')

    let where = {}

    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-').map(Number)

      const startDate = new Date(year, month - 1, 1)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(year, month, 0)
      endDate.setHours(23, 59, 59, 999)

      where = {
        date: {
          gte: startDate,
          lte: endDate,
        },
      }
    } else if (monthsParam && monthsParam !== 'all') {
      const months = parseInt(monthsParam)

      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - months)

      where = {
        date: {
          gte: startDate,
        },
      }
    }

    const records = await prisma.financeRecord.findMany({
      where,
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

    // ===============================
    // Calculate individual savings
    // ===============================

    const individuals = [
      {
        name: 'Jagan',
        earnings: 0,
        expenses: 0,
      },
      {
        name: 'Sunitha',
        earnings: 0,
        expenses: 0,
      },
      {
        name: 'Sai Charan',
        earnings: 0,
        expenses: 0,
      },
    ]

    records.forEach((record) => {
      individuals[0].earnings += record.jaganEarnings
      individuals[0].expenses += record.jaganExpenses

      individuals[1].earnings += record.sunithaEarnings
      individuals[1].expenses += record.sunithaExpenses

      individuals[2].earnings += record.saiEarnings
      individuals[2].expenses += record.saiExpenses
    })

    const individualSavings = individuals.map((person) => ({
      name: person.name,
      earnings: Math.round(person.earnings),
      expenses: Math.round(person.expenses),
      savings: Math.round(person.earnings - person.expenses),
      savingsRate:
        person.earnings > 0
          ? Math.round(
              ((person.earnings - person.expenses) / person.earnings) *
                1000
            ) / 10
          : 0,
    }))

    // ===============================
    // Expense Ratios
    // ===============================

    let totalExpenses = 0

    const expenseBreakdown = {
      jagan: 0,
      sunitha: 0,
      sai: 0,
      daily: 0,
    }

    records.forEach((record) => {
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
      {
        name: 'Jagan',
        value: Math.round(expenseBreakdown.jagan),
        percentage:
          totalExpenses > 0
            ? Math.round(
                (expenseBreakdown.jagan / totalExpenses) * 1000
              ) / 10
            : 0,
      },
      {
        name: 'Sunitha',
        value: Math.round(expenseBreakdown.sunitha),
        percentage:
          totalExpenses > 0
            ? Math.round(
                (expenseBreakdown.sunitha / totalExpenses) * 1000
              ) / 10
            : 0,
      },
      {
        name: 'Sai Charan',
        value: Math.round(expenseBreakdown.sai),
        percentage:
          totalExpenses > 0
            ? Math.round(
                (expenseBreakdown.sai / totalExpenses) * 1000
              ) / 10
            : 0,
      },
      {
        name: 'Daily',
        value: Math.round(expenseBreakdown.daily),
        percentage:
          totalExpenses > 0
            ? Math.round(
                (expenseBreakdown.daily / totalExpenses) * 1000
              ) / 10
            : 0,
      },
    ]

    // ===============================
    // Monthly Comparison
    // ===============================
    const monthlyMap = new Map<
  string,
  {
    earnings: number
    expenses: number
  }
>()

records.forEach((record) => {
  const monthKey = `${record.date.getFullYear()}-${String(
    record.date.getMonth() + 1
  ).padStart(2, '0')}`

  const monthData = monthlyMap.get(monthKey) || {
    earnings: 0,
    expenses: 0,
  }

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
    month: new Date(`${key}-01`).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    }),
    earnings: Math.round(data.earnings),
    expenses: Math.round(data.expenses),
    savings: Math.round(data.earnings - data.expenses),
    savingsRate:
      data.earnings > 0
        ? Math.round(
            ((data.earnings - data.expenses) /
              data.earnings) *
              1000
          ) / 10
        : 0,
  }))

// ===============================
// Savings Trend
// ===============================

let runningSavings = 0

const savingsTrends = monthlyComparison.map((month) => {
  runningSavings += month.savings

  return {
    month: month.month,
    savings: month.savings,
    cumulativeSavings: runningSavings,
  }
})

// ===============================
// Contribution Percentages
// ===============================

const totalEarnings =
  individuals.reduce(
    (sum, person) => sum + person.earnings,
    0
  )

const contributionPercentages = individuals.map(
  (person) => ({
    name: person.name,
    percentage:
      totalEarnings > 0
        ? Math.round(
            (person.earnings / totalEarnings) *
              1000
          ) / 10
        : 0,
  })
)

// ===============================
// Smart Suggestions
// ===============================

const suggestions: string[] = []

const highestSpender = [...individualSavings].sort(
  (a, b) => b.expenses - a.expenses
)[0]

if (highestSpender) {
  suggestions.push(
    `${highestSpender.name} has the highest expenses (₹${highestSpender.expenses.toLocaleString()}). Consider reviewing spending habits.`
  )
}

const bestSaver = [...individualSavings].sort(
  (a, b) => b.savingsRate - a.savingsRate
)[0]

if (bestSaver && bestSaver.savingsRate > 0) {
  suggestions.push(
    `${bestSaver.name} has the highest savings rate (${bestSaver.savingsRate}%).`
  )
}

if (monthlyComparison.length >= 2) {
  const last =
    monthlyComparison[monthlyComparison.length - 1]

  const previous =
    monthlyComparison[monthlyComparison.length - 2]

  const diff = last.expenses - previous.expenses

  if (diff > 0) {
    suggestions.push(
      `Expenses increased by ₹${diff.toLocaleString()} compared to the previous month.`
    )
  }
}

const averageSavingsRate =
  monthlyComparison.reduce(
    (sum, month) => sum + month.savingsRate,
    0
  ) / monthlyComparison.length

if (averageSavingsRate < 20) {
  suggestions.push(
    'Average savings rate is below 20%. Consider reducing discretionary expenses.'
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
    {
      error: 'Failed to fetch analytics',
    },
    {
      status: 500,
    }
  )
}
}