import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'

function mapProduct(r: Record<string, unknown>): Product {
  const cat = r.category
  const categoryArray = Array.isArray(cat) ? cat : (typeof cat === 'string' && cat ? [cat] : [])
  return { id: r.id as string, name: r.name as string, description: r.description as string, price: r.price as number, stockQuantity: r.stock_quantity as number, imageUrls: (r.image_urls as string[]) ?? [], category: categoryArray as string[], createdAt: r.created_at as string }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const refresh = useCallback(async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts((data || []).map(mapProduct))
  }, [])
  useEffect(() => { refresh() }, [refresh])

  const addProduct = useCallback(async (data: Omit<Product, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('products').insert({ name: data.name, description: data.description, price: data.price, stock_quantity: data.stockQuantity, image_urls: data.imageUrls, category: data.category })
    if (error) { console.error('addProduct failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])

  const updateProduct = useCallback(async (id: string, data: Partial<Product>): Promise<{ success: boolean; error?: string }> => {
    const u: Record<string, unknown> = {}
    if (data.name !== undefined) u.name = data.name
    if (data.description !== undefined) u.description = data.description
    if (data.price !== undefined) u.price = data.price
    if (data.stockQuantity !== undefined) u.stock_quantity = data.stockQuantity
    if (data.imageUrls !== undefined) u.image_urls = data.imageUrls
    if (data.category !== undefined) u.category = data.category
    const { error } = await supabase.from('products').update(u).eq('id', id)
    if (error) { console.error('updateProduct failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])

  const deleteProduct = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { console.error('deleteProduct failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])

  const deductStock = useCallback(async (productId: string, quantity: number): Promise<{ success: boolean; error?: string }> => {
    const p = products.find(x => x.id === productId); if (!p) return { success: false, error: 'محصول یافت نشد' }
    const { error } = await supabase.from('products').update({ stock_quantity: Math.max(0, p.stockQuantity - quantity) }).eq('id', productId)
    if (error) { console.error('deductStock failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [products, refresh])

  return { products, addProduct, updateProduct, deleteProduct, deductStock, refresh }
}
