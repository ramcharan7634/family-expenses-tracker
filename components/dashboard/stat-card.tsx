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
      <div className="rounded-xl border bg-card p-4 md:p-6 shadow-sm card-hover">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground truncate">{title}</p>
            <p className="mt-1 text-xl md:text-2xl font-bold truncate">{value}</p>
          </div>
          <div className={cn("flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl flex-shrink-0", iconColor)}>
            <Icon className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
