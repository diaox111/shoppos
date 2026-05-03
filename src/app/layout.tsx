import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '商店智能收银',
  description: '小商店智能收银POS系统 — 扫码录入、AI定价、收银管理',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, title: '收银机' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen pb-16">{children}</body>
    </html>
  )
}
