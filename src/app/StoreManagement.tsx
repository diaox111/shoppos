'use client';

import { useState, useEffect, useRef } from 'react';
import { getStore, updateStore, getStaffByStore, createUser, removeUser, getRevenueStats } from '@/lib/db';
import { recognizeLicense } from '@/lib/ai';
import { getAllCities, getCityData, getDefaultDistricts, getAreaDesc, getPricingFactor } from '@/lib/regions';
import type { Store, User, RevenueStats } from '@/types';

const ALL_CITIES = getAllCities();

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

  // Read-only vs edit mode
  const [editing, setEditing] = useState(false);

  // Form
  const [form, setForm] = useState({ name: '', address: '', phone: '', license_no: '', business_scope: '' });
  const [editCity, setEditCity] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editArea, setEditArea] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  // License photo
  const [licenseImage, setLicenseImage] = useState('');
  const [licenseLoading, setLicenseLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Add staff
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPin, setNewStaffPin] = useState('');

  const isOwner = currentUser.role === 'owner';

  const cityData = getCityData(editCity);
  const districts = cityData ? cityData.districts : (editCity ? getDefaultDistricts() : []);
  const areas = districts.find(d => d.name === editDistrict)?.areas || [];
  const areaDesc = getAreaDesc(editCity, editDistrict, editArea);
  const pricingFactor = getPricingFactor(editCity, editDistrict, editArea);

  useEffect(() => { loadData(); }, [storeId]);

  async function loadData() {
    setLoading(true);
    const s = await getStore(storeId);
    if (s) {
      setStore(s);
      setForm({ name: s.name, address: s.address || '', phone: s.phone || '', license_no: s.license_no || '', business_scope: s.business_scope || '' });
      setEditCity(s.city ? s.city.split('-')[0].split(' ')[0] : '');
      setDetailAddress(s.address || '');
      if (s.license_image) setLicenseImage(s.license_image);
    }
    const st = await getStaffByStore(storeId);
    setStaff(st);
    const rev = await getRevenueStats(storeId);
    setRevenue(rev);
    setLoading(false);
  }

  function startEditing() {
    setEditing(true);
    setMsg('');
  }

  async function handleSaveInfo() {
    if (!form.name.trim()) return;
    setSaving(true); setMsg('');
    try {
      const cityParts = [editCity];
      if (editDistrict) cityParts.push('-' + editDistrict);
      if (editArea) cityParts.push(' ' + editArea);
      const cityStr = cityParts.join('');
      await updateStore(storeId, {
        name: form.name.trim(),
        city: cityStr || store?.city,
        address: detailAddress.trim(),
        phone: form.phone.trim(),
        license_no: form.license_no.trim(),
        business_scope: form.business_scope.trim(),
        license_image: licenseImage || undefined,
      });
      await loadData();
      setEditing(false);
      setMsg('✅ 门店信息已保存');
      onStoreUpdated();
    } catch { setMsg('❌ 保存失败'); }
    setSaving(false);
  }

  const handleLicensePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setLicenseImage(base64);
      setLicenseLoading(true);
      setMsg('🔍 AI 识别营业执照中...');
      try {
        const result = await recognizeLicense(base64);
        setForm(prev => ({
          ...prev,
          name: result.company_name || prev.name,
          license_no: result.credit_code || prev.license_no,
          business_scope: result.business_scope || prev.business_scope,
        }));
        setDetailAddress(result.address || detailAddress);
        setMsg('✅ 证照识别完成');
      } catch { setMsg('⚠️ 识别失败，请手动填写'); }
      setLicenseLoading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

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

  // Parse city string for display
  const cityParts = (store?.city || '').match(/^(.+?)(?:-(.+?))?(?:\s(.+))?$/);
  const displayCity = cityParts?.[1] || '';
  const displayDistrict = cityParts?.[2] || '';
  const displayArea = cityParts?.[3] || '';

  return (
    <div className="p-4 space-y-4">
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

      {msg && <div className={`text-sm p-2 rounded-lg ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : msg.startsWith('⚠️') || msg.startsWith('❌') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{msg}</div>}

      {/* ═══ 门店信息 ═══ */}
      {subtab === 'info' && !editing && (
        <div className="space-y-3">
          {/* Read-only display */}
          <div className="card">
            <h3 className="font-bold mb-3 flex justify-between items-center">
              <span>📋 {store?.name || '未命名'}</span>
              {isOwner && <button onClick={startEditing} className="text-blue-600 text-sm font-normal">✏️ 修改</button>}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex"><span className="text-gray-400 w-20 flex-shrink-0">城市</span><span>{displayCity || '未设置'}</span></div>
              {displayDistrict && <div className="flex"><span className="text-gray-400 w-20 flex-shrink-0">区域</span><span>{displayDistrict}</span></div>}
              {displayArea && <div className="flex"><span className="text-gray-400 w-20 flex-shrink-0">地段</span><span>{displayArea}</span></div>}
              {pricingFactor !== 1.0 && <div className="flex"><span className="text-gray-400 w-20 flex-shrink-0">定价系数</span><span className="text-blue-600 font-medium">{pricingFactor}x（{areaDesc?.split('·').pop()?.trim()}）</span></div>}
              <div className="flex"><span className="text-gray-400 w-20 flex-shrink-0">地址</span><span>{store?.address || '未填写'}</span></div>
              <div className="flex"><span className="text-gray-400 w-20 flex-shrink-0">电话</span><span>{store?.phone || '未填写'}</span></div>
            </div>
          </div>

          {store?.license_no || store?.business_scope ? (
            <div className="card">
              <h3 className="font-bold mb-2">📜 证照信息</h3>
              <div className="space-y-1 text-sm">
                {store.license_no && <div className="flex"><span className="text-gray-400 w-20 flex-shrink-0">信用代码</span><span className="font-mono text-xs">{store.license_no}</span></div>}
                {store.business_scope && <div className="flex"><span className="text-gray-400 w-20 flex-shrink-0">经营范围</span><span className="text-xs">{store.business_scope}</span></div>}
              </div>
              {licenseImage && <img src={licenseImage} className="mt-2 w-full h-32 object-contain rounded-lg border bg-gray-50" />}
            </div>
          ) : (
            <div className="card bg-gray-50 text-center py-6 text-gray-400 text-sm">
              📜 未上传证照
              {isOwner && <button onClick={startEditing} className="block mx-auto mt-2 text-blue-600 text-sm">点击上传 →</button>}
            </div>
          )}

          <div className="card bg-gray-50">
            <p className="text-xs text-gray-400"><span className="font-bold">邀请码：</span><code className="bg-gray-200 px-1 rounded">{store?.invite_code}</code></p>
            <p className="text-xs text-gray-400 mt-1"><span className="font-bold">店主：</span>{store?.owner_name || '-'}</p>
            <p className="text-xs text-gray-400 mt-1"><span className="font-bold">创建：</span>{store?.created_at ? new Date(store.created_at).toLocaleDateString('zh-CN') : '-'}</p>
          </div>
          {!isOwner && <div className="text-center text-xs text-gray-400">仅店主可修改门店信息</div>}
        </div>
      )}

      {/* ═══ 门店信息 — 编辑模式 ═══ */}
      {subtab === 'info' && editing && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">✏️ 修改门店信息</h3>
            <button onClick={() => { setEditing(false); setMsg(''); }} className="text-gray-400 text-sm">取消</button>
          </div>

          <div className="card">
            <h3 className="font-bold mb-3">📋 基本信息</h3>
            <div className="space-y-2">
              <div><label className="text-xs text-gray-500 mb-1 block">店名 *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" placeholder="店铺名称" /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">所在城市 *</label>
                <select value={editCity} onChange={e => { setEditCity(e.target.value); setEditDistrict(''); setEditArea(''); }} className="input">
                  <option value="">选择城市</option>
                  {ALL_CITIES.map(c => <option key={c.name} value={c.name}>{c.province} {c.name}</option>)}
                </select></div>
              {editCity && districts.length > 0 && (
                <div><label className="text-xs text-gray-500 mb-1 block">所在区域</label>
                  <select value={editDistrict} onChange={e => { setEditDistrict(e.target.value); setEditArea(''); }} className="input">
                    <option value="">选择区县</option>
                    {districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select></div>
              )}
              {editDistrict && areas.length > 0 && (
                <div><label className="text-xs text-gray-500 mb-1 block">具体地段</label>
                  <select value={editArea} onChange={e => setEditArea(e.target.value)} className="input">
                    <option value="">不选</option>
                    {areas.map(a => <option key={a.name} value={a.name}>{a.name} ({a.desc})</option>)}
                  </select></div>
              )}
              {editCity && areaDesc && <p className="text-xs text-blue-600">📍 {areaDesc}</p>}
              <div><label className="text-xs text-gray-500 mb-1 block">详细地址</label>
                <input value={detailAddress} onChange={e => setDetailAddress(e.target.value)} className="input" placeholder="街道门牌号（手动填写）" /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">联系电话</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input" placeholder="手机或座机号" /></div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold mb-3">📜 证照信息</h3>
            <div className="mb-3">
              {licenseImage ? (
                <div className="relative">
                  <img src={licenseImage} className="w-full h-40 object-contain rounded-xl border border-gray-200 bg-gray-50" />
                  <button onClick={() => { setLicenseImage(''); setMsg(''); }} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center">✕</button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-6 cursor-pointer text-gray-400 hover:border-blue-400 hover:text-blue-500">
                  📸 拍摄营业执照（自动识别）
                  <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleLicensePhoto} className="hidden" />
                </label>
              )}
              {licenseLoading && <div className="flex items-center gap-2 mt-2 text-sm text-blue-600"><div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />识别中...</div>}
              {licenseImage && !licenseLoading && <button onClick={() => fileRef.current?.click()} className="text-xs text-blue-600 mt-1">🔄 重新拍摄</button>}
            </div>
            <div className="space-y-2">
              <div><label className="text-xs text-gray-500 mb-1 block">营业执照号</label>
                <input value={form.license_no} onChange={e => setForm({ ...form, license_no: e.target.value })} className="input" placeholder="统一社会信用代码" /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">经营范围</label>
                <textarea value={form.business_scope} onChange={e => setForm({ ...form, business_scope: e.target.value })} className="input h-20 resize-none" placeholder="拍照自动识别，也可手动修改..." /></div>
            </div>
          </div>

          <button onClick={handleSaveInfo} disabled={saving} className="btn-primary w-full">{saving ? '保存中...' : '💾 保存修改'}</button>
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
                    <button onClick={() => handleRemoveStaff(u.id)} className="text-red-500 text-xs px-2 py-1 rounded hover:bg-red-50">移除</button>
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
                <input value={newStaffPin} onChange={e => setNewStaffPin(e.target.value)} className="input" type="password" placeholder="登录PIN码" inputMode="numeric" />
                <button onClick={handleAddStaff} disabled={!newStaffName.trim() || !newStaffPin.trim()} className="btn-primary w-full">➕ 添加店员</button>
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
          {isOwner && <button onClick={loadData} className="btn-outline w-full text-sm">🔄 刷新数据</button>}
        </div>
      )}

      <div className="border-t border-gray-200 pt-3">
        <button onClick={onLogout} className="btn-outline w-full text-red-500 border-red-300">🚪 退出登录</button>
      </div>
    </div>
  );
}
