import React from 'react'
import { motion } from 'framer-motion'
import { useComments } from '@/hooks/useComments'
import { useProducts } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pin, Trash2, MessageCircle } from 'lucide-react'

export default function AdminComments() {
  const { getAllVisibleComments, deleteComment, pinComment } = useComments()
  const { products } = useProducts()
  const comments = getAllVisibleComments()

  return (
    <div>
      <h2 className="text-xl font-bold text-dark mb-6">مدیریت نظرات</h2>

      {comments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-pink-100">
          <MessageCircle size={48} className="mx-auto text-pink-200 mb-4" />
          <p className="text-dark-300">هنوز نظری ثبت نشده</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => {
            const product = products.find(p => p.id === comment.productId)
            return (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl p-4 border ${
                  comment.isPinned ? 'border-pink-300 bg-pink-50' : 'border-pink-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-dark-100 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {comment.username.charAt(0)}
                    </div>
                    <span className="font-medium text-dark">{comment.username}</span>
                    {comment.isPinned && (
                      <Badge variant="default" className="gap-1">
                        <Pin size={10} />
                        پین شده
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-dark-300">
                    {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>

                {product && (
                  <div className="text-xs text-pink mb-2">
                    محصول: {product.name}
                  </div>
                )}

                <p className="text-dark-300 text-sm mb-3">{comment.text}</p>

                <div className="flex gap-2">
                  {!comment.isPinned && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => { const r = await pinComment(comment.id); if (!r.success) alert('خطا در پین کردن: ' + (r.error || 'ناشناخته')) }}
                      className="gap-1"
                    >
                      <Pin size={14} />
                      پین بهترین نظر
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => { const r = await deleteComment(comment.id); if (!r.success) alert('خطا در حذف نظر: ' + (r.error || 'ناشناخته')) }}
                    className="gap-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                    حذف
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
