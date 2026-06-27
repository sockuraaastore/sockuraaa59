import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Package, ShoppingCart, MessageCircle, Image, Headphones } from 'lucide-react'
import AdminProducts from './AdminProducts'
import AdminOrders from './AdminOrders'
import AdminComments from './AdminComments'
import AdminBanners from './AdminBanners'
import AdminSupport from './AdminSupport'

type AdminTab = 'dashboard' | 'products' | 'orders' | 'comments' | 'banners' | 'support'

export default function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('dashboard')

  const tabs = [
    { id: 'products' as AdminTab, label: 'محصولات', icon: Package },
    { id: 'orders' as AdminTab, label: 'سفارشات', icon: ShoppingCart },
    { id: 'comments' as AdminTab, label: 'نظرات', icon: MessageCircle },
    { id: 'banners' as AdminTab, label: 'بنرها', icon: Image },
    { id: 'support' as AdminTab, label: 'پشتیبانی', icon: Headphones },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <LayoutDashboard size={28} className="text-pink" />
        <h1 className="text-3xl font-black text-dark">پنل مدیریت</h1>
      </motion.div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={tab === id ? 'default' : 'ghost'}
            onClick={() => setTab(id)}
            className="gap-2 whitespace-nowrap"
          >
            <Icon size={16} />
            {label}
          </Button>
        ))}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {tab === 'products' && <AdminProducts />}
        {tab === 'orders' && <AdminOrders />}
        {tab === 'comments' && <AdminComments />}
        {tab === 'banners' && <AdminBanners />}
        {tab === 'support' && <AdminSupport />}
      </motion.div>
    </div>
  )
}
