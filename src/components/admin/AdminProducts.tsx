import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useSizes } from '@/hooks/useSizes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Edit, Package, X } from 'lucide-react'
import { compressImage } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { ProductSize } from '@/types'

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const { categories, addCategory } = useCategories()
  const { sizes } = useSizes()
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stockQuantity, setStockQuantity] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [category, setCategory] = useState<string[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [productSizes, setProductSizes] = useState<{ sizeName: string; stockQuantity: number }[]>([])

  const resetForm = () => {
    setName('')
    setDescription('')
    setPrice('')
    setStockQuantity('')
    setImageUrls([])
    setNewImageUrl('')
    setCategory([])
    setNewCategoryName('')
    setShowNewCategory(false)
    setProductSizes([])
    setEditId(null)
  }

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return
    setImageUrls([...imageUrls, newImageUrl.trim()])
    setNewImageUrl('')
  }

  const handleRemoveImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم فایل بیش از ۵ مگابایت است. لطفاً تصویر کوچکتری انتخاب کنید.')
        continue
      }
      try {
        const compressed = await compressImage(file)
        setImageUrls(prev => [...prev, compressed])
      } catch {
        alert('خطا در پردازش تصویر')
      }
    }
    e.target.value = ''
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return
    const result = await addCategory(newCategoryName.trim())
    if (!result.success) { alert('خطا در ذخیره دسته‌بندی: ' + (result.error || 'ناشناخته')); return }
    setCategory([...category, newCategoryName.trim()])
    setNewCategoryName('')
    setShowNewCategory(false)
  }

  const toggleCategory = (name: string) => {
    setCategory(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name])
  }

  const handleAdd = async () => {
    if (!name || !price) return
    const finalImages = imageUrls.length > 0 ? imageUrls : [`https://picsum.photos/seed/${Date.now()}/400/400`]
    const sizes: ProductSize[] = productSizes.map((s, i) => ({
      id: '',
      productId: '',
      sizeName: s.sizeName,
      stockQuantity: s.stockQuantity,
      createdAt: ''
    }))
    const result = await addProduct({
      name,
      description,
      price: parseInt(price),
      stockQuantity: sizes.length > 0 ? 0 : parseInt(stockQuantity || '0'),
      imageUrls: finalImages,
      category,
      sizes,
    })
    if (!result.success) {
      alert('خطا در ذخیره محصول: ' + (result.error || 'ناشناخته'))
      return
    }
    resetForm()
    setShowAdd(false)
  }

  const handleEdit = (product: typeof products[0]) => {
    setEditId(product.id)
    setName(product.name)
    setDescription(product.description)
    setPrice(product.price.toString())
    setStockQuantity(product.stockQuantity.toString())
    setImageUrls([...product.imageUrls])
    setCategory(Array.isArray(product.category) ? [...product.category] : [product.category])
    setProductSizes(product.sizes.map(s => ({ sizeName: s.sizeName, stockQuantity: s.stockQuantity })))
    setShowAdd(true)
  }

  const handleUpdate = async () => {
    if (!editId || !name || !price) return
    const sizes: ProductSize[] = productSizes.map((s, i) => ({
      id: '',
      productId: editId,
      sizeName: s.sizeName,
      stockQuantity: s.stockQuantity,
      createdAt: ''
    }))
    const result = await updateProduct(editId, {
      name,
      description,
      price: parseInt(price),
      stockQuantity: sizes.length > 0 ? 0 : parseInt(stockQuantity || '0'),
      imageUrls,
      category,
      sizes,
    })
    if (!result.success) {
      alert('خطا در ذخیره تغییرات: ' + (result.error || 'ناشناخته'))
      return
    }
    resetForm()
    setShowAdd(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      const result = await deleteProduct(id)
      if (!result.success) alert('خطا در حذف محصول: ' + (result.error || 'ناشناخته'))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-dark">مدیریت محصولات</h2>
        <Button onClick={() => { resetForm(); setShowAdd(true) }} className="gap-2">
          <Plus size={16} />
          افزودن محصول
        </Button>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? 'ویرایش محصول' : 'افزودن محصول جدید'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام محصول"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات کامل محصول"
              className="w-full h-24 rounded-xl border-2 border-pink-200 bg-white px-4 py-3 text-sm text-dark resize-none focus:outline-none focus:border-pink"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="قیمت (تومان)"
                type="number"
                dir="ltr"
              />
              <Input
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="تعداد موجودی"
                type="number"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">تصاویر محصول</label>
              <div className="space-y-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <img src={url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <span className="flex-1 text-xs text-dark-300 truncate">{url}</span>
                    <button
                      onClick={() => handleRemoveImageUrl(index)}
                      className="text-red-400 hover:text-red-500 p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="آدرس تصویر جدید"
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddImageUrl}>
                  <Plus size={14} />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  آپلود
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">دسته‌بندی‌ها</label>
              {showNewCategory ? (
                <div className="flex gap-2">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="نام دسته جدید"
                    className="flex-1"
                  />
                  <Button type="button" size="sm" onClick={handleCreateCategory}>ساخت</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewCategory(false)}>لغو</Button>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {categories.map((cat) => (
                      <label
                        key={cat.id}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm cursor-pointer border transition-colors ${
                          category.includes(cat.name)
                            ? 'bg-pink text-white border-pink'
                            : 'bg-white text-dark border-pink-200 hover:border-pink'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={category.includes(cat.name)}
                          onChange={() => toggleCategory(cat.name)}
                          className="sr-only"
                        />
                        {cat.name}
                      </label>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowNewCategory(true)}>
                    دسته جدید
                  </Button>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">سایزها (اختیاری)</label>
              <p className="text-xs text-dark-300 mb-2">اگر سایز اضافه کنید، مشتریان باید سایز را انتخاب کنند</p>
              <div className="space-y-2">
                {sizes.map((size) => {
                  const existing = productSizes.find(s => s.sizeName === size.name)
                  const isEnabled = !!existing
                  return (
                    <div key={size.id} className="flex items-center gap-2">
                      <label
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer border transition-colors flex-1 ${
                          isEnabled
                            ? 'bg-pink-50 border-pink-300'
                            : 'bg-white border-pink-200 hover:border-pink'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProductSizes([...productSizes, { sizeName: size.name, stockQuantity: 0 }])
                            } else {
                              setProductSizes(productSizes.filter(s => s.sizeName !== size.name))
                            }
                          }}
                          className="sr-only"
                        />
                        <span className="font-medium">{size.name}</span>
                      </label>
                      {isEnabled && (
                        <Input
                          type="number"
                          value={existing?.stockQuantity || 0}
                          onChange={(e) => {
                            setProductSizes(productSizes.map(s =>
                              s.sizeName === size.name
                                ? { ...s, stockQuantity: parseInt(e.target.value) || 0 }
                                : s
                            ))
                          }}
                          placeholder="موجودی"
                          className="w-24"
                          dir="ltr"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
              {productSizes.length === 0 && (
                <div className="mt-2">
                  <Input
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder="تعداد موجودی کل"
                    type="number"
                    dir="ltr"
                  />
                </div>
              )}
            </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 border border-pink-100"
          >
            <div className="flex gap-3">
              <img src={product.imageUrls?.[0] || ''} alt="" className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-dark truncate">{product.name}</h4>
                <p className="text-pink font-medium">{product.price.toLocaleString('fa-IR')} تومان</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {product.sizes.length > 0 ? (
                    product.sizes.map(s => (
                      <Badge key={s.sizeName} variant={s.stockQuantity === 0 ? 'outOfStock' : 'stock'}>
                        {s.sizeName}: {s.stockQuantity}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant={product.stockQuantity === 0 ? 'outOfStock' : 'stock'}>
                      {product.stockQuantity === 0 ? 'تموم شده' : `${product.stockQuantity} موجود`}
                    </Badge>
                  )}
                  <Badge variant="secondary">{Array.isArray(product.category) ? product.category.join('، ') : product.category}</Badge>
                  {(product.imageUrls?.length ?? 0) > 1 && (
                    <Badge variant="outline">{product.imageUrls?.length} تصویر</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(product)} className="flex-1 gap-1">
                <Edit size={14} />
                ویرایش
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)} className="gap-1 text-red-500 hover:text-red-600">
                <Trash2 size={14} />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
