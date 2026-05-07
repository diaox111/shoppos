# 🏪 商店智能收银 POS

小商店 AI 智能经营管理助手 — 扫码识别 · AI定价 · 供应商推荐 · 库存预警

## 功能

- 📷 **扫码/拍照识别商品** — ZXing 实时扫码 + AI 多模态拍照识别
- 🤖 **AI 自动填表** — 品名/分类/规格/售价 一键识别
- 💰 **区域智能定价** — 全国 34 省 300+ 城市商圈景区定价系数
- 📦 **库存管理** — 左滑删除(归档恢复) · 保质期追踪 · 缺货预警
- 📥 **进货管理** — 扫码搜商品→填数量/进价→一键入库
- 🛒 **收银结算** — 扫码即加购物车 · 数量加减 · 一键收款
- 📣 **供应商广告** — 顶部滚动展示批发价和联系方式
- 🚬 **香烟双价** — 单盒售价 + 整条售价分别管理

## 技术栈

Next.js 14 · Capacitor 8 (Android APK) · IndexedDB · ZXing · Tailwind CSS · OpenAI 兼容 AI API

## 安装

```bash
npm install
npm run dev
```

## 构建 APK

```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
# APK 输出: android/app/build/outputs/apk/debug/app-debug.apk
```

## 许可

源码公开可查看，**禁止商用**。
