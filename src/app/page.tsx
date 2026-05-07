'use client';

import { useState, useEffect, useRef } from 'react';
import {
  createStore, createUser, loginByPin, updateStore,
  upsertProduct, getProductByBarcode, getProductsByStore, updateProductStock,
  createSale, createStockAlert, getStockAlerts,
  initSupplierAds, archiveProduct, getArchivedByBarcode, restoreProduct, markAlertsRead,
  getSupplierAds,
} from '@/lib/db';
import { recognizeBarcode, recognizePhoto } from '@/lib/ai';
import { CATEGORIES, getCategoryLabel } from '@/lib/categories';
import { getAllCities, getCityData, getDefaultDistricts, getPricingFactor, getAreaDesc } from '@/lib/regions';
import BarcodeScannerView from './BarcodeScannerView';
import StoreManagement from './StoreManagement';
import FlipBoard, { InfoTicker } from './FlipBoard';
import PurchasePage from './PurchasePage';
import type { FlipTile } from './FlipBoard';
import { MOCK_PRODUCTS, MOCK_SUPPLIERS, type MockWholesaleProduct, type MockSupplier } from '@/lib/mock-suppliers';
import type { User, Product, CartItem } from '@/types';

const ALL_CITIES = getAllCities();

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState('cashier');
  const [loading, setLoading] = useState(true);

  // Auth
  const [showLogin, setShowLogin] = useState(true);
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');

  // Store setup
  const [showSetup, setShowSetup] = useState(false);
  const [setupName, setSetupName] = useState('');
  const [setupCity, setSetupCity] = useState('');
  const [setupDistrict, setSetupDistrict] = useState('');
  const [setupArea, setSetupArea] = useState('');
  const [setupPin, setSetupPin] = useState('');
  const [pinVisible, setPinVisible] = useState(false);

  // Scan
  const [scanning, setScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [lastBarcode, setLastBarcode] = useState('');
  const [scanError, setScanError] = useState('');

  // Photo
  const [productImage, setProductImage] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Product form
  const [productForm, setProductForm] = useState({
    name: '', category: '', subcategory: '', spec: '',
    cost_price: '', sell_price: '', carton_price: '',
    stock: '0', min_stock: '5',
    production_date: '', shelf_life_value: '', shelf_life_unit: '月' as '年' | '月' | '周' | '日',
    expiry_date: '',
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [abortCtrl, setAbortCtrl] = useState<AbortController | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutMsg, setCheckoutMsg] = useState('');

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Purchase
  const [purchaseList, setPurchaseList] = useState<{ product: Product; qty: number; cost: number }[]>([]);
  const [mockPurchaseList, setMockPurchaseList] = useState<{ wholesale: MockWholesaleProduct; supplier: MockSupplier; price: number; qty: number }[]>([]);

  // Alerts / Ads
  const [alerts, setAlerts] = useState<any[]>([]);
  const [debug, setDebug] = useState('');
  const [supplierAds, setSupplierAds] = useState<any[]>([]);

  const emptyForm = { name: '', category: '', subcategory: '', spec: '', cost_price: '', sell_price: '', carton_price: '', stock: '0', min_stock: '5', production_date: '', shelf_life_value: '', shelf_life_unit: '月' as '年' | '月' | '周' | '日', expiry_date: '' };

  // ── Back button (Android hardware back)
  const lastBackPress = useRef(0);

  // ── Init
  useEffect(() => {
    window.onerror = (msg, src, line) => { setDebug('JS错误: ' + String(msg) + ' 行' + line); return false; };
    window.onunhandledrejection = (e) => { setDebug('未处理Promise: ' + (e.reason?.message || String(e.reason))); };
    initSupplierAds().catch(() => {});
    getSupplierAds().then(ads => setSupplierAds(ads || [])).catch(() => {});
    try { const saved = localStorage.getItem('shoppos_user'); if (saved) { const u = JSON.parse(saved); setUser(u); setShowLogin(false); loadData(u).catch(() => {}); } } catch (_) {}
    setLoading(false);

    // Android back button → double-press to exit
    const handleBack = (e: Event) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastBackPress.current < 2000) {
        (window as any).Capacitor?.App?.exitApp?.();
      } else {
        lastBackPress.current = now;
        setCheckoutMsg('再按一次退出应用');
        setTimeout(() => setCheckoutMsg(''), 2000);
      }
    };
    document.addEventListener('backbutton', handleBack, false);
    return () => document.removeEventListener('backbutton', handleBack);
  }, []);

  const loadData = async (u: User) => {
    try {
      const [prods, alertList] = await Promise.all([getProductsByStore(u.store_id), getStockAlerts(u.store_id)]);
      setProducts(prods.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
      setAlerts(alertList.filter(a => !a.is_read));
    } catch (_) {}
  };

  // ── Auth
  const handleLogin = async () => { setLoginError(''); const found = await loginByPin(loginPin); if (!found) { setLoginError('PIN码错误'); return; } localStorage.setItem('shoppos_user', JSON.stringify(found)); setUser(found); setShowLogin(false); loadData(found); };
  const handleSetup = async () => { if (!setupName || !setupPin) return; const cityName = setupCity + (setupDistrict ? '-' + setupDistrict : '') + (setupArea ? ' ' + setupArea : ''); const store = await createStore(setupName, cityName, setupName + '店主'); const owner = await createUser(store.id, setupName + '店主', 'owner', setupPin); await updateStore(store.id, { owner_name: setupName + '店主', owner_user_id: owner.id }); localStorage.setItem('shoppos_user', JSON.stringify(owner)); setUser(owner); setShowLogin(false); setShowSetup(false); loadData(owner); };
  const handleLogout = () => { localStorage.removeItem('shoppos_user'); setUser(null); setShowLogin(true); setCart([]); };

  // ── Location
  const cityData = getCityData(setupCity);
  const districts = cityData ? cityData.districts : (setupCity ? getDefaultDistricts() : []);
  const areas = districts.find(d => d.name === setupDistrict)?.areas || [];
  const pricingFactor = getPricingFactor(setupCity, setupDistrict, setupArea);
  const areaDesc = getAreaDesc(setupCity, setupDistrict, setupArea);

  // ── AI
  const handleAILookup = async (barcode: string, image?: string) => {
    const ctrl = new AbortController(); setAbortCtrl(ctrl); setAiLoading(true); setDebug(image ? '拍照AI识别...' : 'AI查询: ' + barcode);
    try {
      const data = image ? await recognizePhoto(image, areaDesc, ctrl.signal) : await recognizeBarcode(barcode, areaDesc, ctrl.signal);
      if (pricingFactor !== 1.0) { data.sell_price = Math.round(data.sell_price * pricingFactor * 100) / 100; data.cost_price = Math.round(data.cost_price * pricingFactor * 100) / 100; if (data.carton_price) data.carton_price = Math.round(data.carton_price * pricingFactor * 100) / 100; }
      setAiResult(data);
      setProductForm({ name: data.name || '', category: data.category || '', subcategory: '', spec: data.spec || '', cost_price: data.cost_price ? String(data.cost_price) : '', sell_price: data.sell_price ? String(data.sell_price) : '', carton_price: data.carton_price ? String(data.carton_price) : '', stock: '1', min_stock: '5', production_date: '', shelf_life_value: '', shelf_life_unit: '月', expiry_date: '' });
    } catch (err: any) { if (err?.name !== 'AbortError') setDebug('AI错误: ' + (err?.message || '')); }
    setAiLoading(false); setAbortCtrl(null); setDebug('');
  };
  const cancelAI = () => { if (abortCtrl) { abortCtrl.abort(); setAbortCtrl(null); } setAiLoading(false); setAiResult(null); resetAll(); };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file || !user) return;
    setTab('entry');
    const reader = new FileReader();
    reader.onloadend = () => { const base64 = reader.result as string; setProductImage(base64); handleAILookup('photo-' + Date.now(), base64); };
    reader.readAsDataURL(file); e.target.value = '';
  };

  // ── Save Product
  const handleSaveProduct = async () => {
    if (!user) return;
    const barcode = editingProduct ? editingProduct.barcode : lastBarcode; if (!barcode) return;
    const cat = productForm.subcategory || productForm.category;
    const prodData: any = { store_id: user.store_id, barcode, name: productForm.name, category: cat, spec: productForm.spec, cost_price: Number(productForm.cost_price) || 0, sell_price: Number(productForm.sell_price) || 0, stock: Number(productForm.stock) || 0, min_stock: Number(productForm.min_stock) || 5, created_by: user.id, image_url: productImage || undefined, production_date: productForm.production_date || undefined, shelf_life_value: productForm.shelf_life_value ? Number(productForm.shelf_life_value) : undefined, shelf_life_unit: productForm.shelf_life_value ? productForm.shelf_life_unit : undefined, expiry_date: productForm.expiry_date || undefined };
    if (cat === 'cigarette' && productForm.carton_price) prodData.spec = productForm.spec + '|carton:' + productForm.carton_price;
    await upsertProduct(prodData, editingProduct?.id);
    resetAll(); loadData(user);
  };

  const resetAll = () => { setLastBarcode(''); setManualInput(''); setAiResult(null); setEditingProduct(null); setProductImage(''); setScanError(''); setDebug(''); setProductForm(emptyForm); };
  const resetScan = () => { setLastBarcode(''); setManualInput(''); setAiResult(null); setEditingProduct(null); setProductImage(''); setScanError(''); setDebug(''); };

  const startEditProduct = (p: Product) => {
    setEditingProduct(p); setLastBarcode(p.barcode); setProductImage(p.image_url || '');
    let cartonPrice = ''; let spec = p.spec || '';
    const m = spec.match(/\|carton:(\d+\.?\d*)/); if (m) { cartonPrice = m[1]; spec = spec.replace(/\|carton:\d+\.?\d*/, '').trim(); }
    const parentCat = CATEGORIES.find(c => c.children.some(s => s.value === p.category));
    setProductForm({ name: p.name, category: parentCat?.value || p.category, subcategory: p.category, spec, cost_price: String(p.cost_price || ''), sell_price: String(p.sell_price || ''), carton_price: cartonPrice, stock: String(p.stock), min_stock: String(p.min_stock), production_date: p.production_date?.split('T')[0] || '', shelf_life_value: p.shelf_life_value ? String(p.shelf_life_value) : '', shelf_life_unit: p.shelf_life_unit || '月', expiry_date: p.expiry_date?.split('T')[0] || '' });
    setTab('entry');
  };

  // ── Cart
  const addToCart = (product: Product) => setCart(prev => { const f = prev.find(i => i.id === product.id); if (f) return prev.map(i => i.id === product.id ? { ...i, cartQty: i.cartQty + 1 } : i); return [...prev, { ...product, cartQty: 1 }]; });
  const updateCartQty = (id: string, delta: number) => setCart(prev => prev.map(i => i.id === id ? { ...i, cartQty: Math.max(0, i.cartQty + delta) } : i).filter(i => i.cartQty > 0));
  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const cartTotal = cart.reduce((s, i) => s + (Number(i.sell_price) || 0) * (Number(i.cartQty) || 0), 0);
  const cartCount = cart.reduce((s, i) => s + (Number(i.cartQty) || 0), 0);

  const handleCheckout = async () => {
    if (!user || cart.length === 0) return;
    const items = cart.map(i => ({ product_id: i.id, product_name: i.name, barcode: i.barcode, price: i.sell_price, cost_price: i.cost_price, quantity: i.cartQty }));
    const profit = cart.reduce((s, i) => s + (i.sell_price - i.cost_price) * i.cartQty, 0);
    await createSale(user.store_id, user.id, user.name, cartTotal, cartCount, Math.round(profit * 100) / 100, items);
    for (const item of cart) { const ns = Math.max(0, item.stock - item.cartQty); await updateProductStock(item.id, ns); if (ns <= item.min_stock) await createStockAlert(user.store_id, item.id, ns, item.min_stock); }
    setCheckoutMsg('✅ 收款 ¥' + cartTotal.toFixed(2)); setCart([]); loadData(user); setTimeout(() => setCheckoutMsg(''), 3000);
  };

  // ── Barcode processing (cashier/entry)
  const processBarcode = (code: string, addToCartMode: boolean) => {
    if (!user) return;
    setLastBarcode(code); setManualInput(''); setScanning(false); setScanError(''); setDebug('条码: ' + code);
    getProductByBarcode(user.store_id, code).then(found => {
      if (found) {
        if (addToCartMode) { addToCart(found); setLastBarcode(''); setDebug('✅ 已添加: ' + found.name); }
        else { startEditProduct(found); setDebug('📝 编辑: ' + found.name); }
      } else {
        getArchivedByBarcode(user.store_id, code).then(archived => {
          if (archived) { restoreProduct(archived).then(restored => { setDebug('📦 从历史恢复: ' + restored.name); startEditProduct(restored); loadData(user); }); }
          else { setLastBarcode(code); handleAILookup(code); }
        });
      }
    }).catch(() => { setLastBarcode(code); handleAILookup(code); });
  };

  const handleManualSubmit = (addToCartMode: boolean) => { const code = manualInput.trim(); if (!code) return; processBarcode(code, addToCartMode); };

  // ── Purchase
  const addToPurchase = (p: Product) => { if (purchaseList.find(i => i.product.id === p.id)) return; setPurchaseList(prev => [...prev, { product: p, qty: 1, cost: p.cost_price }]); };
  const removeFromPurchase = (id: string) => setPurchaseList(prev => prev.filter(i => i.product.id !== id));
  const updatePurchaseItem = (id: string, field: 'qty' | 'cost', value: number) => setPurchaseList(prev => prev.map(i => i.product.id === id ? { ...i, [field]: value } : i));

  // Mock supplier purchase
  const handleMockAddToPurchase = (wholesale: MockWholesaleProduct, supplier: MockSupplier, price: number) => {
    if (mockPurchaseList.find(i => i.wholesale.id === wholesale.id && i.supplier.id === supplier.id)) return;
    setMockPurchaseList(prev => [...prev, { wholesale, supplier, price, qty: 1 }]);
  };

  const removeMockPurchase = (wholesaleId: string, supplierId: string) =>
    setMockPurchaseList(prev => prev.filter(i => !(i.wholesale.id === wholesaleId && i.supplier.id === supplierId)));

  const saveMockPurchase = async () => {
    if (!user || mockPurchaseList.length === 0) return;
    for (const item of mockPurchaseList) {
      const barcode = 'wp-' + item.wholesale.id + '-' + Date.now();
      const cat = item.wholesale.category;
      await upsertProduct({
        store_id: user.store_id, barcode,
        name: item.wholesale.name, category: cat,
        spec: item.wholesale.spec + '|from:' + item.supplier.name,
        cost_price: item.price, sell_price: item.wholesale.marketPrice,
        stock: item.qty, min_stock: 5, created_by: user.id,
      });
    }
    setMockPurchaseList([]);
    setCheckoutMsg('✅ 进货完成 ' + mockPurchaseList.length + '种商品');
    loadData(user);
    setTimeout(() => setCheckoutMsg(''), 3000);
  };
  const savePurchase = async () => {
    if (!user || purchaseList.length === 0) return;
    for (const item of purchaseList) {
      const newStock = item.product.stock + item.qty;
      await updateProductStock(item.product.id, newStock);
      await upsertProduct({ store_id: user.store_id, barcode: item.product.barcode, name: item.product.name, category: item.product.category, spec: item.product.spec, cost_price: item.cost, sell_price: item.product.sell_price, stock: newStock, min_stock: item.product.min_stock, created_by: user.id }, item.product.id);
    }
    setPurchaseList([]); setCheckoutMsg('✅ 进货完成 ' + purchaseList.length + '种商品'); loadData(user); setTimeout(() => setCheckoutMsg(''), 3000);
  };

  // ── Helpers
  const isCigarette = productForm.subcategory === 'cigarette' || productForm.category === 'cigarette';
  const isFood = ['beverage','snack','dairy','frozen','grain','condiment'].includes(productForm.category) || ['carbonated','juice','tea','dairy_drink','energy','water','coffee','puffed','biscuit','candy','nuts','meat_snack','jelly','milk','yogurt','cheese','milk_powder','ice_cream','dumpling','meat_frozen','seafood','ice_bar','rice','flour','oil','grain_mix','bread','soy','vinegar','salt_sugar','spice','sauce','oil_sauce'].includes(productForm.subcategory);
  const aiSuggestedPrice = aiResult?.sell_price;
  const aiCartonPrice = aiResult?.carton_price;
  const calcExpiry = (pd: string, v: string, u: string): string => { if (!pd || !v) return ''; const d = new Date(pd); const n = Number(v) || 0; switch (u) { case '年': d.setFullYear(d.getFullYear() + n); break; case '月': d.setMonth(d.getMonth() + n); break; case '周': d.setDate(d.getDate() + n * 7); break; case '日': d.setDate(d.getDate() + n); break; } return d.toISOString().split('T')[0]; };
  const selectedCat = CATEGORIES.find(c => c.value === productForm.category);
  const hasActiveEntry = (lastBarcode !== '' || aiLoading || aiResult !== null) && !editingProduct;

  // ── Loading
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" /></div>;

  // ── Login ──
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col items-center justify-center p-6 overflow-auto">
        <div className="text-6xl mb-4">🏪</div><h1 className="text-3xl font-bold text-white mb-2">商店智能收银</h1><p className="text-blue-200 mb-8 text-sm">扫码录入 · 拍照识别 · AI定价</p>
        <div className="card w-full max-w-sm">
          {!showSetup ? (<>
            <h2 className="text-lg font-bold mb-4">登录收银机</h2>
            <div className="relative mb-3"><input value={loginPin} onChange={e => setLoginPin(e.target.value)} className="input pr-10" placeholder="PIN码" type={pinVisible ? 'text' : 'password'} inputMode="numeric" pattern="[0-9]*" autoComplete="off" /><button onClick={() => setPinVisible(!pinVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{pinVisible ? '🙈' : '👁'}</button></div>
            {loginError && <p className="text-red-500 text-sm mb-3">{loginError}</p>}
            <button onClick={handleLogin} className="btn-primary w-full mb-3">登录</button>
            <button onClick={() => setShowSetup(true)} className="text-blue-600 text-sm w-full text-center">创建店铺 →</button>
          </>) : (<>
            <h2 className="text-lg font-bold mb-4">创建店铺</h2>
            <input value={setupName} onChange={e => setSetupName(e.target.value)} className="input mb-3" placeholder="店铺名称 *" autoComplete="off" />
            <div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">所在城市 *</label><select value={setupCity} onChange={e => { setSetupCity(e.target.value); setSetupDistrict(''); setSetupArea(''); }} className="input"><option value="">选择城市</option>{ALL_CITIES.map(c => <option key={c.name} value={c.name}>{c.province} {c.name}</option>)}</select></div>
            {setupCity && districts.length > 0 && (<div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">所在区域</label><select value={setupDistrict} onChange={e => { setSetupDistrict(e.target.value); setSetupArea(''); }} className="input"><option value="">选择区县</option>{districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}</select></div>)}
            {setupDistrict && areas.length > 0 && (<div className="mb-3"><label className="text-xs text-gray-500 mb-1 block">具体地段</label><select value={setupArea} onChange={e => setSetupArea(e.target.value)} className="input"><option value="">不选</option>{areas.map(a => <option key={a.name} value={a.name}>{a.name} ({a.desc})</option>)}</select></div>)}
            {setupCity && <p className="text-xs text-blue-600 mb-3">📍 {areaDesc}</p>}
            <div className="relative mb-4"><input value={setupPin} onChange={e => setSetupPin(e.target.value.replace(/\D/g, '').slice(0, 6))} className="input pr-10" placeholder="PIN码 (4-6位数字)" type={pinVisible ? 'text' : 'password'} inputMode="numeric" pattern="[0-9]*" autoComplete="off" maxLength={6} /><button onClick={() => setPinVisible(!pinVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{pinVisible ? '🙈' : '👁'}</button></div>
            <button onClick={handleSetup} className="btn-primary w-full mb-3" disabled={setupPin.length < 4}>创建店铺</button>
            <button onClick={() => setShowSetup(false)} className="text-gray-500 text-sm w-full">← 返回</button>
          </>)}
        </div>
      </div>
    );
  }

  if (!user) return null;

  // ═══════════════════════════════════════════════════════
  // MAIN APP
  // ═══════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div><h1 className="font-bold text-lg">🏪 商店收银</h1><p className="text-xs text-gray-500">{user.name}</p></div>
          <div className="flex gap-2 items-center">
            {alerts.length > 0 && (<button onClick={async () => { await markAlertsRead(user.store_id); setAlerts([]); }} className="badge-red cursor-pointer active:opacity-70">{alerts.length} 缺货 ✕</button>)}
            {pricingFactor !== 1.0 && <span className="text-xs text-blue-600">{areaDesc}</span>}
          </div>
        </div>
      </header>

      {/* Flip Board — 智能广告牌 */}
      <FlipBoard tiles={(() => {
        const tiles: FlipTile[] = [];
        const cats = Array.from(new Set(products.map(p => p.category)));

        // 1. Supplier ads matching store categories
        const matchedAds = supplierAds.filter(a => cats.includes(a.category));
        matchedAds.forEach(ad => {
          tiles.push({ icon: '📢', label: '供应商', text: `${ad.product_name} 批发¥${ad.wholesale_price} 零售¥${ad.sell_price} | ${ad.contact}`, color: 'bg-blue-600' });
        });

        // 2. Hot pick — highest margin product
        const highMargin = [...products].sort((a, b) => (b.sell_price - b.cost_price) - (a.sell_price - a.cost_price)).slice(0, 3);
        highMargin.forEach(p => {
          const margin = p.sell_price - p.cost_price;
          tiles.push({ icon: '💰', label: '高毛利', text: `${p.name} 利润¥${margin.toFixed(1)}/件 | 库存${p.stock}`, color: 'bg-green-600' });
        });

        // 3. Stock alerts
        const lowStock = products.filter(p => p.stock <= p.min_stock).slice(0, 3);
        lowStock.forEach(p => {
          tiles.push({ icon: '⚠️', label: '库存预警', text: `${p.name} 仅剩${p.stock}件（预警线${p.min_stock}）`, color: 'bg-red-500' });
        });

        // 4. Category insight
        if (cats.length > 0) {
          const topCat = cats[Math.floor(Math.random() * cats.length)];
          const catProducts = products.filter(p => p.category === topCat);
          tiles.push({ icon: '📊', label: '品类洞察', text: `「${topCat}」类共${catProducts.length}种商品 | 建议关注新品`, color: 'bg-purple-600' });
        }

        // 5. General tips
        tiles.push({ icon: '💡', label: '经营贴士', text: `共${products.length}种商品 · 缺货${alerts.length}种 · 今日已收银`, color: 'bg-amber-600' });

        return tiles;
      })()} />

      {debug && (<div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-xs text-yellow-800 font-mono">🐛 {debug}<button onClick={() => setDebug('')} className="ml-2 text-yellow-600 underline">关闭</button></div>)}

      {/* Bottom Ticker — 广告位下方信息滚动 */}
      <InfoTicker lines={(() => {
        const lines: string[] = [];
        const hotProducts = products.filter(p => p.stock > 0).slice(0, 8);
        hotProducts.forEach(p => {
          const margin = p.sell_price - p.cost_price;
          lines.push(`🔥${p.name} 售¥${p.sell_price} 毛利¥${margin.toFixed(1)}`);
        });
        const storeCats = Array.from(new Set(products.map(p => p.category)));
        const matchedAds = supplierAds.filter(a => storeCats.includes(a.category));
        matchedAds.slice(0, 5).forEach(ad => {
          lines.push(`📢${ad.supplier}: ${ad.product_name} 批发¥${ad.wholesale_price}`);
        });
        if (alerts.length > 0) lines.push(`⚠️ 库存预警: ${alerts.length}种商品低于安全线`);
        if (products.length > 0) {
          const totalValue = products.reduce((s, p) => s + p.stock * p.cost_price, 0);
          lines.push(`📦 库存总值 ¥${totalValue.toFixed(0)} | 共${products.length}种商品`);
        }
        return lines;
      })()} />

      {checkoutMsg && (<div className="fixed top-16 left-4 right-4 z-50 bg-green-600 text-white rounded-xl px-4 py-3 text-center font-bold shadow-lg animate-bounce">{checkoutMsg}</div>)}

      {scanning && <BarcodeScannerView onScan={b => processBarcode(b, tab === 'cashier')} onError={setScanError} onClose={() => setScanning(false)} />}

      {/* ═══ CASHIER TAB — 收银（默认） ═══ */}
      {tab === 'cashier' && (
        <div className="p-4 space-y-3">
          {/* Scan area */}
          {!lastBarcode && !aiLoading && (
            <div className="card text-center py-4">
              <div className="flex gap-2 mb-3">
                <input value={manualInput} onChange={e => setManualInput(e.target.value)} className="input flex-1 text-center" placeholder="扫描或输入条码" inputMode="numeric" autoComplete="off" onKeyDown={e => { if (e.key === 'Enter') handleManualSubmit(true); }} />
                <button onClick={() => handleManualSubmit(true)} className="btn-primary px-4" disabled={!manualInput.trim()}>录入</button>
              </div>
              <div className="flex gap-2 justify-center">
                <button onClick={() => setScanning(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold active:bg-blue-700">📷 扫码</button>
                <label className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold active:bg-green-700 cursor-pointer">🤳 拍照< input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" /></label>
              </div>
              {scanError && <p className="text-red-500 text-xs mt-2">{scanError}</p>}
            </div>
          )}

          {/* Cart items */}
          {cart.length > 0 && (
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="card flex items-center gap-2">
                  {item.image_url && <img src={item.image_url} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0"><p className="font-bold text-sm truncate">{item.name}</p><p className="text-xs text-gray-400">¥{item.sell_price}</p></div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateCartQty(item.id, -1)} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center font-bold active:bg-gray-300">−</button>
                    <span className="font-bold w-6 text-center">{item.cartQty}</span>
                    <button onClick={() => updateCartQty(item.id, 1)} className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold active:bg-blue-600">+</button>
                  </div>
                  <span className="text-lg font-bold text-blue-600 ml-1">¥{(item.sell_price * item.cartQty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {cart.length === 0 && !lastBarcode && (
            <div className="card text-center py-16 text-gray-400"><div className="text-6xl mb-4">🛒</div><p className="text-lg">扫描条码开始收银</p><p className="text-sm mt-2">或点击扫码/拍照按钮</p></div>
          )}

          {/* Checkout bar */}
          {cart.length > 0 && (
            <div className="fixed bottom-20 left-0 right-0 px-4 z-30">
              <div className="card bg-blue-600 text-white flex justify-between items-center shadow-lg">
                <div><span className="text-sm opacity-80">{cartCount}件</span><span className="text-2xl font-bold ml-3">¥{cartTotal.toFixed(2)}</span></div>
                <button onClick={handleCheckout} className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-lg active:bg-blue-50">💳 收款</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ ENTRY TAB — 商品录入 ═══ */}
      {tab === 'entry' && (<ProductEntryView {...{ scanning, setScanning, manualInput, setManualInput, lastBarcode, scanError, aiLoading, aiResult, editingProduct, productImage, productForm, setProductForm, isCigarette, isFood, selectedCat, aiSuggestedPrice, aiCartonPrice, calcExpiry, hasActiveEntry, handleManualSubmit: () => handleManualSubmit(false), handlePhotoCapture, cancelAI, handleSaveProduct, resetAll, processBarcode: (b: string) => processBarcode(b, false), setScanError, setTab }} />)}

      {/* ═══ STOCK TAB — 库存 ═══ */}
      {tab === 'stock' && (
        <div className="p-4 space-y-3">
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input" placeholder="搜索商品..." />
          {products.length === 0 ? (<div className="card text-center py-12"><div className="text-4xl mb-3">📦</div><p className="text-gray-500">还没有商品</p></div>) : (
            products.filter(p => !searchQuery || p.name.includes(searchQuery) || p.barcode.includes(searchQuery)).map(p => {
              const cartonPrice = (p.spec || '').match(/\|carton:(\d+\.?\d*)/);
              return (
                <SwipeableRow key={p.id} onDelete={async () => { await archiveProduct(p.id); loadData(user); }}>
                  <div className="card" onClick={() => startEditProduct(p)}>
                    <div className="flex gap-3">
                      {p.image_url ? <img src={p.image_url} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" /> : <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">📦</div>}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.barcode?.startsWith('photo-') ? '📸 拍照录入' : p.barcode} · {getCategoryLabel(p.category)}</p>
                        <div className="flex gap-2 mt-1 text-xs">
                          <span>进¥{p.cost_price}</span><span className="text-blue-600 font-bold">售¥{p.sell_price}</span>
                          {cartonPrice && <span className="text-orange-500">条¥{cartonPrice[1]}</span>}
                          <span className={p.stock <= p.min_stock ? 'text-red-500' : 'text-green-600'}>库存{p.stock}</span>
                        </div>
                      </div>
                      <div onClick={e => e.stopPropagation()}><button onClick={() => addToCart(p)} className="btn-primary text-xs py-1 px-3">+购物车</button></div>
                    </div>
                  </div>
                </SwipeableRow>
              );
            })
          )}
        </div>
      )}

      {/* ═══ PURCHASE TAB — 进货 ═══ */}
      {tab === 'purchase' && (
        <div>
          {/* Back/Exit bar */}
          <div className="flex items-center px-4 pt-3 pb-1">
            <button onClick={() => setTab('cashier')} className="text-sm text-blue-600 flex items-center gap-1">
              ← 返回收银
            </button>
          </div>
          <PurchasePage storeProducts={products} onAddToPurchase={handleMockAddToPurchase} />

          {/* Mock Purchase List */}
          {mockPurchaseList.length > 0 && (
            <div className="p-4 space-y-2 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-500">🛒 进货清单 ({mockPurchaseList.length}种)</p>
              {mockPurchaseList.map((item, idx) => (
                <div key={idx} className="card flex items-center gap-2">
                  <span className="text-lg">{item.supplier.logo}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.wholesale.name}</p>
                    <p className="text-xs text-gray-400">{item.supplier.name} · ¥{item.price}/件</p>
                  </div>
                  <input type="text" inputMode="numeric" value={item.qty} onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '');
                    const val = raw === '' ? '' : Math.max(1, parseInt(raw) || 1);
                    setMockPurchaseList(prev => prev.map((p, i) => i === idx ? { ...p, qty: val === '' ? 1 : val as number } : p));
                  }}
                    className="w-16 input text-center text-sm" />
                  <button onClick={() => removeMockPurchase(item.wholesale.id, item.supplier.id)} className="text-red-400 text-sm">✕</button>
                </div>
              ))}
              <button onClick={saveMockPurchase} className="btn-primary w-full mt-2">✅ 确认进货 ({mockPurchaseList.length}种)</button>
            </div>
          )}
        </div>
      )}

      {/* ═══ SETTINGS TAB — 设置 ═══ */}
      {tab === 'settings' && user && (
        <StoreManagement
          storeId={user.store_id}
          currentUser={user}
          onStoreUpdated={() => loadData(user)}
          onLogout={handleLogout}
        />
      )}

      {/* ═══ Bottom Nav ═══ */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-end py-2 z-50">
        {[
          { id: 'entry', icon: '📝', label: '商品录入' },
          { id: 'stock', icon: '📦', label: '库存' },
          { id: 'cashier', icon: '📷', label: '收银', center: true },
          { id: 'purchase', icon: '📥', label: '进货' },
          { id: 'settings', icon: '⚙️', label: '设置' },
        ].map(nav => nav.center ? (
          <button key={nav.id} onClick={() => setTab(nav.id)}
            className="flex flex-col items-center -mt-5">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg ${tab === nav.id ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}>
              {nav.icon}
            </div>
            <span className={`text-xs mt-1 ${tab === nav.id ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>{nav.label}</span>
          </button>
        ) : (
          <button key={nav.id} onClick={() => setTab(nav.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1 ${tab === nav.id ? 'text-blue-600' : 'text-gray-500'}`}>
            <span className="text-xl">{nav.icon}</span>
            <span className="text-xs">{nav.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// 商品录入视图（独立组件，减少主组件复杂度）
// ═══════════════════════════════════════════════════════
function ProductEntryView(props: any) {
  const { scanning, setScanning, manualInput, setManualInput, lastBarcode, scanError, aiLoading, aiResult, editingProduct, productImage, productForm, setProductForm, isCigarette, isFood, selectedCat, aiSuggestedPrice, aiCartonPrice, calcExpiry, hasActiveEntry, handleManualSubmit, handlePhotoCapture, cancelAI, handleSaveProduct, resetAll, processBarcode, setScanError, setTab } = props;

  return (
    <div className="p-4 space-y-4">
      {!hasActiveEntry && !editingProduct && (
        <div className="card text-center py-6">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-bold mb-2">商品录入</h2>
          <p className="text-gray-500 text-sm mb-4">扫码 / 拍照 / 手动录入新商品</p>
          <div className="flex gap-3 justify-center mb-4">
            <button onClick={() => setScanning(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold active:bg-blue-700 active:scale-95">📷 扫码</button>
            <label className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold active:bg-green-700 active:scale-95 cursor-pointer">🤳 拍照<input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" /></label>
          </div>
          <div className="flex gap-2"><input value={manualInput} onChange={e => setManualInput(e.target.value)} className="input flex-1 text-center" placeholder="手动输入条码" inputMode="numeric" autoComplete="off" onKeyDown={e => { if (e.key === 'Enter') handleManualSubmit(); }} /><button onClick={handleManualSubmit} className="btn-primary px-4" disabled={!manualInput.trim()}>录入</button></div>
          {scanError && <p className="text-red-500 text-xs mt-3">{scanError}</p>}
        </div>
      )}

      {aiLoading && (<div className="card"><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-3"><div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" /><h3 className="font-bold">🤖 AI 识别中...</h3></div><button onClick={cancelAI} className="bg-red-500 text-white px-4 py-1 rounded-lg text-sm font-bold active:bg-red-600">取消</button></div><p className="text-xs text-gray-500">{lastBarcode?.startsWith('photo-') ? '拍照识别中...' : '条码: ' + lastBarcode}</p></div>)}

      {(aiResult || editingProduct) && !aiLoading && (
        <div className="card">
          <div className="flex justify-between items-center mb-3"><h3 className="font-bold">{editingProduct ? '✏️ 修改商品' : '✅ 识别结果'}</h3><button onClick={resetAll} className="text-gray-400 text-sm">✕ 关闭</button></div>
          {productImage && <div className="mb-3 flex justify-center"><img src={productImage} alt="商品图" className="w-32 h-32 object-cover rounded-xl border border-gray-200" /></div>}
          {!productImage && (
            <label className="mb-3 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-4 cursor-pointer text-gray-400 hover:border-blue-400 hover:text-blue-500">📸 添加商品图片<input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" /></label>
          )}
          <div className="space-y-3">
            {lastBarcode && !lastBarcode.startsWith('photo-') && <div><label className="text-xs text-gray-500">条码</label><p className="font-mono text-sm">{editingProduct ? editingProduct.barcode : lastBarcode}</p></div>}
            {(!lastBarcode || lastBarcode.startsWith('photo-')) && !editingProduct && <p className="text-xs text-gray-300">📸 拍照录入 · 无需条码</p>}
            <div><label className="text-xs text-gray-500 mb-1 block">商品名称 *</label><input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="input" placeholder="输入商品名称" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-xs text-gray-500 mb-1 block">大分类</label><select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value, subcategory: '' })} className="input"><option value="">选择分类</option>{CATEGORIES.map((c: any) => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}</select></div>
              <div><label className="text-xs text-gray-500 mb-1 block">细分类</label><select value={productForm.subcategory} onChange={e => setProductForm({ ...productForm, subcategory: e.target.value })} className="input" disabled={!selectedCat}><option value="">{selectedCat ? '选择细分' : '先选大类'}</option>{selectedCat?.children.map((s: any) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
            </div>
            <div><label className="text-xs text-gray-500 mb-1 block">规格</label><input value={productForm.spec} onChange={e => setProductForm({ ...productForm, spec: e.target.value })} className="input" placeholder="如500ml、100g" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-xs text-gray-500 mb-1 block">{isCigarette ? '整条进价 ¥' : '进价 ¥'}</label><input value={productForm.cost_price} onChange={e => setProductForm({ ...productForm, cost_price: e.target.value })} className="input" type="number" step="0.01" placeholder={aiSuggestedPrice ? 'AI建议 ' + (aiSuggestedPrice * 0.65).toFixed(1) : ''} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">{isCigarette ? '单盒售价 ¥' : '售价 ¥'}</label><input value={productForm.sell_price} onChange={e => setProductForm({ ...productForm, sell_price: e.target.value })} className="input" type="number" step="0.01" placeholder={aiSuggestedPrice ? 'AI建议 ' + aiSuggestedPrice.toFixed(1) : ''} /></div>
            </div>
            {isCigarette && <div><label className="text-xs text-gray-500 mb-1 block">整条售价 ¥ (10盒)</label><input value={productForm.carton_price} onChange={e => setProductForm({ ...productForm, carton_price: e.target.value })} className="input" type="number" step="0.01" placeholder={aiCartonPrice ? 'AI建议 ' + aiCartonPrice : ''} /></div>}
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-xs text-gray-500 mb-1 block">{isCigarette ? '库存 (条)' : '库存 (件)'}</label><input value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} className="input" type="number" placeholder="0" /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">最低库存预警</label><input value={productForm.min_stock} onChange={e => setProductForm({ ...productForm, min_stock: e.target.value })} className="input" type="number" placeholder="5" /></div>
            </div>
            {isFood && (
              <div className="border-t border-gray-100 pt-3">
                <label className="text-xs text-gray-500 mb-2 block font-bold">📅 保质期</label>
                <div className="mb-2"><label className="text-xs text-gray-400 mb-1 block">生产日期</label><input type="date" value={productForm.production_date} onChange={e => { const pd = e.target.value; setProductForm({ ...productForm, production_date: pd, expiry_date: calcExpiry(pd, productForm.shelf_life_value, productForm.shelf_life_unit) }); }} className="input" /></div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">保质期</label><input type="number" value={productForm.shelf_life_value} onChange={e => { const v = e.target.value; setProductForm({ ...productForm, shelf_life_value: v, expiry_date: calcExpiry(productForm.production_date, v, productForm.shelf_life_unit) }); }} className="input" placeholder="数值" min="1" /></div>
                  <div><label className="text-xs text-gray-400 mb-1 block">单位</label><select value={productForm.shelf_life_unit} onChange={e => { const u = e.target.value; setProductForm({ ...productForm, shelf_life_unit: u, expiry_date: calcExpiry(productForm.production_date, productForm.shelf_life_value, u) }); }} className="input"><option value="年">年</option><option value="月">月</option><option value="周">周</option><option value="日">日</option></select></div>
                </div>
                <div><label className="text-xs text-gray-400 mb-1 block">到期日期 {productForm.production_date && productForm.shelf_life_value ? '(自动推算)' : '(手动填写)'}</label><input type="date" value={productForm.expiry_date} onChange={e => setProductForm({ ...productForm, expiry_date: e.target.value })} className="input" /></div>
              </div>
            )}
            <button onClick={handleSaveProduct} className="btn-primary w-full">{editingProduct ? '💾 保存修改' : '💾 保存商品'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// 左滑删除组件
// ═══════════════════════════════════════════════════════
function SwipeableRow({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  const [swiped, setSwiped] = useState(false);
  const startX = useRef(0);
  const translateX = useRef(0);
  return (
    <div className="relative overflow-hidden mb-3">
      <button onClick={onDelete} className="absolute right-0 top-0 bottom-0 w-24 bg-red-500 text-white flex items-center justify-center font-bold text-sm rounded-r-xl">🗑 删除</button>
      <div onTouchStart={e => { startX.current = e.touches[0].clientX; }} onTouchMove={e => { const dx = e.touches[0].clientX - startX.current; if (dx < -20) translateX.current = Math.max(dx, -120); else if (dx > 0 && swiped) translateX.current = Math.min(dx - 120, 0); }} onTouchEnd={() => { if (translateX.current < -60) { translateX.current = -120; setSwiped(true); } else { translateX.current = 0; setSwiped(false); } }} style={{ transform: swiped ? 'translateX(-96px)' : 'translateX(0)', transition: 'transform 0.2s' }}>{children}</div>
    </div>
  );
}
