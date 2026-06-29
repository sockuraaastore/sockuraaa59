import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Article } from '@/types'

interface ArticleDetailProps {
  article: Article
  onBack: () => void
}

function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return `https://www.youtube.com/embed/${match[1]}`
  }
  return null
}

export default function ArticleDetail({ article, onBack }: ArticleDetailProps) {
  const embedUrl = article.videoUrl ? getYouTubeEmbedUrl(article.videoUrl) : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Button variant="ghost" onClick={onBack} className="gap-2 mb-4">
          <ArrowRight size={16} />
          بازگشت به مقالات
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-pink-100 shadow-lg overflow-hidden"
      >
        <div className="aspect-video relative">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8">
          <h1 className="text-3xl font-black text-dark mb-6" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
            {article.title}
          </h1>

          <div className="text-dark-300 leading-relaxed text-justify whitespace-pre-wrap" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
            {article.description}
          </div>

          {embedUrl && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-dark mb-4">ویدیوی مرتبط</h3>
              <div className="aspect-video rounded-xl overflow-hidden border border-pink-100">
                <iframe
                  src={embedUrl}
                  title={article.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {article.videoUrl && !embedUrl && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-dark mb-4">ویدیوی مرتبط</h3>
              <a
                href={article.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-pink underline hover:text-pink/80"
              >
                مشاهده ویدیو
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
