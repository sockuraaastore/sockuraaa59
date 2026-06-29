import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { GenderAge } from '@/types'

function mapGenderAge(r: Record<string, unknown>): GenderAge { return { id: r.id as string, name: r.name as string, createdAt: r.created_at as string } }

export function useGenderAges() {
  const [genderAges, setGenderAges] = useState<GenderAge[]>([])
  const refresh = useCallback(async () => { const { data } = await supabase.from('gender_ages').select('*').order('name'); setGenderAges((data || []).map(mapGenderAge)) }, [])
  useEffect(() => { refresh() }, [refresh])
  const addGenderAge = useCallback(async (name: string): Promise<{ success: boolean; error?: string }> => { const { error } = await supabase.from('gender_ages').insert({ name }); if (error) { console.error('addGenderAge failed:', error.message); return { success: false, error: error.message } }; await refresh(); return { success: true } }, [refresh])
  const deleteGenderAge = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => { const { error } = await supabase.from('gender_ages').delete().eq('id', id); if (error) { console.error('deleteGenderAge failed:', error.message); return { success: false, error: error.message } }; await refresh(); return { success: true } }, [refresh])
  return { genderAges, addGenderAge, deleteGenderAge, refresh }
}
