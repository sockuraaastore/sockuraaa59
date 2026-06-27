import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSupport } from '@/hooks/useSupport'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Headphones, Send, Trash2, MessageSquare } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function AdminSupport() {
  const { getActiveTickets, replyToTicket, adminDeleteTicket, getTicketById } = useSupport()
  const tickets = getActiveTickets()

  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [reply, setReply] = useState('')

  const activeTicket = selectedTicket ? getTicketById(selectedTicket) : null

  const handleReply = async () => {
    if (!selectedTicket || !reply.trim()) return
    const result = await replyToTicket(selectedTicket, 'admin', reply.trim())
    if (!result.success) {
      alert('خطا در ارسال پاسخ: ' + (result.error || 'ناشناخته'))
      return
    }
    setReply('')
  }

  const handleDelete = async (ticketId: string) => {
    if (confirm('آیا از حذف این تیکت اطمینان دارید؟')) {
      const result = await adminDeleteTicket(ticketId)
      if (!result.success) { alert('خطا در حذف تیکت: ' + (result.error || 'ناشناخته')); return }
      if (selectedTicket === ticketId) setSelectedTicket(null)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-dark mb-6">مدیریت پشتیبانی</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2">
          <h3 className="font-medium text-dark mb-3">تیکت‌ها ({tickets.length})</h3>
          {tickets.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl border border-pink-100">
              <Headphones size={32} className="mx-auto text-pink-200 mb-2" />
              <p className="text-dark-300 text-sm">تیکت فعالی وجود ندارد</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket.id)}
                className={`p-3 rounded-xl cursor-pointer transition-colors border ${
                  selectedTicket === ticket.id
                    ? 'bg-pink-50 border-pink-300'
                    : 'bg-white border-pink-100 hover:border-pink-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-dark text-sm">{ticket.username}</span>
                  <span className="text-xs text-dark-300">{ticket.messages.length} پیام</span>
                </div>
                <p className="text-sm text-dark-300 font-medium">{ticket.subject}</p>
                <p className="text-xs text-dark-300 truncate mt-1">
                  {ticket.messages[ticket.messages.length - 1]?.text}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {activeTicket ? (
            <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden h-[500px] flex flex-col">
              <div className="p-4 border-b border-pink-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-dark">{activeTicket.subject}</h4>
                  <p className="text-sm text-dark-300">{activeTicket.username}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(activeTicket.id)}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.sender === 'admin'
                          ? 'bg-pink text-white'
                          : 'bg-pink-50 text-dark'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <span className={`text-xs mt-1 block ${msg.sender === 'admin' ? 'text-white/70' : 'text-dark-300'}`}>
                        {msg.sender === 'admin' ? 'ادمین' : activeTicket.username}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-pink-100 flex gap-2">
                <Input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="پاسخ به کاربر..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                />
                <Button onClick={handleReply} disabled={!reply.trim()} size="icon">
                  <Send size={18} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-pink-100 h-[500px] flex items-center justify-center">
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto text-pink-200 mb-2" />
                <p className="text-dark-300">یک تیکت را انتخاب کنید</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
