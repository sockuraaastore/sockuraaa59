import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { ProductSize } from '@/types'

function mapProductSize(r: Record<string, unknown>): ProductSize {
  return { id: r.id as string, productId: r.product_id as string, sizeName: r.size_name as string, stockQuantity: r.stock_quantity as number, createdAt: r.created_at as string }
}

export function useProductSizes() {
  const getSizesForProduct = useCallback(async (productId: string): Promise<ProductSize[]> => {
    const { data } = await supabase.from('product_sizes').select('*').eq('product_id', productId)
    return (data || []).map(mapProductSize)
  }, [])

  const setProductSizes = useCallback(async (productId: string, sizes: { sizeName: string; stockQuantity: number }[]): Promise<{ success: boolean; error?: string }> => {
    const { error: deleteError } = await supabase.from('product_sizes').delete().eq('product_id', productId)
    if (deleteError) { console.error('setProductSizes delete failed:', deleteError.message); return { success: false, error: deleteError.message } }

    if (sizes.length > 0) {
      const { error: insertError } = await supabase.from('product_sizes').insert(
        sizes.map(s => ({ product_id: productId, size_name: s.sizeName, stock_quantity: s.stockQuantity }))
      )
      if (insertError) { console.error('setProductSizes insert failed:', insertError.message); return { success: false, error: insertError.message } }
    }

    return { success: true }
  }, [])

  const getStockForProductSize = useCallback(async (productId: string, sizeName: string): Promise<number> => {
    const { data } = await supabase.from('product_sizes').select('stock_quantity').eq('product_id', productId).eq('size_name', sizeName).single()
    return data?.stock_quantity ?? 0
  }, [])

  const deductSizeStock = useCallback(async (productId: string, sizeName: string, quantity: number): Promise<{ success: boolean; error?: string }> => {
    const { data: current } = await supabase.from('product_sizes').select('stock_quantity').eq('product_id', productId).eq('size_name', sizeName).single()
    if (!current) return { success: false, error: 'سایز یافت نشد' }

    const newQty = Math.max(0, current.stock_quantity - quantity)
    const { error } = await supabase.from('product_sizes').update({ stock_quantity: newQty }).eq('product_id', productId).eq('size_name', sizeName)
    if (error) { console.error('deductSizeStock failed:', error.message); return { success: false, error: error.message } }
    return { success: true }
  }, [])

  return { getSizesForProduct, setProductSizes, getStockForProductSize, deductSizeStock }
}