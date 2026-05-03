'use client';

import { useState, useEffect } from 'react';
import {
  createStore, createUser, loginByPin, getStaffByStore, removeUser,
  upsertProduct, getProductByBarcode, getProductsByStore, updateProductStock,
  createSale, createStockAlert, getStockAlerts,
  initSupplierAds, getSupplierAds,
} from '@/lib/db';
import type { User, Product, CartItem, StockAlert, SupplierAd } from '@/types';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState('scan');
  const [loading, setLoading] = useState(true);

  // Auth
  const [showLogin, setShowLogin] = useState(true);
  const [loginStore, setLoginStore] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');

  // Store setup
  const [showSetup, setShowSetup] = useState(false);
  const [setupName, setSetupName] = useState('');
  const [setupCity, setSetupCity] = useState('');
  const [setupPin, setSetupPin] = useState('');

  // Scan
  const [scanning, setScanning] = useState(false);
  const [lastBarcode, setLastBarcode] = useState('');
  const [scanError, setScanError] = useState('');

  // Product
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '', category: '', spec: '', cost_price: '', sell_price: '', stock: '0', min_stock: '5'
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutMsg, setCheckoutMsg] = useState('');

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Alerts + Ads
  const [alerts, setAlerts] = useState<(StockAlert & { product_name?: string })[]>([]);
  const [ads, setAds] = useState<SupplierAd[]>([]);
  const [adProduct, setAdProduct] = useState<Product | null>(null);

  // Staff
  const [staffList, setStaffList] = useState<User[]>([]);

  // ── Init ────────────────────────────────────────────
  useEffect(() => {
    initSupplierAds();
    const saved = localStorage.getItem('shoppos_user');
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      setShowLogin(false);
      loadData(u);
    }
    setLoading(false);
  }, []);

  const loadData = async (u: User) => {
    try {
      const [prods, alertList, adList, staff] = await Promise.all([
        getProductsByStore(u.store_id),
        getStockAlerts(u.store_id),
        getSupplierAds(),
        u.role === 'owner' ? getStaffByStore(u.store_id) : Promise.resolve([]),
      ]);
      setProducts(prods.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
      setAlerts(alertList.filter(a => !a.is_read));
      setAds(adList);
      setStaffList(staff);
    } catch (e) { console.error(e); }
  };

  // ── Auth ────────────────────────────────────────────
  const handleLogin = async () => {
    setLoginError('');
    const found = await loginByPin(loginPin);
    if (!found) { setLoginError('PIN 码错误'); return; }
    if (loginStore) {
      // Verify invite code — for now accept any matching store
      const staff = await getStaffByStore(found.store_id);
      // Simple: just check user exists with that PIN
    }
    localStorage.setItem('shoppos_user', JSON.stringify(found));
    setUser(found);
    setShowLogin(false);
    loadData(found);
  };

  const handleSetup = async () => {
    if (!setupName || !setupPin) return;
    const store = await createStore(setupName, setupCity);
    const owner = await createUser(store.id, '店长', 'owner', setupPin);
    localStorage.setItem('shoppos_user', JSON.stringify(owner));
    setUser(owner);
    setShowLogin(false);
    setShowSetup(false);
    loadData(owner);
  };

  const handleLogout = () => { localStorage.removeItem('shoppos_user'); setUser(null); setShowLogin(true); setCart([]); };

  // ── AI ──────────────────────────────────────────────
  const handleAILookup = async (barcode: string) => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode })
      });
      const data = await res.json();
      setAiResult(data);
      setProductForm({
        name: data.name || '',
        category: data.category || '',
        spec: data.spec || '',
        cost_price: data.cost_price ? String(data.cost_price) : '',
        sell_price: data.sell_price ? String(data.sell_price) : '',
        stock: '1',
        min_stock: '5',
      });
    } catch (e) { console.error(e); }
    setAiLoading(false);
  };

  // ── Product Actions ─────────────────────────────────
  const handleSaveProduct = async () => {
    if (!user) return;
    const productData = {
      store_id: user.store_id,
      barcode: lastBarcode,
      name: productForm.name,
      category: productForm.category,
      spec: productForm.spec,
      cost_price: Number(productForm.cost_price) || 0,
      sell_price: Number(productForm.sell_price) || 0,
      stock: Number(productForm.stock) || 0,
      min_stock: Number(productForm.min_stock) || 5,
      created_by: user.id,
    };

    const existing = await getProductByBarcode(user.store_id, lastBarcode);
    const saved = await upsertProduct(productData, existing?.id);

    setFoundProduct(null);
    setLastBarcode('');
    setAiResult(null);
    loadData(user);

    // Low stock alert → show ads
    if (Number(productForm.stock) <= Number(productForm.min_stock)) {
      setAdProduct(saved);
      const relatedAds = await getSupplierAds(productForm.category);
      if (relatedAds.length > 0) setAds(relatedAds);
    }
  };

  // ── Cart / POS ──────────────────────────────────────
  const addToCart = (product: Product) => {
    setCart(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) return prev.map(i => i.id === product.id ? { ...i, cartQty: i.cartQty + 1 } : i);
      if (product.stock <= 0) return prev; // Don't add if out of stock
      return [...prev, { ...product, cartQty: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));

  const cartTotal = cart.reduce((sum, item) => sum + item.sell_price * item.cartQty, 0);

  const handleCheckout = async () => {
    if (!user || cart.length === 0) return;
    const items = cart.map(i => ({
      product_id: i.id, product_name: i.name,
      barcode: i.barcode, price: i.sell_price, quantity: i.cartQty
    }));
    await createSale(user.store_id, user.id, cartTotal, cart.reduce((s, i) => s + i.cartQty, 0), items);
    for (const item of cart) {
      const newStock = Math.max(0, item.stock - item.cartQty);
      await updateProductStock(item.id, newStock);
      if (newStock <= item.min_stock) {
        await createStockAlert(user.store_id, item.id, newStock, item.min_stock);
      }
    }
    setCheckoutMsg(`✅ 收银成功！共 ¥${cartTotal.toFixed(2)}`);
    setCart([]);
    loadData(user);
    setTimeout(() => setCheckoutMsg(''), 3000);
  };

  // ── Scan ────────────────────────────────────────────
  const handleScanBarcode = (barcode: string) => {
    if (!user) return;
    setLastBarcode(barcode);
    setScanning(false);
    setScanError('');
    getProductByBarcode(user.store_id, barcode).then(found => {
      if (found) {
        setFoundProduct(found);
        addToCart(found);
      } else {
        handleAILookup(barcode);
      }
    });
  };

  // ── Staff ───────────────────────────────────────────
  const handleAddStaff = async (name: string, pin: string) => {
    if (!user || !name || !pin) return;
    await createUser(user.store_id, name, 'staff', pin);
    loadData(user);
  };

  const handleRemoveStaff = async (staffId: string) => {
    await removeUser(staffId);
    loadData(user!);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" /></div>;

  // ── Login ────────────────────────────────────────────
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col items-center justify-center p-6">
        <div className="text-6xl mb-4">🏪</div>
        <h1 className="text-3xl font-bold text-white mb-2">商店智能收银</h1>
        <p className="text-blue-200 mb-8">扫码录入 · AI定价 · 离线可用</p>

        <div className="card w-full max-w-sm">
          {!showSetup ? (
            <>
              <h2 className="text-lg font-bold mb-4">登录收银机</h2>
              <input value={loginPin} onChange={e => setLoginPin(e.target.value)} className="input mb-3" type="password" placeholder="PIN 码" />
              {loginError && <p className="text-red-500 text-sm mb-3">{loginError}</p>}
              <button onClick={handleLogin} className="btn-primary w-full mb-3">登录</button>
              <button onClick={() => setShowSetup(true)} className="text-blue-600 text-sm w-full text-center">还没有店铺？创建店铺 →</button>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold mb-4">创建你的店铺</h2>
              <input value={setupName} onChange={e => setSetupName(e.target.value)} className="input mb-3" placeholder="店铺名称 *" />
              <input value={setupCity} onChange={e => setSetupCity(e.target.value)} className="input mb-3" placeholder="所在城市" />
              <input value={setupPin} onChange={e => setSetupPin(e.target.value)} className="input mb-4" type="password" placeholder="店长 PIN 码 (4-6位) *" />
              <button onClick={handleSetup} className="btn-primary w-full mb-3">创建店铺</button>
              <button onClick={() => setShowSetup(false)} className="text-gray-500 text-sm w-full">← 返回登录</button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!user) return null;

  // ── Main App ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="font-bold text-lg">🏪 商店收银</h1>
            <p className="text-xs text-gray-500">{user.name} · {user.role === 'owner' ? '店长' : '店员'}</p>
          </div>
          <div className="flex gap-2">
            {alerts.length > 0 && <span className="badge-red">{alerts.length} 缺货</span>}
          </div>
        </div>
      </header>

      {checkoutMsg && (
        <div className="fixed top-16 left-4 right-4 z-50 bg-green-600 text-white rounded-xl px-4 py-3 text-center font-bold shadow-lg animate-bounce">
          {checkoutMsg}
        </div>
      )}

      {/* ── TAB: Scan ──────────────────────────────────── */}
      {tab === 'scan' && (
        <div className="p-4 space-y-4">
          {!scanning && !lastBarcode && !foundProduct && (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">📷</div>
              <h2 className="text-xl font-bold mb-2">扫码录入商品</h2>
              <p className="text-gray-500 text-sm mb-4">扫描商品条形码，AI 自动识别</p>
              <button onClick={() => setScanning(true)} className="btn-primary text-lg px-8">开始扫码</button>
              <p className="text-xs text-gray-400 mt-3">或手动输入条码</p>
              <input value={lastBarcode} onChange={e => setLastBarcode(e.target.value)} className="input mt-2 text-center" placeholder="输入条码数字"
                onKeyDown={e => e.key === 'Enter' && handleScanBarcode(lastBarcode)} />
            </div>
          )}

          {scanning && (
            <div className="card text-center py-8">
              <div className="text-4xl mb-4 animate-pulse">📷</div>
              <p className="text-gray-600 mb-4">将条码对准摄像头</p>
              <ScanComponent onScan={handleScanBarcode} onError={setScanError} />
              <button onClick={() => setScanning(false)} className="text-gray-500 mt-4">取消</button>
              {scanError && <p className="text-red-500 text-sm mt-2">{scanError}</p>}
            </div>
          )}

          {/* AI Form */}
          {(aiLoading || aiResult) && (
            <div className="card">
              <h3 className="font-bold mb-3">{aiLoading ? '🤖 AI 正在识别...' : '✅ AI 识别完成'}</h3>
              {aiLoading && <div className="animate-pulse space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-4 bg-gray-200 rounded w-1/2" /></div>}
              {aiResult && (
                <div className="space-y-3">
                  <div><label className="text-xs text-gray-500">条码</label><p className="font-mono">{lastBarcode}</p></div>
                  <input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="input" placeholder="商品名称 *" />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="input" placeholder="分类" />
                    <input value={productForm.spec} onChange={e => setProductForm({ ...productForm, spec: e.target.value })} className="input" placeholder="规格" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-xs text-gray-500">进价 ¥</label><input value={productForm.cost_price} onChange={e => setProductForm({ ...productForm, cost_price: e.target.value })} className="input" type="number" /></div>
                    <div><label className="text-xs text-gray-500">售价 ¥ <span className="text-blue-500">AI建议: ¥{aiResult.sell_price}</span></label><input value={productForm.sell_price} onChange={e => setProductForm({ ...productForm, sell_price: e.target.value })} className="input" type="number" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} className="input" placeholder="当前库存" type="number" />
                    <input value={productForm.min_stock} onChange={e => setProductForm({ ...productForm, min_stock: e.target.value })} className="input" placeholder="最低库存预警" type="number" />
                  </div>
                  <button onClick={handleSaveProduct} className="btn-primary w-full">💾 保存商品</button>
                </div>
              )}
            </div>
          )}

          {/* Stock Alerts + Ads */}
          {adProduct && (
            <div className="card border-2 border-yellow-300 bg-yellow-50">
              <h3 className="font-bold text-yellow-800 mb-2">⚠️ 库存不足 — {adProduct.name} 仅剩 {adProduct.stock} 件</h3>
              {ads.length > 0 && (
                <div>
                  <p className="text-sm text-yellow-700 mb-2">📢 推荐替代新品（供应商直供）：</p>
                  <div className="space-y-2">
                    {ads.slice(0, 3).map((ad, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 flex justify-between items-center">
                        <div><p className="font-medium text-sm">{ad.product_name}</p><p className="text-xs text-gray-500">{ad.supplier} · 批发 ¥{ad.wholesale_price}</p></div>
                        <span className="badge-blue">{ad.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={() => { setAdProduct(null); setAds([]); }} className="text-sm text-yellow-700 mt-2">关闭</button>
            </div>
          )}

          {/* Quick-add existing products */}
          {products.slice(0, 10).map(p => (
            <div key={p.id} className="card flex items-center justify-between cursor-pointer active:bg-gray-50" onClick={() => addToCart(p)}>
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-gray-500">{p.barcode} · 库存 {p.stock}{p.stock <= p.min_stock ? ' ⚠️' : ''}</p>
              </div>
              <span className="text-lg font-bold text-blue-600">¥{p.sell_price}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: Products ───────────────────────────────── */}
      {tab === 'products' && (
        <div className="p-4 space-y-4">
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input" placeholder="搜索商品名称或条码..." />
          {products.filter(p => !searchQuery || p.name.includes(searchQuery) || p.barcode.includes(searchQuery)).map(p => (
            <div key={p.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.barcode} · {p.category} · {p.spec}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-sm">进 ¥{p.cost_price}</span>
                    <span className="text-sm font-bold text-blue-600">售 ¥{p.sell_price}</span>
                    <span className={p.stock <= p.min_stock ? 'badge-red' : 'badge-green'}>库存 {p.stock}</span>
                  </div>
                </div>
                <button onClick={() => addToCart(p)} className="btn-primary text-sm py-1 px-3">加入购物车</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: Cart ───────────────────────────────────── */}
      {tab === 'cart' && (
        <div className="p-4 space-y-4">
          <h2 className="text-xl font-bold">🛒 购物车</h2>
          {cart.length === 0 ? <div className="card text-center py-8 text-gray-400">购物车是空的，去扫码添加商品吧</div> : (
            <>
              {cart.map(item => (
                <div key={item.id} className="card flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">¥{item.sell_price} × {item.cartQty}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">¥{(item.sell_price * item.cartQty).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500">✕</button>
                  </div>
                </div>
              ))}
              <div className="card bg-blue-50 border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">总计</span>
                  <span className="text-3xl font-bold text-blue-600">¥{cartTotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{cart.reduce((s, i) => s + i.cartQty, 0)} 件商品</p>
              </div>
              <button onClick={handleCheckout} className="btn-primary w-full text-lg">💳 确认收款 ¥{cartTotal.toFixed(2)}</button>
            </>
          )}
        </div>
      )}

      {/* ── TAB: Admin ───────────────────────────────────── */}
      {tab === 'admin' && (
        <div className="p-4 space-y-4">
          <h2 className="text-xl font-bold">⚙️ 管理</h2>

          {user.role === 'owner' && (
            <div className="card">
              <h3 className="font-bold mb-3">👥 店员管理</h3>
              {staffList.filter(s => s.role === 'staff').map(s => (
                <div key={s.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span>{s.name}</span>
                  <button onClick={() => handleRemoveStaff(s.id)} className="text-red-500 text-sm">移除</button>
                </div>
              ))}
              <StaffAddForm onAdd={handleAddStaff} />
            </div>
          )}

          <div className="card">
            <h3 className="font-bold mb-2">📋 店铺信息</h3>
            <p className="text-sm">角色：{user.role === 'owner' ? '店长' : '店员'}</p>
            <p className="text-sm text-gray-500">商品数：{products.length}</p>
            <p className="text-xs text-gray-400 mt-1">💾 数据存储在浏览器本地</p>
          </div>

          <button onClick={handleLogout} className="btn-outline w-full text-red-500 border-red-500">退出登录</button>
        </div>
      )}

      {/* ── Bottom Nav ──────────────────────────────────── */}
      <nav className="bottom-nav">
        {[
          { id: 'scan', icon: '📷', label: '扫码' },
          { id: 'products', icon: '📦', label: '商品' },
          { id: 'cart', icon: '🛒', label: cart.length > 0 ? `收银(${cart.length})` : '收银' },
          { id: 'admin', icon: '⚙️', label: '管理' },
        ].map(nav => (
          <button key={nav.id} onClick={() => setTab(nav.id)} className={`bottom-nav-item ${tab === nav.id ? 'active' : ''}`}>
            <span className="text-xl">{nav.icon}</span>
            <span>{nav.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ── Scan Component ─────────────────────────────────────
function ScanComponent({ onScan, onError }: { onScan: (barcode: string) => void; onError: (msg: string) => void }) {
  const [manual, setManual] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    let scanner: any = null;
    if (!manual) {
      import('html5-qrcode').then(({ Html5Qrcode }) => {
        scanner = new Html5Qrcode('scanner');
        scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 150 } },
          (decodedText: string) => { if (decodedText) { onScan(decodedText); scanner?.stop(); } },
          () => {}
        ).catch(() => { setManual(true); onError('无法访问摄像头，请手动输入'); });
      }).catch(() => setManual(true));
    }
    return () => { if (scanner) scanner.stop().catch(() => {}); };
  }, []);

  return (
    <div>
      <div id="scanner" className="w-full max-w-sm mx-auto rounded-xl overflow-hidden" />
      {manual && (
        <div className="mt-4">
          <input value={input} onChange={e => setInput(e.target.value)} className="input text-center" placeholder="手动输入条码"
            onKeyDown={e => e.key === 'Enter' && input && onScan(input)} />
        </div>
      )}
    </div>
  );
}

// ── Staff Add Form ─────────────────────────────────────
function StaffAddForm({ onAdd }: { onAdd: (name: string, pin: string) => void }) {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [show, setShow] = useState(false);

  if (!show) return <button onClick={() => setShow(true)} className="text-blue-600 text-sm mt-2">+ 添加店员</button>;

  return (
    <div className="mt-2 space-y-2">
      <input value={name} onChange={e => setName(e.target.value)} className="input" placeholder="店员姓名" />
      <input value={pin} onChange={e => setPin(e.target.value)} className="input" type="password" placeholder="PIN 码" />
      <div className="flex gap-2">
        <button onClick={() => { onAdd(name, pin); setName(''); setPin(''); setShow(false); }} className="btn-primary text-sm flex-1">确定</button>
        <button onClick={() => setShow(false)} className="btn-outline text-sm">取消</button>
      </div>
    </div>
  );
}
