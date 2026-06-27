import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Comment } from '@/types'

function mapComment(r: Record<string, unknown>): Comment { return { id: r.id as string, productId: r.product_id as string, userId: r.user_id as string, username: r.username as string, text: r.text as string, isPinned: r.is_pinned as boolean, isAdminDeleted: r.is_admin_deleted as boolean, createdAt: r.created_at as string } }

export function useComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const refresh = useCallback(async () => { const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: false }); setComments((data || []).map(mapComment)) }, [])
  useEffect(() => { refresh() }, [refresh])

  const addComment = useCallback(async (productId: string, userId: string, username: string, text: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('comments').insert({ product_id: productId, user_id: userId, username, text, is_pinned: false, is_admin_deleted: false })
    if (error) { console.error('addComment failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])

  const deleteComment = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('comments').update({ is_admin_deleted: true }).eq('id', id)
    if (error) { console.error('deleteComment failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])

  const pinComment = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    const c = comments.find(x => x.id === id); if (!c) return { success: false, error: 'نظر یافت نشد' }
    const { error: e1 } = await supabase.from('comments').update({ is_pinned: false }).eq('product_id', c.productId)
    if (e1) { console.error('pinComment (unpin) failed:', e1.message); return { success: false, error: e1.message } }
    const { error: e2 } = await supabase.from('comments').update({ is_pinned: true }).eq('id', id)
    if (e2) { console.error('pinComment (pin) failed:', e2.message); return { success: false, error: e2.message } }
    await refresh(); return { success: true }
  }, [comments, refresh])

  const getCommentsByProduct = useCallback((pid: string) => comments.filter(c => c.productId === pid && !c.isAdminDeleted), [comments])
  const getAllVisibleComments = useCallback(() => comments.filter(c => !c.isAdminDeleted), [comments])

  return { comments, addComment, deleteComment, pinComment, getCommentsByProduct, getAllVisibleComments, refresh }
}
