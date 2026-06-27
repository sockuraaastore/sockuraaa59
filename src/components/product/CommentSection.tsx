import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useComments } from '@/hooks/useComments'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pin, Trash2, Send, MessageCircle } from 'lucide-react'
import type { Comment } from '@/types'

interface CommentSectionProps {
  productId: string
}

export default function CommentSection({ productId }: CommentSectionProps) {
  const { currentUser } = useAuth()
  const { getCommentsByProduct, addComment, deleteComment, pinComment } = useComments()
  const comments = getCommentsByProduct(productId)
  const [newComment, setNewComment] = useState('')

  const pinnedComment = comments.find(c => c.isPinned)
  const regularComments = comments.filter(c => !c.isPinned)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !currentUser) return

    const result = await addComment(productId, currentUser.id, currentUser.username, newComment.trim())
    if (!result.success) {
      alert('خطا در ارسال نظر: ' + (result.error || 'ناشناخته'))
      return
    }
    setNewComment('')
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={20} className="text-pink" />
        <h3 className="text-xl font-bold text-dark">نظرات ({comments.length})</h3>
      </div>

      {pinnedComment && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-pink-50 border border-pink-200 rounded-2xl p-4 mb-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Pin size={14} className="text-pink" />
            <span className="text-xs font-medium text-pink">بهترین نظر</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-pink rounded-full flex items-center justify-center text-white text-sm font-bold">
              {pinnedComment.username.charAt(0)}
            </div>
            <span className="font-medium text-dark">{pinnedComment.username}</span>
          </div>
          <p className="text-dark-300">{pinnedComment.text}</p>
        </motion.div>
      )}

      {currentUser?.isAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 text-sm text-yellow-700">
          حالت ادمین: می‌توانید نظرات را حذف یا پین کنید
        </div>
      )}

      {regularComments.length === 0 && !pinnedComment && (
        <div className="text-center py-8 text-dark-300">
          <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
          <p>هنوز نظری ثبت نشده</p>
          <p className="text-sm">اولین نفری باشید که نظر می‌دهید!</p>
        </div>
      )}

      <div className="space-y-3 mb-6">
        {regularComments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-pink-100 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-dark-100 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {comment.username.charAt(0)}
                </div>
                <span className="font-medium text-dark">{comment.username}</span>
              </div>

              {currentUser?.isAdmin && (
                <div className="flex gap-1">
                  <button
                    onClick={async () => { const r = await pinComment(comment.id); if (!r.success) alert('خطا در پین کردن: ' + (r.error || 'ناشناخته')) }}
                    className="p-1.5 rounded-lg hover:bg-pink-50 text-dark-300 hover:text-pink transition-colors"
                    title="پین کردن"
                  >
                    <Pin size={14} />
                  </button>
                  <button
                    onClick={async () => { const r = await deleteComment(comment.id); if (!r.success) alert('خطا در حذف نظر: ' + (r.error || 'ناشناخته')) }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-dark-300 hover:text-red-500 transition-colors"
                    title="حذف"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-dark-300 text-sm">{comment.text}</p>
            <span className="text-xs text-dark-300/50 mt-2 block">
              {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
            </span>
          </motion.div>
        ))}
      </div>

      {currentUser && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="نظر خود را بنویسید..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newComment.trim()} size="icon">
            <Send size={18} />
          </Button>
        </form>
      )}
    </div>
  )
}
