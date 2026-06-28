import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onViewDetail: (product: Product) => void
}

export default function ProductCard({ product, onViewDetail }: ProductCardProps) {
  const totalStock = product.sizes.length > 0
    ? product.sizes.reduce((sum, s) => sum + s.stockQuantity, 0)
    : product.stockQuantity

  const isOutOfStock = totalStock === 0
  const isLowStock = totalStock > 0 && totalStock <= 5

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
            <Badge variant="warning">{totalStock} تا مونده</Badge>
          )}
          {!isOutOfStock && !isLowStock && (
            <Badge variant="stock">{totalStock} موجود</Badge>
          )}
        </div>

        <Badge variant="secondary" className="absolute top-3 left-3">
          {Array.isArray(product.category) ? product.category.join('، ') : product.category}
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

        {product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.sizes.map(s => (
              <Badge key={s.sizeName} variant={s.stockQuantity > 0 ? 'outline' : 'outOfStock'} className="text-[10px]">
                {s.sizeName}
              </Badge>
            ))}
          </div>
        )}

        <button
          onClick={() => onViewDetail(product)}
          disabled={isOutOfStock}
          className="inline-flex items-center justify-center h-9 rounded-lg px-4 text-sm w-full gap-2 bg-pink text-white hover:bg-pink-500 shadow-lg shadow-pink/25 transition-colors"
        >
          <Eye size={16} />
          مشاهده و افزودن به سبد خرید
        </button>
      </div>
    </motion.div>
  )
}