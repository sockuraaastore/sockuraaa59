import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { SupportTicket, SupportMessage } from '@/types'

function mapTicket(r: Record<string, unknown>): SupportTicket { return { id: r.id as string, userId: r.user_id as string, username: r.username as string, subject: r.subject as string, messages: [], isAdminDeleted: r.is_admin_deleted as boolean, createdAt: r.created_at as string } }
function mapMessage(r: Record<string, unknown>): SupportMessage & { ticketId: string } { return { id: r.id as string, sender: r.sender as 'user' | 'admin', text: r.text as string, createdAt: r.created_at as string, ticketId: r.ticket_id as string } }

export function useSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const refresh = useCallback(async () => {
    const { data: tData } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false })
    const { data: mData } = await supabase.from('support_messages').select('*').order('created_at')
    const tl = (tData || []).map(mapTicket)
    const ml = (mData || []).map(mapMessage)
    setTickets(tl.map(t => ({ ...t, messages: ml.filter(m => m.ticketId === t.id) })))
  }, [])
  useEffect(() => { refresh() }, [refresh])

  const createTicket = useCallback(async (userId: string, username: string, subject: string, firstMessage: string): Promise<{ success: boolean; error?: string }> => {
    const { data: t, error } = await supabase.from('support_tickets').insert({ user_id: userId, username, subject, is_admin_deleted: false }).select().single()
    if (error || !t) { console.error('createTicket failed:', error?.message); return { success: false, error: error?.message || 'خطا در ایجاد تیکت' } }
    const { error: msgErr } = await supabase.from('support_messages').insert({ ticket_id: t.id, sender: 'user', text: firstMessage })
    if (msgErr) { console.error('createTicket message failed:', msgErr.message); return { success: false, error: msgErr.message } }
    await refresh(); return { success: true }
  }, [refresh])

  const replyToTicket = useCallback(async (ticketId: string, sender: 'user' | 'admin', text: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('support_messages').insert({ ticket_id: ticketId, sender, text })
    if (error) { console.error('replyToTicket failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])

  const adminDeleteTicket = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('support_tickets').update({ is_admin_deleted: true }).eq('id', id)
    if (error) { console.error('adminDeleteTicket failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])
  const getTicketsByUser = useCallback((uid: string) => tickets.filter(t => t.userId === uid), [tickets])
  const getActiveTickets = useCallback(() => tickets.filter(t => !t.isAdminDeleted), [tickets])
  const getTicketById = useCallback((id: string) => tickets.find(t => t.id === id), [tickets])

  return { tickets, createTicket, replyToTicket, adminDeleteTicket, getTicketsByUser, getActiveTickets, getTicketById, refresh }
}
