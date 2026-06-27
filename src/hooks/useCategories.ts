import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types'

function mapCategory(r: Record<string, unknown>): Category { return { id: r.id as string, name: r.name as string, createdAt: r.created_at as string } }

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const refresh = useCallback(async () => { const { data } = await supabase.from('categories').select('*').order('name'); setCategories((data || []).map(mapCategory)) }, [])
  useEffect(() => { refresh() }, [refresh])
  const addCategory = useCallback(async (name: string): Promise<{ success: boolean; error?: string }> => { const { error } = await supabase.from('categories').insert({ name }); if (error) { console.error('addCategory failed:', error.message); return { success: false, error: error.message } }; await refresh(); return { success: true } }, [refresh])
  const deleteCategory = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => { const { error } = await supabase.from('categories').delete().eq('id', id); if (error) { console.error('deleteCategory failed:', error.message); return { success: false, error: error.message } }; await refresh(); return { success: true } }, [refresh])
  return { categories, addCategory, deleteCategory, refresh }
}
