import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shield, X } from 'lucide-react'

interface AdminGateProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AdminGate({ isOpen, onClose, onSuccess }: AdminGateProps) {
  const { activateAdmin } = useAuth()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (await activateAdmin(code)) {
      setCode('')
      onSuccess()
    } else {
      setError('کد نامعتبر است')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-pink" />
                <h3 className="text-lg font-bold text-dark">فعال سازی ادمین</h3>
              </div>
              <button onClick={onClose} className="text-dark-300 hover:text-dark">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="کد محرمانه را وارد کنید"
                className="text-center tracking-widest text-lg"
              />

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 rounded-xl p-3">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" variant="default">
                فعال سازی
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
