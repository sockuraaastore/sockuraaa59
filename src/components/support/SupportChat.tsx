import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useSupport } from '@/hooks/useSupport'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Send } from 'lucide-react'

interface SupportChatProps {
  ticketId: string
  onBack: () => void
}

export default function SupportChat({ ticketId, onBack }: SupportChatProps) {
  const { currentUser } = useAuth()
  const { getTicketById, replyToTicket } = useSupport()
  const [reply, setReply] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const ticket = getTicketById(ticketId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [ticket?.messages.length])

  if (!ticket) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-dark-300">تیکت یافت نشد</p>
        <Button onClick={onBack} className="mt-4">بازگشت</Button>
      </div>
    )
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim() || !currentUser) return

    const result = await replyToTicket(ticketId, currentUser.isAdmin ? 'admin' : 'user', reply.trim())
    if (!result.success) {
      alert('خطا در ارسال پیام: ' + (result.error || 'ناشناخته'))
      return
    }
    setReply('')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={onBack} className="mb-6 gap-1">
        <ArrowRight size={16} />
        بازگشت
      </Button>

      <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
        <div className="bg-pink-50 p-4 border-b border-pink-100">
          <h3 className="font-bold text-dark">{ticket.subject}</h3>
          <p className="text-sm text-dark-300">{ticket.username}</p>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {ticket.messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.sender === 'user'
                    ? 'bg-pink-50 text-dark'
                    : 'bg-pink text-white'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className={`text-xs mt-1 block ${msg.sender === 'user' ? 'text-dark-300' : 'text-white/70'}`}>
                  {msg.sender === 'user' ? ticket.username : 'ادمین'} • {new Date(msg.createdAt).toLocaleTimeString('fa-IR')}
                </span>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleReply} className="p-4 border-t border-pink-100 flex gap-2">
          <Input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="پیام خود را بنویسید..."
            className="flex-1"
          />
          <Button type="submit" disabled={!reply.trim()} size="icon">
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  )
}
