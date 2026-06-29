import React, { useRef, useState, useCallback } from 'react'
import { motion, MotionValue, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Home, Search, ShoppingCart, Headphones, LayoutDashboard, LogOut, PackageCheck, Info, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DockItem {
  icon: React.ReactNode
  label: string
  action: () => void
}

interface MagneticDockProps {
  items: DockItem[]
  activeIndex?: number
  className?: string
}

function DockIcon({
  mouseX,
  item,
  isActive,
}: {
  mouseX: MotionValue<number>
  item: DockItem
  isActive: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val: number) => {
    if (!ref.current) return 150
    const bounds = ref.current.getBoundingClientRect()
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(distance, [-150, 0, 150], [36, 48, 36])
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 })

  const [showLabel, setShowLabel] = useState(false)

  const handleTouchStart = useCallback(() => {
    setShowLabel(true)
  }, [])

  const handleTouchEnd = useCallback(() => {
    setTimeout(() => setShowLabel(false), 800)
  }, [])

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={item.action}
      className={cn(
        'relative flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200',
        isActive
          ? 'bg-pink text-white shadow-lg shadow-pink/30'
          : 'bg-dark-200 text-cream hover:bg-dark-300'
      )}
    >
      <motion.div className="flex items-center justify-center">
        {item.icon}
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          opacity: showLabel ? 1 : 0,
          y: showLabel ? 0 : 8,
          scale: showLabel ? 1 : 0.8,
        }}
        transition={{ duration: 0.15 }}
        className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-dark-100 px-3 py-1.5 text-xs font-medium text-cream shadow-lg pointer-events-none"
      >
        {item.label}
      </motion.div>
    </motion.div>
  )
}

export default function MagneticDock({ items, activeIndex = 0, className }: MagneticDockProps) {
  const mouseX = useMotionValue(Infinity) as MotionValue<number>

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      initial={{ y: 100, x: '-50%', opacity: 0 }}
      animate={{ y: 0, x: '-50%', opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.3 }}
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'flex items-end gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3',
        'max-w-[calc(100vw-2rem)] overflow-x-auto touch-scroll',
        'rounded-2xl backdrop-blur-xl bg-dark-100/80 border border-white/10',
        'shadow-2xl shadow-black/20',
        className
      )}
    >
      {items.map((item, i) => (
        <DockIcon
          key={i}
          mouseX={mouseX}
          item={item}
          isActive={activeIndex === i}
        />
      ))}
    </motion.div>
  )
}

export function createDockItems(handlers: {
  onHome: () => void
  onSearch: () => void
  onCart: () => void
  onPurchases: () => void
  onArticles: () => void
  onAbout: () => void
  onSupport: () => void
  onAdmin?: () => void
  onLogout?: () => void
}): DockItem[] {
  const items: DockItem[] = [
    { icon: <Home size={20} />, label: 'خانه', action: handlers.onHome },
    { icon: <Search size={20} />, label: 'جستجو', action: handlers.onSearch },
    { icon: <ShoppingCart size={20} />, label: 'سبد خرید', action: handlers.onCart },
    { icon: <PackageCheck size={20} />, label: 'خریدها', action: handlers.onPurchases },
    { icon: <BookOpen size={20} />, label: 'مقالات', action: handlers.onArticles },
    { icon: <Info size={20} />, label: 'درباره ما', action: handlers.onAbout },
    { icon: <Headphones size={20} />, label: 'پشتیبانی', action: handlers.onSupport },
  ]

  if (handlers.onAdmin) {
    items.push({ icon: <LayoutDashboard size={20} />, label: 'ادمین', action: handlers.onAdmin })
  }

  if (handlers.onLogout) {
    items.push({ icon: <LogOut size={20} />, label: 'خروج', action: handlers.onLogout })
  }

  return items
}
