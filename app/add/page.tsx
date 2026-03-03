'use client'

import { useState } from 'react'
import { ManualEntryForm } from '@/components/forms/manual-entry-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function AddPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true)
    setSuccess(false)

    try {
      const res = await fetch('/api/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error('Failed to add record')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to add record:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Add Record</h1>
        <p className="text-muted-foreground mt-1">Manually add a new financial record</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">New Record</CardTitle>
            <CardDescription className="text-xs md:text-sm">Enter the financial details for a single day</CardDescription>
          </CardHeader>
          <CardContent>
            <ManualEntryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </CardContent>
        </Card>

        {success && (
          <Card className="border-green-500 bg-green-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-semibold text-green-500">Record Added Successfully!</p>
                  <p className="text-sm text-muted-foreground">The record has been saved to the database.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
