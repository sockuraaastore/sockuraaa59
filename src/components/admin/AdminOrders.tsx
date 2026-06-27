import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useOrders } from '@/hooks/useOrders'
import { useProducts } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { CheckCircle, XCircle, Eye, Trash2, MessageSquare } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function AdminOrders() {
  const { getActiveOrders, approveOrder, rejectOrder, adminDeleteOrder } = useOrders()
  const { deductStock } = useProducts()
  const orders = getActiveOrders()

  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null)
  const [message, setMessage] = useState('')
  const [showReceipt, setShowReceipt] = useState<string | null>(null)
  const [showMessageForm, setShowMessageForm] = useState<{ orderId: string; action: 'approved' | 'rejected' } | null>(null)

  const handleApprove = (orderId: string) => {
    setShowMessageForm({ orderId, action: 'approved' })
  }

  const handleReject = (orderId: string) => {
    setShowMessageForm({ orderId, action: 'rejected' })
  }

  const confirmAction = async () => {
    if (!showMessageForm) return

    const order = orders.find(o => o.id === showMessageForm.orderId)
    if (!order) return

    if (showMessageForm.action === 'approved') {
      const result = await approveOrder(showMessageForm.orderId, message)
      if (!result.success) { alert('خطا در تایید سفارش: ' + (result.error || 'ناشناخته')); return }
      for (const item of order.items) {
        await deductStock(item.productId, item.quantity)
      }
    } else {
      const result = await rejectOrder(showMessageForm.orderId, message)
      if (!result.success) { alert('خطا در رد سفارش: ' + (result.error || 'ناشناخته')); return }
    }

    setMessage('')
    setShowMessageForm(null)
  }

  const handleDelete = async (orderId: string) => {
    if (confirm('آیا از حذف این سفارش اطمینان دارید؟')) {
      const result = await adminDeleteOrder(orderId)
      if (!result.success) alert('خطا در حذف سفارش: ' + (result.error || 'ناشناخته'))
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-dark mb-6">مدیریت سفارشات</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-pink-100">
          <p className="text-dark-300">سفارش فعالی وجود ندارد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 border border-pink-100"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-dark">{order.username}</span>
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
                    : 'در انتظار'}
                </Badge>
              </div>

              <div className="text-sm text-dark-300 mb-2">
                {order.items.map(i => `${i.productName} × ${i.quantity}`).join('، ')}
              </div>

              <div className="text-sm text-dark-300 mb-1">
                📱 {order.phone}
              </div>
              <div className="text-sm text-dark-300 mb-1">
                📍 {order.address}
              </div>

              <div className="flex items-center justify-between mt-3 mb-3">
                <span className="font-bold text-pink">
                  {order.total.toLocaleString('fa-IR')} تومان
                </span>
                <span className="text-xs text-dark-300">
                  {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                </span>
              </div>

              {order.adminMessage && (
                <div className="text-xs bg-pink-50 rounded-lg p-2 mb-3">
                  <MessageSquare size={12} className="inline ml-1" />
                  {order.adminMessage}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowReceipt(order.receiptImageBase64)}
                  className="flex-1 gap-1"
                >
                  <Eye size={14} />
                  رسید
                </Button>

                {order.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(order.id)}
                      className="gap-1 bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle size={14} />
                      تایید
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(order.id)}
                      className="gap-1"
                    >
                      <XCircle size={14} />
                      رد
                    </Button>
                  </>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(order.id)}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={!!showReceipt} onOpenChange={() => setShowReceipt(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>رسید پرداخت</DialogTitle>
          </DialogHeader>
          {showReceipt && (
            <img src={showReceipt} alt="رسید" className="w-full rounded-xl" />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!showMessageForm} onOpenChange={() => { setShowMessageForm(null); setMessage('') }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {showMessageForm?.action === 'approved' ? 'تایید سفارش' : 'رد سفارش'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={showMessageForm?.action === 'approved' ? 'پیام تایید (مثلاً کد رهگیری پستی)...' : 'دلیل رد سفارش...'}
              className="w-full h-24 rounded-xl border-2 border-pink-200 bg-white px-4 py-3 text-sm text-dark resize-none focus:outline-none focus:border-pink"
            />
            <div className="flex gap-2">
              <Button onClick={confirmAction} className="flex-1">
                تایید نهایی
              </Button>
              <Button variant="ghost" onClick={() => { setShowMessageForm(null); setMessage('') }}>
                انصراف
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
