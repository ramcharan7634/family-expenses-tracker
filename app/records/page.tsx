'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { Loader2 } from 'lucide-react'

interface Record {
  id: number
  date: string
  jaganEarnings: number
  jaganExpenses: number
  sunithaEarnings: number
  sunithaExpenses: number
  saiEarnings: number
  saiExpenses: number
  dailyExpenses: number
}

export default function RecordsPage() {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const res = await fetch('/api/records?page=1&limit=100')
      const data = await res.json()
      setRecords(data.records)
    } catch (error) {
      console.error('Failed to fetch records:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/records?id=${id}`, { method: 'DELETE' })
      fetchRecords()
    } catch (error) {
      console.error('Failed to delete record:', error)
    }
  }

  const columns = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'jaganEarnings', label: 'Jagan Earnings', sortable: true },
    { key: 'jaganExpenses', label: 'Jagan Expenses', sortable: true },
    { key: 'sunithaEarnings', label: 'Sunitha Earnings', sortable: true },
    { key: 'sunithaExpenses', label: 'Sunitha Expenses', sortable: true },
    { key: 'saiEarnings', label: 'Sai Earnings', sortable: true },
    { key: 'saiExpenses', label: 'Sai Expenses', sortable: true },
    { key: 'dailyExpenses', label: 'Daily Expenses', sortable: true },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Records</h1>
        <p className="text-muted-foreground mt-1">View and manage all financial records</p>
      </div>

      <div className="rounded-xl border bg-card p-4 md:p-6">
        <DataTable
          columns={columns}
          data={records}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
