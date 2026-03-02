import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all records with dates
    const records = await prisma.financeRecord.findMany({
      select: {
        date: true,
      },
      distinct: ['date'],
      orderBy: {
        date: 'desc',
      },
    })

    // Extract unique months and format as YYYY-MM
    const uniqueMonths = new Set<string>()

    records.forEach((record) => {
      const year = record.date.getFullYear()
      const month = String(record.date.getMonth() + 1).padStart(2, '0')
      const monthKey = `${year}-${month}`
      uniqueMonths.add(monthKey)
    })

    // Convert to array and sort descending (latest first)
    const sortedMonths = Array.from(uniqueMonths).sort((a, b) => b.localeCompare(a))

    return NextResponse.json(sortedMonths)
  } catch (error) {
    console.error('Error fetching months:', error)
    return NextResponse.json(
      { error: 'Failed to fetch months' },
      { status: 500 }
    )
  }
}
