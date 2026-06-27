import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Order } from '@/types'

function mapOrder(r: Record<string, unknown>): Order {
  return { id: r.id as string, userId: r.user_id as string, username: r.username as string, items: r.items as Order['items'], total: r.total as number, phone: r.phone as string, postalCode: r.postal_code as string, address: r.address as string, receiptImageBase64: r.receipt_image as string, status: r.status as Order['status'], adminMessage: r.admin_message as string, isAdminDeleted: r.is_admin_deleted as boolean, createdAt: r.created_at as string }
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const refresh = useCallback(async () => { const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false }); setOrders((data || []).map(mapOrder)) }, [])
  useEffect(() => { refresh() }, [refresh])

  const placeOrder = useCallback(async (o: Omit<Order, 'id' | 'createdAt' | 'status' | 'adminMessage' | 'isAdminDeleted'>): Promise<{ success: boolean; data?: Order; error?: string }> => {
    const { data, error } = await supabase.from('orders').insert({ user_id: o.userId, username: o.username, items: o.items, total: o.total, phone: o.phone, postal_code: o.postalCode, address: o.address, receipt_image: o.receiptImageBase64, status: 'pending', admin_message: '', is_admin_deleted: false }).select().single()
    if (error) { console.error('placeOrder failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true, data: mapOrder(data) }
  }, [refresh])

  const approveOrder = useCallback(async (id: string, msg: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('orders').update({ status: 'approved', admin_message: msg }).eq('id', id)
    if (error) { console.error('approveOrder failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])

  const rejectOrder = useCallback(async (id: string, msg: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('orders').update({ status: 'rejected', admin_message: msg }).eq('id', id)
    if (error) { console.error('rejectOrder failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])

  const adminDeleteOrder = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('orders').update({ is_admin_deleted: true }).eq('id', id)
    if (error) { console.error('adminDeleteOrder failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])

  const getOrdersByUser = useCallback((uid: string) => orders.filter(o => o.userId === uid), [orders])
  const getActiveOrders = useCallback(() => orders.filter(o => !o.isAdminDeleted), [orders])

  return { orders, placeOrder, approveOrder, rejectOrder, adminDeleteOrder, getOrdersByUser, getActiveOrders, refresh }
}
