import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/product/ProductCard'
import { useCategories } from '@/hooks/useCategories'
import { useSizes } from '@/hooks/useSizes'
import { useGenderAges } from '@/hooks/useGenderAges'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  onViewDetail: (product: Product) => void
}

export default function ProductGrid({ products, onViewDetail }: ProductGridProps) {
  const { categories } = useCategories()
  const { sizes } = useSizes()
  const { genderAges } = useGenderAges()
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [activeSize, setActiveSize] = useState<string>('')
  const [activeGenderAge, setActiveGenderAge] = useState<string>('')

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory
      ? (Array.isArray(p.category) ? p.category.includes(activeCategory) : p.category === activeCategory)
      : true

    const matchesSize = activeSize
      ? p.sizes.some(s => s.sizeName === activeSize && s.stockQuantity > 0)
      : true

    const matchesGenderAge = activeGenderAge
      ? (Array.isArray(p.genderAge) ? p.genderAge.includes(activeGenderAge) : p.genderAge === activeGenderAge)
      : true

    return matchesCategory && matchesSize && matchesGenderAge
  })

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

      <div className="flex gap-2 overflow-x-auto touch-scroll pb-4 mb-4 flex-nowrap justify-start md:justify-center">
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

      {sizes.length > 0 && (
        <div className="flex gap-2 overflow-x-auto touch-scroll pb-4 mb-8 flex-nowrap justify-start md:justify-center">
          <button
            onClick={() => setActiveSize('')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              activeSize === ''
                ? 'bg-pink text-white shadow-lg shadow-pink/25'
                : 'bg-white text-dark border border-pink-200 hover:border-pink-400'
            }`}
          >
            همه سایزها
          </button>
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => setActiveSize(size.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeSize === size.name
                  ? 'bg-pink text-white shadow-lg shadow-pink/25'
                  : 'bg-white text-dark border border-pink-200 hover:border-pink-400'
              }`}
            >
              {size.name}
            </button>
          ))}
        </div>
      )}

      {genderAges.length > 0 && (
        <div className="flex gap-2 overflow-x-auto touch-scroll pb-4 mb-8 flex-nowrap justify-start md:justify-center">
          <button
            onClick={() => setActiveGenderAge('')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              activeGenderAge === ''
                ? 'bg-pink text-white shadow-lg shadow-pink/25'
                : 'bg-white text-dark border border-pink-200 hover:border-pink-400'
            }`}
          >
            همه
          </button>
          {genderAges.map((ga) => (
            <button
              key={ga.id}
              onClick={() => setActiveGenderAge(ga.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeGenderAge === ga.name
                  ? 'bg-pink text-white shadow-lg shadow-pink/25'
                  : 'bg-white text-dark border border-pink-200 hover:border-pink-400'
              }`}
            >
              {ga.name}
            </button>
          ))}
        </div>
      )}

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