import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product, ProductSize } from '@/types'

function mapProduct(r: Record<string, unknown>, sizes: ProductSize[] = []): Product {
  const cat = r.category
  const categoryArray = Array.isArray(cat) ? cat : (typeof cat === 'string' && cat ? [cat] : [])
  return { id: r.id as string, name: r.name as string, description: r.description as string, price: r.price as number, stockQuantity: r.stock_quantity as number, imageUrls: (r.image_urls as string[]) ?? [], category: categoryArray as string[], sizes, createdAt: r.created_at as string }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const refresh = useCallback(async () => {
    const { data: productsData } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    const { data: sizesData } = await supabase.from('product_sizes').select('*')

    const sizesByProduct = new Map<string, ProductSize[]>()
    if (sizesData) {
      for (const s of sizesData) {
        const ps: ProductSize = { id: s.id as string, productId: s.product_id as string, sizeName: s.size_name as string, stockQuantity: s.stock_quantity as number, createdAt: s.created_at as string }
        const existing = sizesByProduct.get(ps.productId) || []
        existing.push(ps)
        sizesByProduct.set(ps.productId, existing)
      }
    }

    setProducts((productsData || []).map(p => mapProduct(p, sizesByProduct.get(p.id as string) || [])))
  }, [])
  useEffect(() => { refresh() }, [refresh])

  const addProduct = useCallback(async (data: Omit<Product, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> => {
    const { data: newProduct, error } = await supabase.from('products').insert({ name: data.name, description: data.description, price: data.price, stock_quantity: data.stockQuantity, image_urls: data.imageUrls, category: data.category }).select('id').single()
    if (error) { console.error('addProduct failed:', error.message); return { success: false, error: error.message } }

    if (data.sizes && data.sizes.length > 0) {
      const { error: sizesError } = await supabase.from('product_sizes').insert(
        data.sizes.map(s => ({ product_id: newProduct.id, size_name: s.sizeName, stock_quantity: s.stockQuantity }))
      )
      if (sizesError) { console.error('addProduct sizes failed:', sizesError.message) }
    }

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

    if (data.sizes !== undefined) {
      await supabase.from('product_sizes').delete().eq('product_id', id)
      if (data.sizes.length > 0) {
        const { error: sizesError } = await supabase.from('product_sizes').insert(
          data.sizes.map(s => ({ product_id: id, size_name: s.sizeName, stock_quantity: s.stockQuantity }))
        )
        if (sizesError) { console.error('updateProduct sizes failed:', sizesError.message) }
      }
    }

    await refresh(); return { success: true }
  }, [refresh])

  const deleteProduct = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { console.error('deleteProduct failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])

  const deductStock = useCallback(async (productId: string, quantity: number, sizeName?: string): Promise<{ success: boolean; error?: string }> => {
    const p = products.find(x => x.id === productId)
    if (!p) return { success: false, error: 'محصول یافت نشد' }

    if (sizeName && p.sizes.length > 0) {
      const size = p.sizes.find(s => s.sizeName === sizeName)
      if (!size) return { success: false, error: 'سایز یافت نشد' }
      const newQty = Math.max(0, size.stockQuantity - quantity)
      const { error } = await supabase.from('product_sizes').update({ stock_quantity: newQty }).eq('product_id', productId).eq('size_name', sizeName)
      if (error) { console.error('deductStock size failed:', error.message); return { success: false, error: error.message } }
    } else {
      const newQty = Math.max(0, p.stockQuantity - quantity)
      const { error } = await supabase.from('products').update({ stock_quantity: newQty }).eq('id', productId)
      if (error) { console.error('deductStock failed:', error.message); return { success: false, error: error.message } }
      setProducts(prev => prev.map(x => x.id === productId ? { ...x, stockQuantity: newQty } : x))
    }

    await refresh()
    return { success: true }
  }, [products, refresh])

  return { products, addProduct, updateProduct, deleteProduct, deductStock, refresh }
}