import { useState, useCallback } from 'react'
import { CartItem, Product, STORAGE_KEYS } from '@/types'
import { getStorageItem, setStorageItem } from '@/store/localStorage'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() =>
    getStorageItem<CartItem[]>(STORAGE_KEYS.CART, []).map(item => ({
      ...item,
      sizeName: item.sizeName || ''
    }))
  )

  const refresh = useCallback(() => {
    setCart(getStorageItem<CartItem[]>(STORAGE_KEYS.CART, []).map(item => ({
      ...item,
      sizeName: item.sizeName || ''
    })))
  }, [])

  const addToCart = useCallback((productId: string, quantity: number, sizeName: string): boolean => {
    const currentCart = getStorageItem<CartItem[]>(STORAGE_KEYS.CART, []).map(item => ({
      ...item,
      sizeName: item.sizeName || ''
    }))
    const existing = currentCart.find(c => c.productId === productId && c.sizeName === sizeName)

    if (existing) {
      existing.quantity += quantity
    } else {
      currentCart.push({
        productId,
        sizeName,
        quantity,
        addedAt: new Date().toISOString(),
      })
    }

    setStorageItem(STORAGE_KEYS.CART, currentCart)
    refresh()
    return true
  }, [refresh])

  const updateQuantity = useCallback((productId: string, sizeName: string, quantity: number): boolean => {
    const currentCart = getStorageItem<CartItem[]>(STORAGE_KEYS.CART, []).map(item => ({
      ...item,
      sizeName: item.sizeName || ''
    }))
    const idx = currentCart.findIndex(c => c.productId === productId && c.sizeName === sizeName)
    if (idx !== -1) {
      if (quantity <= 0) {
        currentCart.splice(idx, 1)
      } else {
        currentCart[idx].quantity = quantity
      }
    }

    setStorageItem(STORAGE_KEYS.CART, currentCart)
    refresh()
    return true
  }, [refresh])

  const removeFromCart = useCallback((productId: string, sizeName: string) => {
    const currentCart = getStorageItem<CartItem[]>(STORAGE_KEYS.CART, []).map(item => ({
      ...item,
      sizeName: item.sizeName || ''
    }))
    setStorageItem(STORAGE_KEYS.CART, currentCart.filter(c => !(c.productId === productId && c.sizeName === sizeName)))
    refresh()
  }, [refresh])

  const clearCart = useCallback(() => {
    setStorageItem(STORAGE_KEYS.CART, [])
    refresh()
  }, [refresh])

  const getCartTotal = useCallback((products: Product[]): number => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId)
      return total + (product ? product.price * item.quantity : 0)
    }, 0)
  }, [cart])

  return { cart, addToCart, updateQuantity, removeFromCart, clearCart, getCartTotal, refresh }
}