import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBanners } from '@/hooks/useBanners'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import type { Banner } from '@/types'

interface HeroBannerProps {
  onBannerClick: (banner: Banner) => void
}

export default function HeroBanner({ onBannerClick }: HeroBannerProps) {
  const { getActiveBanners } = useBanners()
  const banners = getActiveBanners()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  if (banners.length === 0) {
    return null
  }

  const banner = banners[currentIndex]

  return (
    <section className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full aspect-[16/5]"
        >
          <img
            src={banner.imageUrl}
            alt={banner.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-pink w-6' : 'bg-dark/20'
              }`}
            />
          ))}
        </div>
      )}

      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-dark/10 backdrop-blur-sm rounded-full flex items-center justify-center text-dark hover:bg-dark/20 transition-colors z-20"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-dark/10 backdrop-blur-sm rounded-full flex items-center justify-center text-dark hover:bg-dark/20 transition-colors z-20"
          >
            <ChevronLeft size={20} />
          </button>
        </>
      )}
    </section>
  )
}
