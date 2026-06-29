import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Article } from '@/types'

function mapArticle(r: Record<string, unknown>): Article {
  return {
    id: r.id as string,
    title: r.title as string,
    imageUrl: r.image_url as string,
    description: r.description as string,
    videoUrl: r.video_url as string,
    isActive: r.is_active as boolean,
    createdAt: r.created_at as string,
  }
}

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const refresh = useCallback(async () => {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
    setArticles((data || []).map(mapArticle))
  }, [])
  useEffect(() => { refresh() }, [refresh])

  const addArticle = useCallback(async (d: { title: string; imageUrl: string; description: string; videoUrl: string }): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('articles').insert({
      title: d.title,
      image_url: d.imageUrl,
      description: d.description,
      video_url: d.videoUrl,
      is_active: true,
    })
    if (error) { console.error('addArticle failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])

  const updateArticle = useCallback(async (id: string, data: Partial<Article>): Promise<{ success: boolean; error?: string }> => {
    const u: Record<string, unknown> = {}
    if (data.title !== undefined) u.title = data.title
    if (data.imageUrl !== undefined) u.image_url = data.imageUrl
    if (data.description !== undefined) u.description = data.description
    if (data.videoUrl !== undefined) u.video_url = data.videoUrl
    if (data.isActive !== undefined) u.is_active = data.isActive
    const { error } = await supabase.from('articles').update(u).eq('id', id)
    if (error) { console.error('updateArticle failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])

  const deleteArticle = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('articles').delete().eq('id', id)
    if (error) { console.error('deleteArticle failed:', error.message); return { success: false, error: error.message } }
    await refresh(); return { success: true }
  }, [refresh])

  const getActiveArticles = useCallback((): Article[] => articles.filter(a => a.isActive), [articles])

  return { articles, addArticle, updateArticle, deleteArticle, getActiveArticles, refresh }
}
