import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus, Eye } from 'lucide-react'
import type { Product } from '@/types'
import { useCart } from '@/hooks/useCart'

interface ProductCardProps {
  product: Product
  onViewDetail: (product: Product) => void
}

export default function ProductCard({ product, onViewDetail }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const isOutOfStock = product.stockQuantity === 0
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5

  const handleAddToCart = () => {
    const success = addToCart(product.id, quantity)
    if (success) {
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-pink/5 border border-pink-100 hover:shadow-xl hover:shadow-pink/10 transition-all duration-300"
    >
      <div className="relative">
        <div className="aspect-square overflow-hidden bg-pink-50">
          <img
            src={product.imageUrls?.[0] || ''}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {(product.imageUrls?.length ?? 0) > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {(product.imageUrls ?? []).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60" />
            ))}
          </div>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {isOutOfStock && (
            <Badge variant="outOfStock">تموم شده</Badge>
          )}
          {isLowStock && (
            <Badge variant="warning">{product.stockQuantity} تا مونده</Badge>
          )}
          {!isOutOfStock && !isLowStock && (
            <Badge variant="stock">{product.stockQuantity} موجود</Badge>
          )}
        </div>

        <Badge variant="secondary" className="absolute top-3 left-3">
          {product.category}
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-dark text-lg mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-dark-300 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-black text-pink">
              {product.price.toLocaleString('fa-IR')}
            </span>
            <span className="text-sm text-dark-300 mr-1">تومان</span>
          </div>
        </div>

        {!isOutOfStock && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-dark-300">تعداد:</span>
            <div className="flex items-center border border-pink-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-pink-50 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center font-medium text-dark">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-pink-50 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetail(product)}
            className="flex-1 gap-1"
          >
            <Eye size={14} />
            مشاهده
          </Button>

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock || added}
            className="flex-1 gap-1"
          >
            <ShoppingCart size={14} />
            {added ? 'اضافه شد!' : 'افزودن'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
