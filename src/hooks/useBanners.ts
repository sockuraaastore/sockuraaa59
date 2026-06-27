import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Banner } from '@/types'

function mapBanner(r: Record<string, unknown>): Banner { return { id: r.id as string, name: r.name as string, imageUrl: r.image_url as string, description: r.description as string, isActive: r.is_active as boolean, createdAt: r.created_at as string } }

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const refresh = useCallback(async () => { const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false }); setBanners((data || []).map(mapBanner)) }, [])
  useEffect(() => { refresh() }, [refresh])

  const addBanner = useCallback(async (d: { name: string; imageUrl: string; description: string }): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('banners').insert({ name: d.name, image_url: d.imageUrl, description: d.description, is_active: true })
    if (error) { console.error('addBanner failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])

  const updateBanner = useCallback(async (id: string, data: Partial<Banner>): Promise<{ success: boolean; error?: string }> => {
    const u: Record<string, unknown> = {}
    if (data.name !== undefined) u.name = data.name
    if (data.imageUrl !== undefined) u.image_url = data.imageUrl
    if (data.description !== undefined) u.description = data.description
    if (data.isActive !== undefined) u.is_active = data.isActive
    const { error } = await supabase.from('banners').update(u).eq('id', id)
    if (error) { console.error('updateBanner failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])

  const deleteBanner = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('banners').delete().eq('id', id)
    if (error) { console.error('deleteBanner failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])
  const getActiveBanners = useCallback((): Banner[] => banners.filter(b => b.isActive), [banners])

  return { banners, addBanner, updateBanner, deleteBanner, getActiveBanners, refresh }
}
