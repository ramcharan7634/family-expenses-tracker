'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'

const financeSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  jaganEarnings: z.coerce.number().min(0, 'Must be a positive number'),
  jaganExpenses: z.coerce.number().min(0, 'Must be a positive number'),
  sunithaEarnings: z.coerce.number().min(0, 'Must be a positive number'),
  sunithaExpenses: z.coerce.number().min(0, 'Must be a positive number'),
  saiEarnings: z.coerce.number().min(0, 'Must be a positive number'),
  saiExpenses: z.coerce.number().min(0, 'Must be a positive number'),
  dailyExpenses: z.coerce.number().min(0, 'Must be a positive number'),
})

type FinanceFormData = z.infer<typeof financeSchema>

interface ManualEntryFormProps {
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  isSubmitting: boolean
}

export function ManualEntryForm({ onSubmit, isSubmitting }: ManualEntryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FinanceFormData>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      jaganEarnings: 0,
      jaganExpenses: 0,
      sunithaEarnings: 0,
      sunithaExpenses: 0,
      saiEarnings: 0,
      saiExpenses: 0,
      dailyExpenses: 0,
    },
  })

  const handleFormSubmit = async (data: FinanceFormData) => {
    await onSubmit(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input type="date" {...register('date')} />
        {errors.date && (
          <p className="text-sm text-destructive">{errors.date.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {/* Jagan Section */}
        <div className="space-y-2">
          <Label htmlFor="jaganEarnings">Jagan Earnings</Label>
          <Input type="number" step="0.01" {...register('jaganEarnings')} />
          {errors.jaganEarnings && (
            <p className="text-sm text-destructive">{errors.jaganEarnings.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="jaganExpenses">Jagan Expenses</Label>
          <Input type="number" step="0.01" {...register('jaganExpenses')} />
          {errors.jaganExpenses && (
            <p className="text-sm text-destructive">{errors.jaganExpenses.message}</p>
          )}
        </div>

        {/* Sunitha Section */}
        <div className="space-y-2">
          <Label htmlFor="sunithaEarnings">Sunitha Earnings</Label>
          <Input type="number" step="0.01" {...register('sunithaEarnings')} />
          {errors.sunithaEarnings && (
            <p className="text-sm text-destructive">{errors.sunithaEarnings.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="sunithaExpenses">Sunitha Expenses</Label>
          <Input type="number" step="0.01" {...register('sunithaExpenses')} />
          {errors.sunithaExpenses && (
            <p className="text-sm text-destructive">{errors.sunithaExpenses.message}</p>
          )}
        </div>

        {/* Sai Section */}
        <div className="space-y-2">
          <Label htmlFor="saiEarnings">Sai Earnings</Label>
          <Input type="number" step="0.01" {...register('saiEarnings')} />
          {errors.saiEarnings && (
            <p className="text-sm text-destructive">{errors.saiEarnings.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="saiExpenses">Sai Expenses</Label>
          <Input type="number" step="0.01" {...register('saiExpenses')} />
          {errors.saiExpenses && (
            <p className="text-sm text-destructive">{errors.saiExpenses.message}</p>
          )}
        </div>
      </div>

      {/* Daily Expenses */}
      <div className="space-y-2">
        <Label htmlFor="dailyExpenses">Daily Expenses</Label>
        <Input type="number" step="0.01" {...register('dailyExpenses')} />
        {errors.dailyExpenses && (
          <p className="text-sm text-destructive">{errors.dailyExpenses.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full h-10 md:h-11" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Record'}
      </Button>
    </form>
  )
}
