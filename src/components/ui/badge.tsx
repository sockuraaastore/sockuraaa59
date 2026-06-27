import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-pink bg-pink text-white',
        secondary: 'border-dark-200 bg-dark-200 text-white',
        destructive: 'border-red-500 bg-red-500 text-white',
        outline: 'border-pink text-pink',
        success: 'border-green-500 bg-green-500 text-white',
        warning: 'border-yellow-500 bg-yellow-500 text-dark',
        stock: 'border-pink bg-pink-50 text-pink-700',
        outOfStock: 'border-red-200 bg-red-50 text-red-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
