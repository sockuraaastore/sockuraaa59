import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useSupport } from '@/hooks/useSupport'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Plus, Send, Headphones } from 'lucide-react'
import type { ViewType } from '@/types'

interface SupportViewProps {
  onNavigate: (view: ViewType) => void
  onSelectTicket: (ticketId: string) => void
}

export default function SupportView({ onNavigate, onSelectTicket }: SupportViewProps) {
  const { currentUser } = useAuth()
  const { getTicketsByUser, createTicket } = useSupport()

  const [showNewForm, setShowNewForm] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  if (!currentUser) return null

  const myTickets = getTicketsByUser(currentUser.id)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) return

    const result = await createTicket(currentUser.id, currentUser.username, subject.trim(), message.trim())
    if (!result.success) {
      alert('خطا در ارسال تیکت: ' + (result.error || 'ناشناخته'))
      return
    }
    setSubject('')
    setMessage('')
    setShowNewForm(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-2">
          <Headphones size={24} className="text-pink" />
          <h2 className="text-2xl font-black text-dark">پشتیبانی</h2>
        </div>
        <Button onClick={() => setShowNewForm(true)} className="gap-2">
          <Plus size={16} />
          تیکت جدید
        </Button>
      </motion.div>

      {showNewForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-2xl p-6 border border-pink-100 mb-6"
        >
          <h3 className="font-bold text-dark mb-4">تیکت جدید</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="موضوع تیکت"
              required
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              className="w-full h-32 rounded-xl border-2 border-pink-200 bg-white px-4 py-3 text-sm text-dark resize-none focus:outline-none focus:border-pink focus:ring-1 focus:ring-pink"
              required
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={!subject.trim() || !message.trim()}>
                ارسال
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowNewForm(false)}>
                انصراف
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {myTickets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-pink-100">
          <MessageSquare size={48} className="mx-auto text-pink-200 mb-4" />
          <p className="text-dark-300 mb-2">هنوز تیکتی ایجاد نکرده‌اید</p>
          <p className="text-sm text-dark-300">برای ارتباط با پشتیبانی، تیکت جدید ایجاد کنید</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectTicket(ticket.id)}
              className="bg-white rounded-xl p-4 border border-pink-100 cursor-pointer hover:border-pink-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-dark">{ticket.subject}</h4>
                <span className="text-xs text-dark-300">
                  {ticket.messages.length} پیام
                </span>
              </div>
              <p className="text-sm text-dark-300 truncate">
                {ticket.messages[ticket.messages.length - 1]?.text}
              </p>
              <span className="text-xs text-dark-300/50 mt-2 block">
                {new Date(ticket.createdAt).toLocaleDateString('fa-IR')}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
