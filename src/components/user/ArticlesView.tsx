import React from 'react'
import { motion } from 'framer-motion'
import { useArticles } from '@/hooks/useArticles'
import { BookOpen } from 'lucide-react'
import type { Article } from '@/types'

interface ArticlesViewProps {
  onViewDetail: (article: Article) => void
}

export default function ArticlesView({ onViewDetail }: ArticlesViewProps) {
  const { getActiveArticles } = useArticles()
  const articles = getActiveArticles()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <BookOpen size={28} className="text-pink" />
        <h1 className="text-3xl font-black text-dark">مقالات و آموزش‌ها</h1>
      </motion.div>

      {articles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-pink-100 shadow-lg p-12 text-center"
        >
          <BookOpen size={48} className="mx-auto text-dark-300 mb-4" />
          <p className="text-dark-300 text-lg">هنوز مقاله‌ای منتشر نشده است</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onViewDetail(article)}
              className="bg-white rounded-2xl overflow-hidden border border-pink-100 shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                {article.videoUrl && (
                  <div className="absolute bottom-2 left-2 bg-pink text-white text-xs px-2 py-1 rounded-full">
                    ویدیو دارد
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-dark text-lg mb-2">{article.title}</h3>
                <p className="text-sm text-dark-300 line-clamp-2">{article.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
