import React from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import { useProducts } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import type { ViewType } from '@/types'

interface CartViewProps {
  onNavigate: (view: ViewType) => void
}

export default function CartView({ onNavigate }: CartViewProps) {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const { products } = useProducts()
  const total = getCartTotal(products)

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId)
    return { ...item, product }
  }).filter(item => item.product)

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ShoppingBag size={64} className="mx-auto text-pink-200 mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">سبد خرید خالی است</h2>
          <p className="text-dark-300 mb-6">محصولات مورد علاقه خود را به سبد اضافه کنید</p>
          <Button onClick={() => onNavigate('home')}>
            مشاهده محصولات
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-black text-dark mb-6"
      >
        سبد خرید ({cart.length} محصول)
      </motion.h2>

      <div className="space-y-4 mb-8">
        {cartItems.map(({ productId, quantity, product }) => (
          <motion.div
            key={productId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-4 flex gap-4 border border-pink-100 shadow-sm"
          >
            <img
              src={product!.imageUrls[0]}
              alt={product!.name}
              className="w-20 h-20 rounded-xl object-cover"
            />

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-dark truncate">{product!.name}</h3>
              <p className="text-pink font-medium">
                {product!.price.toLocaleString('fa-IR')} تومان
              </p>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center border border-pink-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(productId, quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-pink-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(productId, quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-pink-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-dark">
                    {(product!.price * quantity).toLocaleString('fa-IR')} تومان
                  </span>
                  <button
                    onClick={() => removeFromCart(productId)}
                    className="text-red-400 hover:text-red-500 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-dark-300">جمع کل:</span>
          <span className="text-2xl font-black text-pink">
            {total.toLocaleString('fa-IR')} تومان
          </span>
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={() => onNavigate('checkout')}
        >
          تکمیل خرید
        </Button>
      </div>
    </div>
  )
}
