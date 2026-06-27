import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import type { Banner } from '@/types'

interface BannerDetailProps {
  banner: Banner
  onBack: () => void
}

export default function BannerDetail({ banner, onBack }: BannerDetailProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={onBack} className="mb-6 gap-1">
        <ArrowRight size={16} />
        بازگشت
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white rounded-3xl overflow-hidden border border-pink-100 shadow-lg">
          <div className="aspect-video bg-dark relative overflow-hidden">
            <img
              src={banner.imageUrl}
              alt={banner.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 right-6">
              <h1 className="text-3xl lg:text-4xl font-black text-white">{banner.name}</h1>
            </div>
          </div>

          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              {banner.description.split('\n').map((paragraph, i) => (
                <p key={i} className="text-dark-300 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
