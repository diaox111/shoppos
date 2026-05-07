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
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.__shoppos_errors = [];
            window.addEventListener('error', function(e) {
              window.__shoppos_errors.push('JS: ' + e.message + ' @' + e.filename + ':' + e.lineno);
              var el = document.getElementById('__shoppos_debug');
              if (el) el.textContent = window.__shoppos_errors.join('\\n');
            });
            window.addEventListener('unhandledrejection', function(e) {
              window.__shoppos_errors.push('Promise: ' + (e.reason?.message || String(e.reason)));
              var el = document.getElementById('__shoppos_debug');
              if (el) el.textContent = window.__shoppos_errors.join('\\n');
            });
          `
        }} />
      </head>
      <body className="min-h-screen pb-16">
        <div id="__shoppos_debug" style={{
          display: 'none',
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 99999,
          background: '#fff3cd',
          color: '#856404',
          padding: '8px',
          fontSize: '11px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          maxHeight: '200px',
          overflow: 'auto',
        }} />
        <script dangerouslySetInnerHTML={{
          __html: 'document.getElementById("__shoppos_debug").style.display="block";'
        }} />
        {children}
      </body>
    </html>
  )
}
