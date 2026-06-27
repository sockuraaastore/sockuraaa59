import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/product/ProductCard'
import { useCategories } from '@/hooks/useCategories'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  onViewDetail: (product: Product) => void
}

export default function ProductGrid({ products, onViewDetail }: ProductGridProps) {
  const { categories } = useCategories()
  const [activeCategory, setActiveCategory] = useState<string>('')

  const filteredProducts = activeCategory
    ? products.filter(p => p.category === activeCategory)
    : products

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-black text-dark mb-2">محصولات ما</h2>
        <p className="text-dark-300">مجموعه متنوع جوراب‌های با کیفیت</p>
      </motion.div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 justify-center flex-wrap">
        <button
          onClick={() => setActiveCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            activeCategory === ''
              ? 'bg-pink text-white shadow-lg shadow-pink/25'
              : 'bg-white text-dark border border-pink-200 hover:border-pink-400'
          }`}
        >
          همه
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeCategory === cat.name
                ? 'bg-pink text-white shadow-lg shadow-pink/25'
                : 'bg-white text-dark border border-pink-200 hover:border-pink-400'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} onViewDetail={onViewDetail} />
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-dark-300">محصولی در این دسته‌بندی یافت نشد</p>
        </div>
      )}
    </section>
  )
}
