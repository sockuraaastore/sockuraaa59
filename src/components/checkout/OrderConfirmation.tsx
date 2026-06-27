import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckCircle, Home } from 'lucide-react'
import type { ViewType } from '@/types'

interface OrderConfirmationProps {
  onNavigate: (view: ViewType) => void
}

export default function OrderConfirmation({ onNavigate }: OrderConfirmationProps) {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-black text-dark mb-4">سفارش ثبت شد!</h2>
        <p className="text-dark-300 mb-2">
          سفارش شما با موفقیت ثبت شد و در انتظار بررسی ادمین است.
        </p>
        <p className="text-dark-300 mb-8">
          پس از تایید ادمین، سفارش شما ارسال خواهد شد.
        </p>

        <Button onClick={() => onNavigate('home')} className="gap-2">
          <Home size={18} />
          بازگشت به خانه
        </Button>
      </motion.div>
    </div>
  )
}
