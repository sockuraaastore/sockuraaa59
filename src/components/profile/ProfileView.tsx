import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Package, LogOut, Clock, CheckCircle, XCircle, Eye } from 'lucide-react'
import type { ViewType } from '@/types'

interface ProfileViewProps {
  onNavigate: (view: ViewType) => void
}

export default function ProfileView({ onNavigate }: ProfileViewProps) {
  const { currentUser, logout } = useAuth()
  const { getOrdersByUser } = useOrders()
  const { cart } = useCart()

  if (!currentUser) return null

  const myOrders = getOrdersByUser(currentUser.id)

  const handleLogout = () => {
    logout()
    window.location.reload()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm mb-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-pink rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            {currentUser.username.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark">{currentUser.username}</h2>
            <p className="text-dark-300 text-sm">
              {currentUser.isAdmin ? 'ادمین' : 'کاربر'} • عضو از {new Date(currentUser.createdAt).toLocaleDateString('fa-IR')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-pink-50 rounded-xl p-4 text-center">
            <Package size={24} className="mx-auto text-pink mb-2" />
            <div className="text-2xl font-bold text-dark">{myOrders.length}</div>
            <div className="text-xs text-dark-300">سفارش</div>
          </div>
          <div className="bg-pink-50 rounded-xl p-4 text-center">
            <Clock size={24} className="mx-auto text-pink mb-2" />
            <div className="text-2xl font-bold text-dark">{myOrders.filter(o => o.status === 'pending').length}</div>
            <div className="text-xs text-dark-300">در انتظار</div>
          </div>
          <div className="bg-pink-50 rounded-xl p-4 text-center">
            <CheckCircle size={24} className="mx-auto text-pink mb-2" />
            <div className="text-2xl font-bold text-dark">{myOrders.filter(o => o.status === 'approved').length}</div>
            <div className="text-xs text-dark-300">تایید شده</div>
          </div>
        </div>

        <Button variant="outline" onClick={handleLogout} className="w-full mt-6 gap-2">
          <LogOut size={16} />
          خروج از حساب
        </Button>
      </motion.div>

      {cart.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-pink-50 rounded-2xl p-4 mb-6 flex items-center justify-between"
        >
          <span className="text-dark font-medium">سبد خرید شما {cart.length} محصول دارد</span>
          <Button size="sm" onClick={() => onNavigate('cart')}>
            مشاهده سبد
          </Button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-bold text-dark mb-4">تاریخچه سفارشات</h3>

        {myOrders.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-2xl border border-pink-100">
            <Package size={32} className="mx-auto text-pink-200 mb-2" />
            <p className="text-dark-300">هنوز سفارشی ثبت نکرده‌اید</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl p-4 border border-pink-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-dark-300">
                    {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                  <Badge
                    variant={
                      order.status === 'approved'
                        ? 'success'
                        : order.status === 'rejected'
                        ? 'destructive'
                        : 'warning'
                    }
                  >
                    {order.status === 'approved'
                      ? 'تایید شده'
                      : order.status === 'rejected'
                      ? 'رد شده'
                      : 'در انتظار بررسی'}
                  </Badge>
                </div>

                <div className="text-sm text-dark mb-2">
                  {order.items.map(i => `${i.productName} × ${i.quantity}`).join('، ')}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-pink">
                    {order.total.toLocaleString('fa-IR')} تومان
                  </span>
                  {order.adminMessage && (
                    <span className="text-xs text-dark-300 bg-pink-50 px-2 py-1 rounded-lg">
                      پیام ادمین: {order.adminMessage}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
