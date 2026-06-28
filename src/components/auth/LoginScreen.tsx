import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, LogIn, Lock, UserPlus } from 'lucide-react'

type Mode = 'login' | 'register'

export default function LoginScreen() {
  const { register, login, savedUsername } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState(savedUsername)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)

    const result = mode === 'register'
      ? await register(username, password)
      : await login(username, password)

    if (!result.success) {
      setError(result.error || '')
    }
    setBusy(false)
  }

  const switchMode = (newMode: Mode) => {
    setMode(newMode)
    setError('')
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
          <div className="flex mb-6 bg-cream rounded-2xl p-1">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === 'login'
                  ? 'bg-pink text-white shadow-md'
                  : 'text-dark-300 hover:text-dark'
              }`}
            >
              ورود
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === 'register'
                  ? 'bg-pink text-white shadow-md'
                  : 'text-dark-300 hover:text-dark'
              }`}
            >
              ثبت‌نام
            </button>
          </div>

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
                mode === 'register' ? (
                  <>
                    <UserPlus className="ml-2" size={18} />
                    ثبت‌نام
                  </>
                ) : (
                  <>
                    <LogIn className="ml-2" size={18} />
                    ورود به سایت
                  </>
                )
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
