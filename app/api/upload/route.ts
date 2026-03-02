import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

/**
 * Parse Excel Date safely
 */
function parseExcelDate(value: unknown): Date {
  if (!value) return new Date()

  // Already JS Date
  if (value instanceof Date) {
    return value
  }

  // Excel serial number
  if (typeof value === 'number') {
    return new Date((value - 25569) * 86400 * 1000)
  }

  // String date
  if (typeof value === 'string') {
    const parsed = new Date(value)
    if (!isNaN(parsed.getTime())) {
      return parsed
    }
  }

  return new Date()
}

/**
 * Parse numbers safely including expressions like "1100+60"
 */
function parseNumber(value: unknown): number {
  if (!value) return 0

  if (typeof value === 'number') return value

  if (typeof value === 'string') {
    const cleaned = value.replace(/\s/g, '')

    if (cleaned.includes('+')) {
      return cleaned
        .split('+')
        .map(v => parseFloat(v) || 0)
        .reduce((a, b) => a + b, 0)
    }

    return parseFloat(cleaned) || 0
  }

  return 0
}

/**
 * Get column value with multiple name support
 */
function getValue(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (row[key] !== undefined) {
      return row[key]
    }
  }
  return undefined
}

export async function POST(request: NextRequest) {
  try {

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Read file buffer
    const buffer = await file.arrayBuffer()
    const data = new Uint8Array(buffer)

    // Parse Excel workbook
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      raw: true,
      defval: 0,
    }) as Record<string, unknown>[]

    if (!jsonData.length) {
      return NextResponse.json(
        { error: 'No data found in Excel file' },
        { status: 400 }
      )
    }

    // Map Excel rows to database records
    const records = jsonData.map((row) => {

      const dateValue = getValue(row, [
        'Date',
        'date'
      ])

      const parsedDate = parseExcelDate(dateValue)

      return {
        date: parsedDate,

        jaganEarnings: parseNumber(
          getValue(row, ['J_E','jagan_earnings','Jagan Earnings'])
        ),

        jaganExpenses: parseNumber(
          getValue(row, ['J_X','jagan_expenses','Jagan Expenses'])
        ),

        sunithaEarnings: parseNumber(
          getValue(row, ['S_E','sunitha_earnings','Sunitha Earnings'])
        ),

        sunithaExpenses: parseNumber(
          getValue(row, ['S_X','sunitha_expenses','Sunitha Expenses'])
        ),

        saiEarnings: parseNumber(
          getValue(row, ['C_E','sai_earnings','Sai Earnings','Sai Charan Earnings'])
        ),

        saiExpenses: parseNumber(
          getValue(row, ['C_X','sai_expenses','Sai Expenses','Sai Charan Expenses'])
        ),

        dailyExpenses: parseNumber(
          getValue(row, ['Daily','daily_expenses','Daily Expenses'])
        ),
      }
    })

    // Insert records into database
    const result = await prisma.financeRecord.createMany({
      data: records,
    })

    return NextResponse.json({
      success: true,
      inserted: result.count,
    })

  } catch (error) {

    console.error('Upload error:', error)

    return NextResponse.json(
      {
        error: 'Failed to upload file',
      },
      { status: 500 }
    )
  }
}