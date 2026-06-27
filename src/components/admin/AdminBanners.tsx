import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useBanners } from '@/hooks/useBanners'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Edit, Image as ImageIcon, Eye, EyeOff } from 'lucide-react'
import { compressImage } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function AdminBanners() {
  const { banners, addBanner, updateBanner, deleteBanner } = useBanners()
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم فایل بیش از ۵ مگابایت است. لطفاً تصویر کوچکتری انتخاب کنید.')
      return
    }
    try {
      const compressed = await compressImage(file)
      setImageUrl(compressed)
    } catch {
      alert('خطا در پردازش تصویر')
    }
    e.target.value = ''
  }

  const resetForm = () => {
    setName('')
    setImageUrl('')
    setDescription('')
    setEditId(null)
  }

  const handleAdd = async () => {
    if (!name || !imageUrl || !description) return
    const result = await addBanner({ name, imageUrl, description })
    if (!result.success) {
      alert('خطا در ذخیره بنر: ' + (result.error || 'ناشناخته'))
      return
    }
    resetForm()
    setShowAdd(false)
  }

  const handleEdit = (banner: typeof banners[0]) => {
    setEditId(banner.id)
    setName(banner.name)
    setImageUrl(banner.imageUrl)
    setDescription(banner.description)
    setShowAdd(true)
  }

  const handleUpdate = async () => {
    if (!editId || !name || !imageUrl || !description) return
    const result = await updateBanner(editId, { name, imageUrl, description })
    if (!result.success) {
      alert('خطا در ذخیره تغییرات: ' + (result.error || 'ناشناخته'))
      return
    }
    resetForm()
    setShowAdd(false)
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    const result = await updateBanner(id, { isActive: !isActive })
    if (!result.success) alert('خطا در تغییر وضعیت بنر: ' + (result.error || 'ناشناخته'))
  }

  const handleDelete = async (id: string) => {
    if (confirm('آیا از حذف این بنر اطمینان دارید؟')) {
      const result = await deleteBanner(id)
      if (!result.success) alert('خطا در حذف بنر: ' + (result.error || 'ناشناخته'))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-dark">مدیریت بنرها</h2>
        <Button onClick={() => { resetForm(); setShowAdd(true) }} className="gap-2">
          <Plus size={16} />
          افزودن بنر
        </Button>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? 'ویرایش بنر' : 'افزودن بنر جدید'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام بنر"
            />
            <div>
              <label className="block text-sm font-medium text-dark mb-2">تصویر بنر</label>
              <Input
                value={imageUrl.startsWith('data:') ? '' : imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="آدرس تصویر بنر"
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
              placeholder="توضیحات کامل بنر (برای صفحه داخلی نمایش داده می‌شود)"
              className="w-full h-32 rounded-xl border-2 border-pink-200 bg-white px-4 py-3 text-sm text-dark resize-none focus:outline-none focus:border-pink"
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
        {banners.map((banner) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl overflow-hidden border border-pink-100"
          >
            <div className="aspect-video relative">
              <img src={banner.imageUrl} alt={banner.name} className="w-full h-full object-cover" />
              <div className={`absolute top-2 right-2 ${banner.isActive ? 'bg-green-500' : 'bg-dark-300'} text-white text-xs px-2 py-1 rounded-full`}>
                {banner.isActive ? 'فعال' : 'غیرفعال'}
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-bold text-dark mb-1">{banner.name}</h4>
              <p className="text-sm text-dark-300 line-clamp-2">{banner.description}</p>

              <div className="flex gap-2 mt-3">
                <Button variant="ghost" size="sm" onClick={() => toggleActive(banner.id, banner.isActive)} className="gap-1">
                  {banner.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  {banner.isActive ? 'غیرفعال' : 'فعال'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(banner)} className="gap-1">
                  <Edit size={14} />
                  ویرایش
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(banner.id)} className="gap-1 text-red-500">
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
