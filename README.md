# 商店智能收银 POS

小商店智能收银系统 — 手机扫码录入商品、AI自动识别定价、收银管理、库存预警、供应商新品推荐。

## 功能

- 📷 **扫码录入** — 手机摄像头扫描条形码
- 🤖 **AI 智能识别** — DeepSeek 自动识别商品名称、分类、建议售价
- 🛒 **收银台** — 连续扫码加入购物车，自动计算总金额
- 📦 **商品管理** — 搜索、编辑、库存追踪
- 🔔 **库存预警** — 低库存自动提醒 + 供应商新品推荐
- 👥 **多角色** — 店长/店员，权限分离
- 📱 **PWA** — 可添加到手机桌面，像原生 App

## 部署步骤

1. 创建 Supabase 项目：https://supabase.com
2. 在 SQL Editor 中执行 `supabase_schema.sql`
3. 复制 `.env.example` 为 `.env`，填入 Supabase URL/Key + DeepSeek Key
4. `npm install && npm run dev`
5. 用手机浏览器打开（需要在同一网络），或部署到 Vercel

## 技术栈

Next.js 14 · Supabase · DeepSeek AI · html5-qrcode · Tailwind CSS · PWA
