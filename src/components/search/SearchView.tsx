import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/product/ProductCard'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { Product, ViewType } from '@/types'

interface SearchViewProps {
  onViewDetail: (product: Product) => void
}

export default function SearchView({ onViewDetail }: SearchViewProps) {
  const { products } = useProducts()
  const [query, setQuery] = useState('')

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products
    const searchTerm = query.trim().toLowerCase()
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      (Array.isArray(p.category) && p.category.some(c => c.toLowerCase().includes(searchTerm))) ||
      p.sizes.some(s => s.sizeName.toLowerCase().includes(searchTerm))
    )
  }, [products, query])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-black text-dark mb-4">جستجو</h2>
        <div className="relative">
          <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-300" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="نام جوراب مورد نظر را جستجو کنید..."
            className="pl-10 pr-12 h-12 text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300 hover:text-dark"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </motion.div>

      {query && (
        <p className="text-dark-300 mb-4">
          {filteredProducts.length} نتیجه برای "{query}" یافت شد
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard product={product} onViewDetail={onViewDetail} />
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && query && (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto text-pink-200 mb-4" />
          <p className="text-dark-300">هیچ محصولی یافت نشد</p>
        </div>
      )}
    </div>
  )
}
