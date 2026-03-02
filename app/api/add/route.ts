import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      date,
      jaganEarnings,
      jaganExpenses,
      sunithaEarnings,
      sunithaExpenses,
      saiEarnings,
      saiExpenses,
      dailyExpenses,
    } = body

    // Validate required fields
    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      )
    }

    const record = await prisma.financeRecord.create({
      data: {
        date: new Date(date),
        jaganEarnings: Number(jaganEarnings) || 0,
        jaganExpenses: Number(jaganExpenses) || 0,
        sunithaEarnings: Number(sunithaEarnings) || 0,
        sunithaExpenses: Number(sunithaExpenses) || 0,
        saiEarnings: Number(saiEarnings) || 0,
        saiExpenses: Number(saiExpenses) || 0,
        dailyExpenses: Number(dailyExpenses) || 0,
      },
    })

    return NextResponse.json({
      success: true,
      record,
    })
  } catch (error) {
    console.error('Add record error:', error)
    return NextResponse.json(
      { error: 'Failed to add record' },
      { status: 500 }
    )
  }
}
