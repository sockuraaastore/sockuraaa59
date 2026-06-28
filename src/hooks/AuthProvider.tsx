import React, { useState, useCallback, useEffect, createContext } from 'react'
import { supabase } from '@/lib/supabase'
import { hashPassword } from '@/lib/crypto'
import type { User } from '@/types'

const DEVICE_KEY = 'sockuraaa_device_username'

interface AuthState {
  currentUser: User | null
  loading: boolean
  savedUsername: string
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  activateAdmin: (code: string) => Promise<boolean>
}

export const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [savedUsername, setSavedUsername] = useState(() => localStorage.getItem(DEVICE_KEY) || '')

  const checkDevice = (t: string) => {
    const stored = localStorage.getItem(DEVICE_KEY)
    if (stored && stored !== t) {
      return { success: false, error: 'این دستگاه قبلاً با نام «' + stored + '» وارد شده است. امکان تغییر نام وجود ندارد.' }
    }
    return null
  }

  const register = useCallback(async (username: string, password: string) => {
    const t = username.trim()
    const p = password.trim()
    if (!t) return { success: false, error: 'نام کاربری را وارد کنید' }
    if (!p) return { success: false, error: 'رمز عبور را وارد کنید' }

    const deviceError = checkDevice(t)
    if (deviceError) return deviceError

    const { data: existing } = await supabase.from('users').select('id').eq('username', t).maybeSingle()
    if (existing) {
      return { success: false, error: 'این نام کاربری قبلاً ثبت شده است. لطفاً وارد شوید.' }
    }

    const passwordHash = await hashPassword(p)
    const id = crypto.randomUUID()
    const { error } = await supabase.from('users').insert({ id, username: t, is_admin: false, password_hash: passwordHash })
    if (error) return { success: false, error: error.message }

    localStorage.setItem(DEVICE_KEY, t)
    localStorage.setItem(DEVICE_KEY + '_hash', passwordHash)
    setSavedUsername(t)
    const { data: profile } = await supabase.from('users').select('*').eq('id', id).single()
    setCurrentUser(profile as User | null)
    return { success: true }
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const t = username.trim()
    const p = password.trim()
    if (!t) return { success: false, error: 'نام کاربری را وارد کنید' }
    if (!p) return { success: false, error: 'رمز عبور را وارد کنید' }

    const deviceError = checkDevice(t)
    if (deviceError) return deviceError

    const passwordHash = await hashPassword(p)

    const { data: existing } = await supabase.from('users').select('*').eq('username', t).maybeSingle()
    if (!existing) {
      return { success: false, error: 'کاربری با این نام یافت نشد. لطفاً ابتدا ثبت‌نام کنید.' }
    }

    if (existing.password_hash !== passwordHash) {
      return { success: false, error: 'رمز عبور اشتباه است' }
    }

    localStorage.setItem(DEVICE_KEY, t)
    localStorage.setItem(DEVICE_KEY + '_hash', passwordHash)
    setSavedUsername(t)
    setCurrentUser(existing as User)
    return { success: true }
  }, [])

  const logout = useCallback(async () => {
    localStorage.removeItem(DEVICE_KEY)
    localStorage.removeItem(DEVICE_KEY + '_hash')
    setSavedUsername('')
    setCurrentUser(null)
  }, [])

  const activateAdmin = useCallback(async (code: string) => {
    if (code !== '13911400' || !currentUser) return false
    const { error } = await supabase.from('users').update({ is_admin: true }).eq('id', currentUser.id)
    if (error) return false
    setCurrentUser({ ...currentUser, isAdmin: true })
    return true
  }, [currentUser])

  useEffect(() => {
    const stored = localStorage.getItem(DEVICE_KEY)
    const storedHash = localStorage.getItem(DEVICE_KEY + '_hash')
    if (stored && storedHash) {
      // Re-authenticate using stored password hash
      const reAuth = async () => {
        const { data: user } = await supabase.from('users').select('*').eq('username', stored).maybeSingle()
        if (user && user.password_hash === storedHash) {
          setCurrentUser(user as User)
        } else {
          localStorage.removeItem(DEVICE_KEY)
          localStorage.removeItem(DEVICE_KEY + '_hash')
          setSavedUsername('')
        }
      }
      reAuth().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, loading, savedUsername, register, login, logout, activateAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}
