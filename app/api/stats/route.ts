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

    // Get records within date range
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
        totalEarnings: 0,
        totalExpenses: 0,
        netSavings: 0,
        savingsPercentage: 0,
        individualEarnings: { jagan: 0, sunitha: 0, sai: 0 },
        monthlyData: [],
        dailyData: [],
        dailyEarningsData: [],
        recordCount: 0,
      })
    }

    // Calculate totals
    let totalEarnings = 0
    let totalExpenses = 0

    const individualEarnings = {
      jagan: 0,
      sunitha: 0,
      sai: 0,
    }

    records.forEach((record: { jaganEarnings: number; sunithaEarnings: number; saiEarnings: number; jaganExpenses: number; sunithaExpenses: number; saiExpenses: number; dailyExpenses: number }) => {
      totalEarnings +=
        record.jaganEarnings +
        record.sunithaEarnings +
        record.saiEarnings
      totalExpenses +=
        record.jaganExpenses +
        record.sunithaExpenses +
        record.saiExpenses +
        record.dailyExpenses

      individualEarnings.jagan += record.jaganEarnings
      individualEarnings.sunitha += record.sunithaEarnings
      individualEarnings.sai += record.saiEarnings
    })

    const netSavings = totalEarnings - totalExpenses
    const savingsPercentage =
      totalEarnings > 0 ? (netSavings / totalEarnings) * 100 : 0

    // Group by month for charts
    const monthlyMap = new Map<string, { earnings: number; expenses: number; jaganEarnings: number; sunithaEarnings: number; saiEarnings: number }>()
    const dailyMap = new Map<string, number>()
    const dailyEarningsMap = new Map<string, { jagan: number; sunitha: number; sai: number }>()

    records.forEach((record: { date: Date; jaganEarnings: number; sunithaEarnings: number; saiEarnings: number; jaganExpenses: number; sunithaExpenses: number; saiExpenses: number; dailyExpenses: number }) => {
      const monthKey = `${record.date.getFullYear()}-${String(record.date.getMonth() + 1).padStart(2, '0')}`

      const monthData = monthlyMap.get(monthKey) || {
        earnings: 0,
        expenses: 0,
        jaganEarnings: 0,
        sunithaEarnings: 0,
        saiEarnings: 0,
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
      monthData.jaganEarnings += record.jaganEarnings
      monthData.sunithaEarnings += record.sunithaEarnings
      monthData.saiEarnings += record.saiEarnings

      monthlyMap.set(monthKey, monthData)

      // Daily expense data
      const dateKey = record.date.toISOString().split('T')[0]
      dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + record.dailyExpenses)

      // Daily earnings data
      const earningsData = dailyEarningsMap.get(dateKey) || { jagan: 0, sunitha: 0, sai: 0 }
      earningsData.jagan += record.jaganEarnings
      earningsData.sunitha += record.sunithaEarnings
      earningsData.sai += record.saiEarnings
      dailyEarningsMap.set(dateKey, earningsData)
    })

    const monthlyData = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, data]) => ({
        month: new Date(key + '-01').toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        }),
        earnings: Math.round(data.earnings),
        expenses: Math.round(data.expenses),
        jaganEarnings: Math.round(data.jaganEarnings),
        sunithaEarnings: Math.round(data.sunithaEarnings),
        saiEarnings: Math.round(data.saiEarnings),
      }))

let dailyData: Array<{ date: string; dailyExpenses: number }>
    let dailyEarningsData: Array<{ date: string; jaganEarnings: number; sunithaEarnings: number; saiEarnings: number }>

    if (selectedMonth) {
      // When a month is selected, return only the valid days in that month
      const [year, month] = selectedMonth.split('-').map(Number)
      
      dailyData = Array.from(dailyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, dailyExpenses]) => ({
          date,
          dailyExpenses: Math.round(dailyExpenses),
        }))
        .filter((item) => {
          const itemDate = new Date(item.date)
          return itemDate.getMonth() === month - 1 && itemDate.getFullYear() === year
        })

      dailyEarningsData = Array.from(dailyEarningsMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, data]) => ({
          date,
          jaganEarnings: Math.round(data.jagan),
          sunithaEarnings: Math.round(data.sunitha),
          saiEarnings: Math.round(data.sai),
        }))
        .filter((item) => {
          const itemDate = new Date(item.date)
          return itemDate.getMonth() === month - 1 && itemDate.getFullYear() === year
        })
    } else {
      // When no month selected, return last 30 days
      dailyData = Array.from(dailyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-30)
        .map(([date, dailyExpenses]) => ({
          date,
          dailyExpenses: Math.round(dailyExpenses),
        }))

      dailyEarningsData = Array.from(dailyEarningsMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-30)
        .map(([date, data]) => ({
          date,
          jaganEarnings: Math.round(data.jagan),
          sunithaEarnings: Math.round(data.sunitha),
          saiEarnings: Math.round(data.sai),
        }))
    }

    return NextResponse.json({
      totalEarnings: Math.round(totalEarnings),
      totalExpenses: Math.round(totalExpenses),
      netSavings: Math.round(netSavings),
      savingsPercentage: Math.round(savingsPercentage * 10) / 10,
      individualEarnings,
      monthlyData,
      dailyData,
      dailyEarningsData,
      recordCount: records.length,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
