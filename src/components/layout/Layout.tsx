import React from 'react'
import Header from './Header'
import type { ViewType } from '@/types'

interface LayoutProps {
  children: React.ReactNode
  currentView: ViewType
  onNavigate: (view: ViewType) => void
}

export default function Layout({ children, currentView, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-cream">
      <Header currentView={currentView} onNavigate={onNavigate} />
      <main className="pb-28">
        {children}
      </main>
    </div>
  )
}
