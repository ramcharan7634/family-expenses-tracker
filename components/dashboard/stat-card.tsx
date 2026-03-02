'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  iconColor: string
  delay?: number
}

export function StatCard({ title, value, icon: Icon, iconColor, delay = 0 }: StatCardProps) {
  return (
    <div 
      className="animate-fade-in opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="rounded-xl border bg-card p-6 shadow-sm card-hover">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </div>
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", iconColor)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
