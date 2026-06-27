import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import { useProducts } from '@/hooks/useProducts'
import { useOrders } from '@/hooks/useOrders'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreditCard, Upload, CheckCircle, ArrowRight } from 'lucide-react'
import type { ViewType } from '@/types'

interface CheckoutFormProps {
  onNavigate: (view: ViewType) => void
  onComplete: () => void
}

export default function CheckoutForm({ onNavigate, onComplete }: CheckoutFormProps) {
  const { currentUser } = useAuth()
  const { cart, getCartTotal, clearCart } = useCart()
  const { products } = useProducts()
  const { placeOrder } = useOrders()

  const [phone, setPhone] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [address, setAddress] = useState('')
  const [receiptImage, setReceiptImage] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const total = getCartTotal(products)

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId)
    return { ...item, product }
  }).filter(item => item.product)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 3 * 1024 * 1024) {
      alert('حجم فایل بیش از ۳ مگابایت است. لطفاً تصویر کوچکتری انتخاب کنید.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setReceiptImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !phone || !postalCode || !address || !receiptImage) return

    setIsSubmitting(true)

    const order = await placeOrder({
      userId: currentUser.id,
      username: currentUser.username,
      items: cartItems.map(item => ({
        productId: item.productId,
        productName: item.product!.name,
        quantity: item.quantity,
        unitPrice: item.product!.price,
      })),
      total,
      phone,
      postalCode,
      address,
      receiptImageBase64: receiptImage,
    })

    if (order.success) {
      clearCart()
      onComplete()
    } else {
      alert('خطا در ثبت سفارش: ' + (order.error || 'ناشناخته'))
    }
    setIsSubmitting(false)
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-dark mb-4">سبد خرید شما خالی است</h2>
        <Button onClick={() => onNavigate('home')}>بازگشت به فروشگاه</Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => onNavigate('cart')} className="mb-6 gap-1">
        <ArrowRight size={16} />
        بازگشت به سبد خرید
      </Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black text-dark mb-6">تکمیل خرید</h2>

        <div className="bg-white rounded-2xl p-6 border border-pink-100 mb-6">
          <h3 className="font-bold text-dark mb-4">خلاصه سفارش</h3>
          {cartItems.map(({ productId, quantity, product }) => (
            <div key={productId} className="flex justify-between py-2 border-b border-pink-50 last:border-0">
              <span className="text-dark">{product!.name} × {quantity}</span>
              <span className="font-medium text-dark">{(product!.price * quantity).toLocaleString('fa-IR')} تومان</span>
            </div>
          ))}
          <div className="flex justify-between pt-4 mt-2 border-t border-pink-100">
            <span className="font-bold text-dark">جمع کل</span>
            <span className="text-xl font-black text-pink">{total.toLocaleString('fa-IR')} تومان</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-pink-100 mb-6">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-pink" />
            اطلاعات پرداخت
          </h3>
          <div className="bg-pink-50 rounded-xl p-4 text-sm">
            <p className="mb-1"><span className="font-medium text-dark">نام صاحب کارت:</span> <span className="text-dark-300">نسترن محمدیان خلیفه کندی</span></p>
            <p><span className="font-medium text-dark">شماره کارت:</span> <span className="text-dark-300" dir="ltr">1528-4709-7014-6037</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl p-6 border border-pink-100 mb-6 space-y-4">
            <h3 className="font-bold text-dark mb-4">اطلاعات ارسال</h3>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">شماره تلفن</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                required
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">کد پستی</label>
              <Input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="۱۲۳۴۵۶۷۸۹۰"
                required
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">محل زندگی</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="آدرس کامل ارسال"
                required
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-pink-100 mb-6">
            <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
              <Upload size={18} className="text-pink" />
              عکس از انتقال وجه
            </h3>
            <p className="text-sm text-dark-300 mb-4">
              لطفاً عکس رسید انتقال وجه خود را آپلود کنید
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {receiptImage ? (
              <div className="relative">
                <img src={receiptImage} alt="رسید پرداخت" className="w-full max-h-64 object-contain rounded-xl border border-pink-100" />
                <button
                  type="button"
                  onClick={() => setReceiptImage('')}
                  className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-pink-200 rounded-xl p-8 text-center hover:border-pink-400 transition-colors"
              >
                <Upload size={32} className="mx-auto text-pink-300 mb-2" />
                <p className="text-dark-300">کلیک کنید تا تصویر رسید را انتخاب کنید</p>
                <p className="text-xs text-dark-300/50 mt-1">حداکثر حجم: ۳ مگابایت</p>
              </button>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting || !receiptImage || !phone || !postalCode || !address}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                در حال ثبت سفارش...
              </span>
            ) : (
              <>
                <CheckCircle size={18} className="ml-2" />
                ثبت سفارش
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
