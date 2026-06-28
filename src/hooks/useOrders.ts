import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Order } from '@/types'

const ORDER_COLUMNS = 'id, user_id, username, items, total, phone, postal_code, address, status, admin_message, is_admin_deleted, created_at'
const RECEIPT_COLUMNS = 'id, receipt_image'

function mapOrder(r: Record<string, unknown>): Order {
  return { id: r.id as string, userId: r.user_id as string, username: r.username as string, items: r.items as Order['items'], total: r.total as number, phone: r.phone as string, postalCode: r.postal_code as string, address: r.address as string, receiptImageBase64: '', status: r.status as Order['status'], adminMessage: r.admin_message as string, isAdminDeleted: r.is_admin_deleted as boolean, createdAt: r.created_at as string }
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('orders').select(ORDER_COLUMNS).order('created_at', { ascending: false })
    setOrders((data || []).map(mapOrder))
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const fetchReceipt = useCallback(async (orderId: string): Promise<string | null> => {
    const { data } = await supabase.from('orders').select(RECEIPT_COLUMNS).eq('id', orderId).single()
    return data?.receipt_image || null
  }, [])

  const fetchActiveOrders = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('orders').select(ORDER_COLUMNS).eq('is_admin_deleted', false).order('created_at', { ascending: false })
    setOrders((data || []).map(mapOrder))
    setLoading(false)
  }, [])

  const fetchOrdersByUser = useCallback(async (userId: string) => {
    setLoading(true)
    const { data } = await supabase.from('orders').select(ORDER_COLUMNS).eq('user_id', userId).order('created_at', { ascending: false })
    setOrders((data || []).map(mapOrder))
    setLoading(false)
  }, [])

  const placeOrder = useCallback(async (o: Omit<Order, 'id' | 'createdAt' | 'status' | 'adminMessage' | 'isAdminDeleted'>): Promise<{ success: boolean; data?: Order; error?: string }> => {
    const { data, error } = await supabase.from('orders').insert({ user_id: o.userId, username: o.username, items: o.items, total: o.total, phone: o.phone, postal_code: o.postalCode, address: o.address, receipt_image: o.receiptImageBase64, status: 'pending', admin_message: '', is_admin_deleted: false }).select(ORDER_COLUMNS).single()
    if (error) { console.error('placeOrder failed:', error.message); return { success: false, error: error.message } }
    const newOrder = mapOrder(data)
    setOrders(prev => [newOrder, ...prev])
    return { success: true, data: newOrder }
  }, [])

  const approveOrder = useCallback(async (id: string, msg: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('orders').update({ status: 'approved', admin_message: msg }).eq('id', id)
    if (error) { console.error('approveOrder failed:', error.message); return { success: false, error: error.message } }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'approved' as const, adminMessage: msg } : o))
    return { success: true }
  }, [])

  const rejectOrder = useCallback(async (id: string, msg: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('orders').update({ status: 'rejected', admin_message: msg }).eq('id', id)
    if (error) { console.error('rejectOrder failed:', error.message); return { success: false, error: error.message } }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'rejected' as const, adminMessage: msg } : o))
    return { success: true }
  }, [])

  const adminDeleteOrder = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('orders').update({ is_admin_deleted: true }).eq('id', id)
    if (error) { console.error('adminDeleteOrder failed:', error.message); return { success: false, error: error.message } }
    setOrders(prev => prev.filter(o => o.id !== id))
    return { success: true }
  }, [])

  const getOrdersByUser = useCallback((uid: string) => orders.filter(o => o.userId === uid), [orders])
  const getActiveOrders = useCallback(() => orders.filter(o => !o.isAdminDeleted), [orders])

  return { orders, loading, placeOrder, approveOrder, rejectOrder, adminDeleteOrder, getOrdersByUser, getActiveOrders, refresh, fetchReceipt, fetchActiveOrders, fetchOrdersByUser }
}
