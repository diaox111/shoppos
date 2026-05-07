'use client';

import { useState, useEffect } from 'react';
import { getStore, updateStore, getStaffByStore, createUser, removeUser, getRevenueStats } from '@/lib/db';
import type { Store, User, RevenueStats } from '@/types';

interface Props {
  storeId: string;
  currentUser: User;
  onStoreUpdated: () => void;
  onLogout: () => void;
}

export default function StoreManagement({ storeId, currentUser, onStoreUpdated, onLogout }: Props) {
  const [subtab, setSubtab] = useState<'info' | 'staff' | 'revenue'>('info');
  const [store, setStore] = useState<Store | null>(null);
  const [staff, setStaff] = useState<User[]>([]);
  const [revenue, setRevenue] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Form
  const [form, setForm] = useState({ name: '', address: '', phone: '', license_no: '', business_scope: '' });

  // Add staff
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPin, setNewStaffPin] = useState('');

  const isOwner = currentUser.role === 'owner';

  useEffect(() => { loadData(); }, [storeId]);

  async function loadData() {
    setLoading(true);
    const s = await getStore(storeId);
    if (s) {
      setStore(s);
      setForm({ name: s.name, address: s.address || '', phone: s.phone || '', license_no: s.license_no || '', business_scope: s.business_scope || '' });
    }
    const st = await getStaffByStore(storeId);
    setStaff(st);
    const rev = await getRevenueStats(storeId);
    setRevenue(rev);
    setLoading(false);
  }

  async function handleSaveInfo() {
    if (!form.name.trim()) return;
    setSaving(true); setMsg('');
    try {
      await updateStore(storeId, {
        name: form.name.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        license_no: form.license_no.trim(),
        business_scope: form.business_scope.trim(),
      });
      setMsg('✅ 门店信息已保存');
      onStoreUpdated();
    } catch { setMsg('❌ 保存失败'); }
    setSaving(false);
  }

  async function handleAddStaff() {
    if (!newStaffName.trim() || !newStaffPin.trim()) return;
    try {
      await createUser(storeId, newStaffName.trim(), 'staff', newStaffPin.trim());
      setNewStaffName(''); setNewStaffPin('');
      setMsg('✅ 店员已添加');
      const st = await getStaffByStore(storeId);
      setStaff(st);
    } catch { setMsg('❌ 添加失败'); }
  }

  async function handleRemoveStaff(id: string) {
    try {
      await removeUser(id);
      const st = await getStaffByStore(storeId);
      setStaff(st);
      setMsg('✅ 店员已移除');
    } catch { setMsg('❌ 操作失败'); }
  }

  if (loading) return <div className="p-4 text-center text-gray-400">加载中...</div>;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">⚙️ 门店管理</h2>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{currentUser.role === 'owner' ? '👑 店主' : '👤 店员'}</span>
      </div>

      {/* Sub Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {[
          { id: 'info' as const, label: '📋 门店信息' },
          { id: 'staff' as const, label: '👥 店员' },
          { id: 'revenue' as const, label: '📊 营收' },
        ].map(t => (
          <button key={t.id} onClick={() => setSubtab(t.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${subtab === t.id ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {msg && <div className={`text-sm p-2 rounded-lg ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{msg}</div>}

      {/* ═══ 门店信息 ═══ */}
      {subtab === 'info' && (
        <div className="space-y-3">
          <div className="card">
            <h3 className="font-bold mb-3">📋 基本信息</h3>
            <div className="space-y-2">
              <div><label className="text-xs text-gray-500 mb-1 block">店名 *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" placeholder="店铺名称" /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">详细地址</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="input" placeholder="省市区街道门牌号" /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">联系电话</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input" placeholder="手机或座机号" /></div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold mb-3">📜 证照信息</h3>
            <div className="space-y-2">
              <div><label className="text-xs text-gray-500 mb-1 block">营业执照号</label>
                <input value={form.license_no} onChange={e => setForm({ ...form, license_no: e.target.value })} className="input" placeholder="统一社会信用代码" /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">经营范围</label>
                <textarea value={form.business_scope} onChange={e => setForm({ ...form, business_scope: e.target.value })} className="input h-20 resize-none" placeholder="例如：食品销售、烟草制品零售、日用百货..." /></div>
            </div>
          </div>

          <div className="card bg-gray-50">
            <p className="text-xs text-gray-400"><span className="font-bold">邀请码：</span><code className="bg-gray-200 px-1 rounded">{store?.invite_code}</code> — 店员凭此码加入</p>
            <p className="text-xs text-gray-400 mt-1"><span className="font-bold">店主：</span>{store?.owner_name || '未设置'}</p>
            <p className="text-xs text-gray-400 mt-1"><span className="font-bold">城市：</span>{store?.city || '未选择'}</p>
            <p className="text-xs text-gray-400 mt-1"><span className="font-bold">创建：</span>{store?.created_at ? new Date(store.created_at).toLocaleDateString('zh-CN') : '-'}</p>
          </div>

          <button onClick={handleSaveInfo} disabled={saving}
            className="btn-primary w-full">{saving ? '保存中...' : '💾 保存门店信息'}</button>
        </div>
      )}

      {/* ═══ 店员管理 ═══ */}
      {subtab === 'staff' && (
        <div className="space-y-3">
          <div className="card">
            <h3 className="font-bold mb-3">👥 店员列表 ({staff.length}人)</h3>
            {staff.length === 0 && <p className="text-gray-400 text-sm text-center py-4">暂无店员</p>}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {staff.map(u => (
                <div key={u.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{u.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${u.role === 'owner' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role === 'owner' ? '👑 店主' : '店员'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">PIN: {u.pin}</p>
                  </div>
                  {isOwner && u.role !== 'owner' && (
                    <button onClick={() => handleRemoveStaff(u.id)}
                      className="text-red-500 text-xs px-2 py-1 rounded hover:bg-red-50">移除</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isOwner && (
            <div className="card">
              <h3 className="font-bold mb-3">➕ 添加店员</h3>
              <div className="space-y-2">
                <input value={newStaffName} onChange={e => setNewStaffName(e.target.value)} className="input" placeholder="店员姓名" />
                <input value={newStaffPin} onChange={e => setNewStaffPin(e.target.value)} className="input" type="password" placeholder="设置登录PIN码（数字）" inputMode="numeric" />
                <button onClick={handleAddStaff} disabled={!newStaffName.trim() || !newStaffPin.trim()}
                  className="btn-primary w-full">➕ 添加店员</button>
              </div>
            </div>
          )}

          {!isOwner && <div className="card bg-gray-50 text-center text-sm text-gray-400">只有店主可以管理店员</div>}
        </div>
      )}

      {/* ═══ 营收看板 ═══ */}
      {subtab === 'revenue' && (
        <div className="space-y-3">
          {!revenue ? (
            <div className="card text-center py-8 text-gray-400">暂无数据</div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '📅 今日', data: revenue.today },
                  { label: '📆 昨日', data: revenue.yesterday },
                  { label: '📊 本周', data: revenue.thisWeek },
                  { label: '🗓️ 本月', data: revenue.thisMonth },
                ].map(card => (
                  <div key={card.label} className="card">
                    <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                    <p className="text-lg font-bold text-blue-600">¥{card.data.amount.toLocaleString()}</p>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-400">{card.data.count}笔</span>
                      <span className="text-green-600">+¥{card.data.profit.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Profit highlight */}
              <div className="card bg-gradient-to-r from-green-50 to-blue-50">
                <p className="text-xs text-gray-500 mb-1">💰 本月毛利</p>
                <p className="text-2xl font-bold text-green-600">¥{revenue.thisMonth.profit.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">
                  共 {revenue.thisMonth.count} 笔 · 营业额 ¥{revenue.thisMonth.amount.toLocaleString()}
                  {revenue.thisMonth.amount > 0 && (
                    <span className="ml-2 text-green-500">({Math.round(revenue.thisMonth.profit / revenue.thisMonth.amount * 100)}% 利润率)</span>
                  )}
                </p>
              </div>
            </>
          )}

          {/* Refresh button */}
          {isOwner && (
            <button onClick={loadData} className="btn-outline w-full text-sm">🔄 刷新数据</button>
          )}
        </div>
      )}

      {/* Logout */}
      <div className="border-t border-gray-200 pt-3">
        <button onClick={onLogout} className="btn-outline w-full text-red-500 border-red-300">🚪 退出登录</button>
      </div>
    </div>
  );
}
