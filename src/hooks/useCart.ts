import { useState, useCallback } from 'react'
import { CartItem, Product, STORAGE_KEYS } from '@/types'
import { getStorageItem, setStorageItem } from '@/store/localStorage'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() =>
    getStorageItem<CartItem[]>(STORAGE_KEYS.CART, [])
  )

  const refresh = useCallback(() => {
    setCart(getStorageItem<CartItem[]>(STORAGE_KEYS.CART, []))
  }, [])

  const addToCart = useCallback((productId: string, quantity: number): boolean => {
    const currentCart = getStorageItem<CartItem[]>(STORAGE_KEYS.CART, [])
    const existing = currentCart.find(c => c.productId === productId)

    if (existing) {
      existing.quantity += quantity
    } else {
      currentCart.push({
        productId,
        quantity,
        addedAt: new Date().toISOString(),
      })
    }

    setStorageItem(STORAGE_KEYS.CART, currentCart)
    refresh()
    return true
  }, [refresh])

  const updateQuantity = useCallback((productId: string, quantity: number): boolean => {
    const currentCart = getStorageItem<CartItem[]>(STORAGE_KEYS.CART, [])
    const idx = currentCart.findIndex(c => c.productId === productId)
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

  const removeFromCart = useCallback((productId: string) => {
    const currentCart = getStorageItem<CartItem[]>(STORAGE_KEYS.CART, [])
    setStorageItem(STORAGE_KEYS.CART, currentCart.filter(c => c.productId !== productId))
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
