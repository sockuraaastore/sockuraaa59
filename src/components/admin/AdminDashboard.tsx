import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Package, ShoppingCart, MessageCircle, Image, Headphones, Tag, Ruler, Users } from 'lucide-react'
import AdminProducts from './AdminProducts'
import AdminOrders from './AdminOrders'
import AdminComments from './AdminComments'
import AdminBanners from './AdminBanners'
import AdminSupport from './AdminSupport'
import AdminCategories from './AdminCategories'
import AdminSizes from './AdminSizes'
import AdminGenderAges from './AdminGenderAges'

type AdminTab = 'dashboard' | 'products' | 'orders' | 'comments' | 'banners' | 'categories' | 'sizes' | 'genderAges' | 'support'

export default function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('dashboard')

  const tabs = [
    { id: 'products' as AdminTab, label: 'محصولات', icon: Package },
    { id: 'categories' as AdminTab, label: 'دسته‌بندی‌ها', icon: Tag },
    { id: 'sizes' as AdminTab, label: 'سایزها', icon: Ruler },
    { id: 'genderAges' as AdminTab, label: 'جنسیت و سن', icon: Users },
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

      <div className="relative mb-8">
        <div className="flex gap-2 overflow-x-auto touch-scroll pb-2">
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
        <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-l from-cream to-transparent pointer-events-none md:hidden" />
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {tab === 'products' && <AdminProducts />}
        {tab === 'categories' && <AdminCategories />}
        {tab === 'sizes' && <AdminSizes />}
        {tab === 'genderAges' && <AdminGenderAges />}
        {tab === 'orders' && <AdminOrders />}
        {tab === 'comments' && <AdminComments />}
        {tab === 'banners' && <AdminBanners />}
        {tab === 'support' && <AdminSupport />}
      </motion.div>
    </div>
  )
}
