import React, { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useProducts'
import LoginScreen from '@/components/auth/LoginScreen'
import Layout from '@/components/layout/Layout'
import HeroBanner from '@/components/home/HeroBanner'
import WelcomeHero from '@/components/home/WelcomeHero'
import ProductGrid from '@/components/home/ProductGrid'
import ProductDetail from '@/components/product/ProductDetail'
import SearchView from '@/components/search/SearchView'
import CartView from '@/components/cart/CartView'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import OrderConfirmation from '@/components/checkout/OrderConfirmation'
import ProfileView from '@/components/profile/ProfileView'
import SupportView from '@/components/support/SupportView'
import SupportChat from '@/components/support/SupportChat'
import AdminDashboard from '@/components/admin/AdminDashboard'
import BannerDetail from '@/components/home/BannerDetail'
import MagneticDock, { createDockItems } from '@/components/ui/dock'
import type { ViewType, Product, Banner } from '@/types'

export default function App() {
  const { currentUser, loading, logout } = useAuth()
  const { products } = useProducts()

  const [currentView, setCurrentView] = useState<ViewType>('home')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)

  const navigate = useCallback((view: ViewType) => {
    setCurrentView(view)
    if (view !== 'product-detail') setSelectedProduct(null)
    if (view !== 'banner-detail') setSelectedBanner(null)
    if (view !== 'support-chat') setSelectedTicketId(null)
    window.scrollTo(0, 0)
  }, [])

  const handleViewProduct = useCallback((product: Product) => {
    setSelectedProduct(product)
    setCurrentView('product-detail')
    window.scrollTo(0, 0)
  }, [])

  const handleViewBanner = useCallback((banner: Banner) => {
    setSelectedBanner(banner)
    setCurrentView('banner-detail')
    window.scrollTo(0, 0)
  }, [])

  const handleSelectTicket = useCallback((ticketId: string) => {
    setSelectedTicketId(ticketId)
    setCurrentView('support-chat')
  }, [])

  const handleOrderComplete = useCallback(() => {
    setCurrentView('order-confirmation')
  }, [])

  const handleLogout = useCallback(() => {
    logout()
    window.location.reload()
  }, [logout])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-dark-300 text-lg">در حال بارگذاری...</div>
      </div>
    )
  }

  if (!currentUser) {
    return <LoginScreen />
  }

  const dockItems = createDockItems({
    onHome: () => navigate('home'),
    onSearch: () => navigate('search'),
    onCart: () => navigate('cart'),
    onSupport: () => navigate('support'),
    onAdmin: currentUser.isAdmin ? () => navigate('admin') : undefined,
    onLogout: handleLogout,
  })

  const dockIndex = ['home', 'search', 'cart', 'support'].indexOf(currentView)

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <WelcomeHero />
            <HeroBanner onBannerClick={handleViewBanner} />
            <ProductGrid products={products} onViewDetail={handleViewProduct} />
          </>
        )
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail product={selectedProduct} onBack={() => navigate('home')} />
        ) : null
      case 'banner-detail':
        return selectedBanner ? (
          <BannerDetail banner={selectedBanner} onBack={() => navigate('home')} />
        ) : null
      case 'search':
        return <SearchView onViewDetail={handleViewProduct} />
      case 'cart':
        return <CartView onNavigate={navigate} />
      case 'checkout':
        return <CheckoutForm onNavigate={navigate} onComplete={handleOrderComplete} />
      case 'order-confirmation':
        return <OrderConfirmation onNavigate={navigate} />
      case 'profile':
        return <ProfileView onNavigate={navigate} />
      case 'support':
        return <SupportView onNavigate={navigate} onSelectTicket={handleSelectTicket} />
      case 'support-chat':
        return selectedTicketId ? (
          <SupportChat ticketId={selectedTicketId} onBack={() => navigate('support')} />
        ) : null
      case 'admin':
        return currentUser.isAdmin ? <AdminDashboard /> : null
      default:
        return (
          <>
            <HeroBanner onBannerClick={handleViewBanner} />
            <ProductGrid products={products} onViewDetail={handleViewProduct} />
          </>
        )
    }
  }

  return (
    <Layout currentView={currentView} onNavigate={navigate}>
      {renderView()}

      <MagneticDock
        items={dockItems}
        activeIndex={dockIndex >= 0 ? dockIndex : -1}
      />
    </Layout>
  )
}
