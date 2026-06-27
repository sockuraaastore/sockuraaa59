import React, { useState, useCallback, useEffect, createContext } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'

const DEVICE_KEY = 'sockuraaa_device_username'

interface AuthState {
  currentUser: User | null
  loading: boolean
  savedUsername: string
  enter: (username: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  activateAdmin: (code: string) => Promise<boolean>
}

export const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [savedUsername, setSavedUsername] = useState(() => localStorage.getItem(DEVICE_KEY) || '')

  const enter = useCallback(async (username: string) => {
    const t = username.trim()
    if (!t) return { success: false, error: 'نام کاربری را وارد کنید' }

    const stored = localStorage.getItem(DEVICE_KEY)
    if (stored && stored !== t) {
      return { success: false, error: 'این دستگاه قبلاً با نام «' + stored + '» وارد شده است. امکان تغییر نام وجود ندارد.' }
    }

    const { data: existing } = await supabase.from('users').select('*').eq('username', t).maybeSingle()
    if (existing) {
      localStorage.setItem(DEVICE_KEY, t)
      setSavedUsername(t)
      setCurrentUser(existing as User)
      return { success: true }
    }

    const id = crypto.randomUUID()
    const { error } = await supabase.from('users').insert({ id, username: t, is_admin: false })
    if (error) return { success: false, error: error.message }

    localStorage.setItem(DEVICE_KEY, t)
    setSavedUsername(t)
    const { data: profile } = await supabase.from('users').select('*').eq('id', id).single()
    setCurrentUser(profile as User | null)
    return { success: true }
  }, [])

  const logout = useCallback(async () => {
    localStorage.removeItem(DEVICE_KEY)
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
    if (stored) {
      enter(stored).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [enter])

  return (
    <AuthContext.Provider value={{ currentUser, loading, savedUsername, enter, logout, activateAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}
