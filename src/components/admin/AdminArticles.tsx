import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useArticles } from '@/hooks/useArticles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Edit, Eye, EyeOff, BookOpen } from 'lucide-react'
import { compressImage } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function AdminArticles() {
  const { articles, addArticle, updateArticle, deleteArticle } = useArticles()
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم فایل بیش از ۵ مگابایت است. لطفاً تصویر کوچکتری انتخاب کنید.')
      return
    }
    try {
      const compressed = await compressImage(file, 1920, 0.85)
      setImageUrl(compressed)
    } catch {
      alert('خطا در پردازش تصویر')
    }
    e.target.value = ''
  }

  const resetForm = () => {
    setTitle('')
    setImageUrl('')
    setDescription('')
    setVideoUrl('')
    setEditId(null)
  }

  const handleAdd = async () => {
    if (!title || !imageUrl || !description) return
    const result = await addArticle({ title, imageUrl, description, videoUrl })
    if (!result.success) {
      alert('خطا در ذخیره مقاله: ' + (result.error || 'ناشناخته'))
      return
    }
    resetForm()
    setShowAdd(false)
  }

  const handleEdit = (article: typeof articles[0]) => {
    setEditId(article.id)
    setTitle(article.title)
    setImageUrl(article.imageUrl)
    setDescription(article.description)
    setVideoUrl(article.videoUrl)
    setShowAdd(true)
  }

  const handleUpdate = async () => {
    if (!editId || !title || !imageUrl || !description) return
    const result = await updateArticle(editId, { title, imageUrl, description, videoUrl })
    if (!result.success) {
      alert('خطا در ذخیره تغییرات: ' + (result.error || 'ناشناخته'))
      return
    }
    resetForm()
    setShowAdd(false)
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    const result = await updateArticle(id, { isActive: !isActive })
    if (!result.success) alert('خطا در تغییر وضعیت مقاله: ' + (result.error || 'ناشناخته'))
  }

  const handleDelete = async (id: string) => {
    if (confirm('آیا از حذف این مقاله اطمینان دارید؟')) {
      const result = await deleteArticle(id)
      if (!result.success) alert('خطا در حذف مقاله: ' + (result.error || 'ناشناخته'))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-dark">مدیریت مقالات و آموزش‌ها</h2>
        <Button onClick={() => { resetForm(); setShowAdd(true) }} className="gap-2">
          <Plus size={16} />
          افزودن مقاله
        </Button>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? 'ویرایش مقاله' : 'افزودن مقاله جدید'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان مقاله"
            />
            <div>
              <label className="block text-sm font-medium text-dark mb-2">تصویر مقاله</label>
              <Input
                value={imageUrl.startsWith('data:') ? '' : imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="آدرس تصویر مقاله"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button type="button" variant="outline" size="sm" className="mt-2 gap-1" onClick={() => fileInputRef.current?.click()}>
                آپلود از دستگاه
              </Button>
              {imageUrl && (
                <div className="mt-2 relative inline-block">
                  <img src={imageUrl} alt="پیش‌نمایش" className="w-full max-h-48 object-cover rounded-xl border border-pink-100" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات کامل مقاله"
              className="w-full h-32 rounded-xl border-2 border-pink-200 bg-white px-4 py-3 text-sm text-dark resize-none focus:outline-none focus:border-pink"
            />
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="آدرس ویدیو (اختیاری - مثلاً YouTube)"
            />

            <div className="flex gap-2">
              <Button onClick={editId ? handleUpdate : handleAdd} className="flex-1">
                {editId ? 'ذخیره تغییرات' : 'افزودن'}
              </Button>
              <Button variant="ghost" onClick={() => { resetForm(); setShowAdd(false) }}>
                انصراف
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl overflow-hidden border border-pink-100"
          >
            <div className="aspect-video relative">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
              <div className={`absolute top-2 right-2 ${article.isActive ? 'bg-green-500' : 'bg-dark-300'} text-white text-xs px-2 py-1 rounded-full`}>
                {article.isActive ? 'فعال' : 'غیرفعال'}
              </div>
              {article.videoUrl && (
                <div className="absolute top-2 left-2 bg-pink text-white text-xs px-2 py-1 rounded-full">
                  دارای ویدیو
                </div>
              )}
            </div>

            <div className="p-4">
              <h4 className="font-bold text-dark mb-1">{article.title}</h4>
              <p className="text-sm text-dark-300 line-clamp-2">{article.description}</p>

              <div className="flex gap-2 mt-3">
                <Button variant="ghost" size="sm" onClick={() => toggleActive(article.id, article.isActive)} className="gap-1">
                  {article.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  {article.isActive ? 'غیرفعال' : 'فعال'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(article)} className="gap-1">
                  <Edit size={14} />
                  ویرایش
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(article.id)} className="gap-1 text-red-500">
                  <Trash2 size={14} />
                  حذف
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
