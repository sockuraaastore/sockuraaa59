import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBanners } from '@/hooks/useBanners'
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'
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
    return (
      <section className="relative overflow-hidden bg-dark min-h-[500px] lg:min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink/20 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-pink/10 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-right"
            >
              <div className="inline-flex items-center gap-2 bg-pink/10 rounded-full px-4 py-2 mb-6">
                <Sparkles size={16} className="text-pink" />
                <span className="text-pink text-sm font-medium">مجموعه جدید ۲۰۲۶</span>
              </div>

              <h2 className="text-5xl lg:text-7xl font-black text-cream leading-tight mb-6">
                جوراب
                <br />
                <span className="text-pink">مرغوب</span>
                <br />
                بپوشید
              </h2>

              <p className="text-cream/60 text-lg mb-8 max-w-md mx-auto lg:mx-0 lg:mr-0">
                بهترین کیفیت جوراب با طراحی‌های مدرن و متنوع. از جوراب روزمره تا مجلسی، همه اینجا پیدا می‌کنید.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center"
            >
              <div className="w-80 h-80 lg:w-96 lg:h-96 bg-pink/30 rounded-full flex items-center justify-center">
                <div className="w-64 h-64 lg:w-80 lg:h-80 bg-pink/50 rounded-full flex items-center justify-center">
                  <div className="text-8xl">🧦</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  const banner = banners[currentIndex]

  return (
    <section className="relative overflow-hidden bg-dark min-h-[500px] lg:min-h-[600px] flex items-center">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink/20 rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-6xl mx-auto px-4 w-full"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-right"
            >
              <h2 className="text-4xl lg:text-6xl font-black text-cream leading-tight mb-6">
                {banner.name}
              </h2>

              <p className="text-cream/60 text-lg mb-8 max-w-md mx-auto lg:mx-0">
                {banner.description.substring(0, 150)}...
              </p>

              <button
                onClick={() => onBannerClick(banner)}
                className="inline-flex items-center gap-2 bg-pink text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-500 transition-colors"
              >
                مشاهده بیشتر
                <ChevronLeft size={18} />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center"
            >
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-pink/30">
                <img
                  src={banner.imageUrl}
                  alt={banner.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-pink w-6' : 'bg-cream/30'
              }`}
            />
          ))}
        </div>
      )}

      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-cream/10 backdrop-blur-sm rounded-full flex items-center justify-center text-cream hover:bg-cream/20 transition-colors z-20"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-cream/10 backdrop-blur-sm rounded-full flex items-center justify-center text-cream hover:bg-cream/20 transition-colors z-20"
          >
            <ChevronLeft size={20} />
          </button>
        </>
      )}
    </section>
  )
}
