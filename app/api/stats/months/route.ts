import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const records = await prisma.financeRecord.findMany({
      select: { date: true },
      orderBy: { date: 'desc' },
    })

    const uniqueMonths = new Set<string>()

    records.forEach((record) => {
      const year = record.date.getFullYear()
      const month = String(record.date.getMonth() + 1).padStart(2, '0')
      uniqueMonths.add(`${year}-${month}`)
    })

    const sortedMonths = Array.from(uniqueMonths).sort((a, b) => b.localeCompare(a))

    return NextResponse.json(sortedMonths)
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}