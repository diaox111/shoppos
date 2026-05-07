'use client';

import { useState, useMemo } from 'react';
import { MOCK_SUPPLIERS, MOCK_PRODUCTS, type MockSupplier, type MockWholesaleProduct } from '@/lib/mock-suppliers';
import { CATEGORIES } from '@/lib/categories';
import type { Product } from '@/types';

interface Props {
  storeProducts: Product[];
  onAddToPurchase: (product: MockWholesaleProduct, supplier: MockSupplier, price: number) => void;
}

type ViewMode = 'products' | 'suppliers';
type SupplierSort = 'distance' | 'supplyCount' | 'rating';

export default function PurchasePage({ storeProducts, onAddToPurchase }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('products');
  const [supplierSort, setSupplierSort] = useState<SupplierSort>('distance');
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedSubcat, setSelectedSubcat] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<MockWholesaleProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAI, setShowAI] = useState(false);

  // ── Supplier helpers ──
  const sortedSuppliers = useMemo(() => {
    const list = [...MOCK_SUPPLIERS];
    if (searchQuery) return list.filter(s => s.name.includes(searchQuery) || s.categories.some(c => c.includes(searchQuery)));
    switch (supplierSort) {
      case 'distance': return list.sort((a, b) => a.distance - b.distance);
      case 'supplyCount': return list.sort((a, b) => b.supplyCount - a.supplyCount);
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
    }
  }, [supplierSort, searchQuery]);

  // ── Product helpers ──
  const catProducts = useMemo(() => MOCK_PRODUCTS.filter(p => !selectedCat || p.category === selectedCat), [selectedCat]);
  const subcatProducts = useMemo(() => catProducts.filter(p => !selectedSubcat || p.subcategory === selectedSubcat), [catProducts, selectedSubcat]);

  const subcategories = useMemo(() => {
    const subs = catProducts.map(p => p.subcategory);
    return Array.from(new Set(subs));
  }, [catProducts]);

  function getSupplier(id: string) { return MOCK_SUPPLIERS.find(s => s.id === id); }

  // ── AI Auto-order ──
  const aiRecommendations = useMemo(() => {
    if (!showAI) return [];
    const lowStock = storeProducts.filter(p => p.stock <= p.min_stock);
    return lowStock.map(p => {
      const match = MOCK_PRODUCTS.find(mp => mp.name.includes(p.name.split(' ')[0]) || p.name.includes(mp.name.split(' ')[0]));
      if (!match) return null;
      const cheapest = match.suppliers.sort((a, b) => a.price - b.price)[0];
      const supplier = getSupplier(cheapest.supplierId);
      return { storeProduct: p, wholesale: match, supplier, price: cheapest.price, suggestQty: Math.max(p.min_stock * 2 - p.stock, 5), reason: p.stock <= 0 ? '库存耗尽' : `库存仅${p.stock}件，低于预警线${p.min_stock}` };
    }).filter(Boolean);
  }, [showAI, storeProducts]);

  return (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">📥 进货</h2>
        <button onClick={() => setShowAI(!showAI)}
          className={`text-xs px-3 py-1.5 rounded-full font-bold ${showAI ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}>
          🤖 AI 自动订货
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {[
          { id: 'products' as const, label: '📦 商品' },
          { id: 'suppliers' as const, label: '🏭 供货商' },
        ].map(t => (
          <button key={t.id} onClick={() => { setViewMode(t.id); setSelectedCat(''); setSelectedSubcat(''); setSelectedProduct(null); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${viewMode === t.id ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ AI Auto-order ═══ */}
      {showAI && (
        <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <h3 className="font-bold text-purple-700 mb-2">🤖 AI 智能进货建议</h3>
          <p className="text-xs text-gray-500 mb-3">基于库存预警、热销趋势、店铺空间综合分析</p>
          {aiRecommendations.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">✅ 库存充足，无需补货</p>
          ) : (
            <div className="space-y-2">
              {aiRecommendations.map((rec: any, i: number) => (
                <div key={i} className="bg-white rounded-xl p-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{rec.storeProduct?.name}</p>
                    <p className="text-xs text-red-500">{rec.reason}</p>
                    <p className="text-xs text-gray-400">
                      {rec.supplier?.name} · ¥{rec.price}/件 · 建议进{rec.suggestQty}件
                    </p>
                  </div>
                  <button onClick={() => rec.wholesale && rec.supplier && onAddToPurchase(rec.wholesale, rec.supplier, rec.price)}
                    className="bg-purple-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex-shrink-0">+ 下单</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ 商品视图 ═══ */}
      {viewMode === 'products' && !selectedProduct && (
        <>
          {/* Category selection */}
          {!selectedCat ? (
            <div className="space-y-2">
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input" placeholder="搜索批发商品..." />
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(cat => {
                  const count = MOCK_PRODUCTS.filter(p => p.category === cat.label).length;
                  return (
                    <button key={cat.value} onClick={() => setSelectedCat(cat.label)}
                      className="card text-center py-3 hover:bg-blue-50 active:bg-blue-100 transition">
                      <div className="text-2xl">{cat.icon}</div>
                      <p className="text-xs font-medium mt-1">{cat.label}</p>
                      <p className="text-xs text-gray-400">{count}种</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : !selectedSubcat ? (
            /* Subcategory selection */
            <div className="space-y-2">
              <button onClick={() => setSelectedCat('')} className="text-sm text-blue-600">← 返回分类</button>
              <h3 className="font-bold">{selectedCat}</h3>
              <div className="grid grid-cols-2 gap-2">
                {subcategories.map(sub => (
                  <button key={sub} onClick={() => setSelectedSubcat(sub)}
                    className="card text-left py-3 px-3 hover:bg-blue-50 active:bg-blue-100">
                    <p className="text-sm font-medium">{sub}</p>
                    <p className="text-xs text-gray-400">{catProducts.filter(p => p.subcategory === sub).length}种</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Product list */
            <div className="space-y-2">
              <button onClick={() => setSelectedSubcat('')} className="text-sm text-blue-600">← {selectedSubcat}</button>
              {subcatProducts.map(p => {
                const cheapest = p.suppliers.sort((a, b) => a.price - b.price)[0];
                const mostExpensive = p.suppliers.sort((a, b) => b.price - a.price)[0];
                return (
                  <div key={p.id} className="card cursor-pointer active:bg-gray-50"
                    onClick={() => setSelectedProduct(p)}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.spec}</p>
                        <p className="text-xs mt-1">
                          <span className="text-blue-600 font-bold">¥{cheapest.price}-{mostExpensive.price}</span>
                          <span className="text-gray-400 ml-1">/ {p.suppliers.length}家供货</span>
                        </p>
                      </div>
                      <span className="text-gray-300 text-lg">›</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ═══ 商品详情（报价对比） ═══ */}
      {viewMode === 'products' && selectedProduct && (
        <div className="space-y-3">
          <button onClick={() => setSelectedProduct(null)} className="text-sm text-blue-600">← 返回列表</button>
          <div className="card">
            <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{selectedProduct.spec}</p>
            <p className="text-xs text-gray-400 mt-1">市场零售参考价：¥{selectedProduct.marketPrice}</p>
          </div>

          <h4 className="font-bold text-sm">📋 供货商报价 ({selectedProduct.suppliers.length}家)</h4>
          {selectedProduct.suppliers
            .sort((a, b) => a.price - b.price)
            .map(sp => {
              const s = getSupplier(sp.supplierId);
              if (!s) return null;
              return (
                <div key={sp.supplierId} className="card flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{s.logo}</span>
                      <div>
                        <p className="font-medium text-sm">{s.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>⭐{s.rating}</span>
                          <span>{s.distance}km</span>
                          <span>起订{sp.minOrder}件</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-blue-600">¥{sp.price}</p>
                    <button onClick={() => onAddToPurchase(selectedProduct, s, sp.price)}
                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded mt-1">+ 进货</button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* ═══ 供货商视图 ═══ */}
      {viewMode === 'suppliers' && (
        <div className="space-y-3">
          {/* Sort controls */}
          <div className="flex gap-2">
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input flex-1" placeholder="搜索供货商..." />
            <select value={supplierSort} onChange={e => setSupplierSort(e.target.value as SupplierSort)} className="input w-28 text-sm">
              <option value="distance">距离近</option>
              <option value="supplyCount">供货多</option>
              <option value="rating">评分高</option>
            </select>
          </div>

          {sortedSuppliers.map(s => (
            <div key={s.id} className="card">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{s.logo}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{s.name}</h3>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">⭐{s.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {s.categories.map(c => <span key={c} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{c}</span>)}
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-gray-400">
                    <span>📍 {s.distance}km</span>
                    <span>📦 供货{s.supplyCount}次</span>
                    <span>📞 {s.contact}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
