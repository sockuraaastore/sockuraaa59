import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGenderAges } from '@/hooks/useGenderAges'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Users } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function AdminGenderAges() {
  const { genderAges, addGenderAge, deleteGenderAge } = useGenderAges()
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')

  const handleAdd = async () => {
    if (!name.trim()) return
    const result = await addGenderAge(name.trim())
    if (!result.success) {
      alert('خطا در افزودن: ' + (result.error || 'ناشناخته'))
      return
    }
    setName('')
    setShowAdd(false)
  }

  const handleDelete = async (id: string, genderAgeName: string) => {
    if (confirm('آیا از حذف «' + genderAgeName + '» اطمینان دارید؟')) {
      const result = await deleteGenderAge(id)
      if (!result.success) alert('خطا در حذف: ' + (result.error || 'ناشناخته'))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-dark">مدیریت جنسیت و سن</h2>
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus size={16} />
          افزودن
        </Button>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>افزودن جنسیت/سن جدید</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام (مثلاً مرد، زن، پسر، دختر)"
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
            />
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="flex-1">افزودن</Button>
              <Button variant="ghost" onClick={() => { setName(''); setShowAdd(false) }}>انصراف</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {genderAges.map((ga) => (
          <motion.div
            key={ga.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-pink-100 p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink/10 rounded-xl flex items-center justify-center">
                <Users size={18} className="text-pink" />
              </div>
              <span className="font-bold text-dark">{ga.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(ga.id, ga.name)} className="gap-1 text-red-500">
              <Trash2 size={14} />
              حذف
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
