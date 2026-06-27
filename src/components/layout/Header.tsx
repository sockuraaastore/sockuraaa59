import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import AdminGate from '@/components/auth/AdminGate'
import { Shield, ChevronLeft, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ViewType } from '@/types'

interface HeaderProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
}

export default function Header({ currentView, onNavigate }: HeaderProps) {
  const { currentUser } = useAuth()
  const { cart } = useCart()
  const [showAdminGate, setShowAdminGate] = useState(false)

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleAdminSuccess = () => {
    setShowAdminGate(false)
    onNavigate('admin')
  }

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              <h1 className="text-xl font-black text-dark">
                <span className="text-pink">Sock</span>uraaa
              </h1>
            </motion.div>
          </div>

          <div className="flex items-center gap-2">
            {currentView !== 'home' && currentView !== 'admin' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('home')}
                className="gap-1"
              >
                <ChevronLeft size={16} />
                خانه
              </Button>
            )}

            <button
              onClick={() => onNavigate('cart')}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-dark-300 hover:text-pink hover:bg-pink-50 transition-all"
              title="سبد خرید"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                  {cartCount}
                </span>
              )}
            </button>

            {currentUser && (
              <span className="text-sm text-dark-300 hidden sm:block">
                {currentUser.username}
              </span>
            )}

            <button
              onClick={() => setShowAdminGate(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-dark-300 hover:text-pink hover:bg-pink-50 transition-all"
              title="فعال سازی ادمین"
            >
              <Shield size={16} />
            </button>
          </div>
        </div>
      </header>

      <AdminGate
        isOpen={showAdminGate}
        onClose={() => setShowAdminGate(false)}
        onSuccess={handleAdminSuccess}
      />
    </>
  )
}
