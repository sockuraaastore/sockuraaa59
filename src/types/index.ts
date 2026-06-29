export interface User {
  id: string
  username: string
  isAdmin: boolean
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stockQuantity: number
  imageUrls: string[]
  category: string[]
  genderAge: string[]
  sizes: ProductSize[]
  createdAt: string
}

export interface Category {
  id: string
  name: string
  createdAt: string
}

export interface Size {
  id: string
  name: string
  createdAt: string
}

export interface GenderAge {
  id: string
  name: string
  createdAt: string
}

export interface ProductSize {
  id: string
  productId: string
  sizeName: string
  stockQuantity: number
  createdAt: string
}

export interface CartItem {
  productId: string
  sizeName: string
  quantity: number
  addedAt: string
}

export interface OrderItem {
  productId: string
  productName: string
  sizeName: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  userId: string
  username: string
  items: OrderItem[]
  total: number
  phone: string
  postalCode: string
  address: string
  receiptImageBase64: string
  status: 'pending' | 'approved' | 'rejected'
  adminMessage: string
  isAdminDeleted: boolean
  createdAt: string
}

export interface Comment {
  id: string
  productId: string
  userId: string
  username: string
  text: string
  isPinned: boolean
  isAdminDeleted: boolean
  createdAt: string
}

export interface Banner {
  id: string
  name: string
  imageUrl: string
  description: string
  isActive: boolean
  createdAt: string
}

export interface Article {
  id: string
  title: string
  imageUrl: string
  description: string
  videoUrl: string
  isActive: boolean
  createdAt: string
}

export interface SupportMessage {
  id: string
  sender: 'user' | 'admin'
  text: string
  createdAt: string
}

export interface SupportTicket {
  id: string
  userId: string
  username: string
  subject: string
  messages: SupportMessage[]
  isAdminDeleted: boolean
  createdAt: string
}

export type ViewType =
  | 'home'
  | 'search'
  | 'cart'
  | 'profile'
  | 'support'
  | 'product-detail'
  | 'checkout'
  | 'admin'
  | 'banner-detail'
  | 'support-chat'
  | 'order-confirmation'
  | 'purchases'
  | 'about'
  | 'articles'
  | 'article-detail'

export const STORAGE_KEYS = {
  CART: 'sockuraaa_cart',
} as const
