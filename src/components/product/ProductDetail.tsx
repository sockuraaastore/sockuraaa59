import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CommentSection from './CommentSection'
import { ShoppingCart, Plus, Minus, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/types'

interface ProductDetailProps {
  product: Product
  onBack: () => void
}

export default function ProductDetail({ product, onBack }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const isOutOfStock = product.stockQuantity === 0

  const handleAddToCart = () => {
    const success = addToCart(product.id, quantity)
    if (success) {
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  const totalPrice = product.price * quantity

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 gap-1"
      >
        <ArrowRight size={16} />
        بازگشت
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="aspect-square rounded-3xl overflow-hidden bg-pink-50 border border-pink-100 relative">
            <img
              src={product.imageUrls[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {product.imageUrls.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-dark hover:bg-white transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev + 1) % product.imageUrls.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-dark hover:bg-white transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
              </>
            )}
          </div>

          {product.imageUrls.length > 1 && (
            <div className="flex gap-2 mt-3 justify-center">
              {product.imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    index === activeImageIndex ? 'border-pink' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <Badge variant="secondary" className="w-fit mb-4">
            {Array.isArray(product.category) ? product.category.join('، ') : product.category}
          </Badge>

          <h1 className="text-3xl font-black text-dark mb-4">{product.name}</h1>

          <p className="text-dark-300 mb-6 leading-relaxed">{product.description}</p>

          <div className="mb-6">
            {isOutOfStock ? (
              <Badge variant="outOfStock" className="text-base px-4 py-1">تموم شده</Badge>
            ) : product.stockQuantity <= 5 ? (
              <Badge variant="warning" className="text-base px-4 py-1">{product.stockQuantity} تا مونده</Badge>
            ) : (
              <Badge variant="stock" className="text-base px-4 py-1">{product.stockQuantity} عدد موجود</Badge>
            )}
          </div>

          <div className="mb-6">
            <span className="text-4xl font-black text-pink">
              {totalPrice.toLocaleString('fa-IR')}
            </span>
            <span className="text-dark-300 mr-2">تومان</span>
            {quantity > 1 && (
              <p className="text-sm text-dark-300 mt-1">
                {quantity} × {product.price.toLocaleString('fa-IR')} تومان
              </p>
            )}
          </div>

          {!isOutOfStock && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-dark mb-2">تعداد:</label>
              <div className="flex items-center border-2 border-pink-200 rounded-xl w-fit overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-pink-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-bold text-dark text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-pink-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={isOutOfStock || added}
            className="w-full gap-2"
          >
            <ShoppingCart size={20} />
            {added ? 'با موفقیت اضافه شد!' : 'افزودن به سبد خرید'}
          </Button>
        </motion.div>
      </div>

      <CommentSection productId={product.id} />
    </div>
  )
}
