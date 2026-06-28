import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, LogIn, Lock } from 'lucide-react'

export default function LoginScreen() {
  const { enter, savedUsername } = useAuth()
  const [username, setUsername] = useState(savedUsername)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)

    const result = await enter(username, password)
    if (!result.success) {
      setError(result.error || '')
    }
    setBusy(false)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block"
          >
            <div className="w-24 h-24 bg-pink rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-pink/30">
              <User size={40} className="text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-black text-dark mb-2">Sockuraaa</h1>
          <p className="text-dark-300">فروشگاه تخصصی جوراب</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-pink/5 border border-pink-100">
          <h2 className="text-xl font-bold text-dark mb-6 text-center">
            نام خود را وارد کنید
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">نام کاربری</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="نام کاربری خود را وارد کنید"
                className="text-center text-lg"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">رمز عبور</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-300" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور خود را وارد کنید"
                  className="text-center text-lg pl-10"
                  autoComplete="off"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 rounded-xl p-3">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={busy}>
              {busy ? 'لطفاً صبر کنید...' : (
                <>
                  <LogIn className="ml-2" size={18} />
                  ورود به سایت
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
