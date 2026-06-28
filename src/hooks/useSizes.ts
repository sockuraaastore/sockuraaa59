import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Size } from '@/types'

function mapSize(r: Record<string, unknown>): Size { return { id: r.id as string, name: r.name as string, createdAt: r.created_at as string } }

export function useSizes() {
  const [sizes, setSizes] = useState<Size[]>([])
  const refresh = useCallback(async () => { const { data } = await supabase.from('sizes').select('*').order('name'); setSizes((data || []).map(mapSize)) }, [])
  useEffect(() => { refresh() }, [refresh])
  const addSize = useCallback(async (name: string): Promise<{ success: boolean; error?: string }> => { const { error } = await supabase.from('sizes').insert({ name }); if (error) { console.error('addSize failed:', error.message); return { success: false, error: error.message } }; await refresh(); return { success: true } }, [refresh])
  const deleteSize = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => { const { error } = await supabase.from('sizes').delete().eq('id', id); if (error) { console.error('deleteSize failed:', error.message); return { success: false, error: error.message } }; await refresh(); return { success: true } }, [refresh])
  return { sizes, addSize, deleteSize, refresh }
}