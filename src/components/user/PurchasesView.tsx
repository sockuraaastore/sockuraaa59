import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import { PackageCheck, Clock, CheckCircle, XCircle } from 'lucide-react'

const statusConfig = {
  pending: { label: 'در انتظار بررسی', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  approved: { label: 'تایید شده', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
  rejected: { label: 'رد شده', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
}

export default function PurchasesView() {
  const { currentUser } = useAuth()
  const { getOrdersByUser } = useOrders()

  const orders = currentUser ? getOrdersByUser(currentUser.id) : []

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <PackageCheck size={28} className="text-pink" />
        <h1 className="text-3xl font-black text-dark">خریدها</h1>
      </motion.div>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-dark-300">
          <PackageCheck size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">شما هنوز خریدی انجام نداده‌اید</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const cfg = statusConfig[order.status]
            const StatusIcon = cfg.icon
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-2xl border ${cfg.border} p-5`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <StatusIcon size={18} className={cfg.color} />
                    <span className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <span className="text-xs text-dark-300">
                    {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>

                <div className="text-sm text-dark mb-2">
                  {order.items.map(i => `${i.productName} × ${i.quantity}`).join('، ')}
                </div>

                <div className="font-bold text-pink text-sm mb-2">
                  {order.total.toLocaleString('fa-IR')} تومان
                </div>

                {order.adminMessage && (
                  <div className={`${cfg.bg} rounded-xl p-3 text-sm text-dark`}>
                    <span className="font-bold">پیام ادمین: </span>
                    {order.adminMessage}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
